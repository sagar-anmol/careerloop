import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { isPlanKey, normalizeUtr, getUpiConfig } from "@/lib/payments/upi";
import { resolvePlan } from "@/lib/payments/orders";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize admin client with service role key to auto-confirm users and update passwords
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * CareerLoop enrollment is paid: an account cannot be created unless a valid
 * UPI UTR is supplied together with the plan. Registration therefore:
 *
 *   1. validates everything up front (email, password, phone, plan, UTR),
 *   2. refuses early on duplicates (email / phone / UTR) — before any user row
 *      exists — so a failed signup creates nothing,
 *   3. creates the auth user, then the candidates row and the payment order
 *      (server-derived amount), and ROLLS BACK the auth user if any of those
 *      steps fails (e.g. a UTR claimed by a concurrent signup).
 *
 * Email and mobile uniqueness are enforced twice: by the pre-checks below and
 * by the unique indexes on `candidates`. UTR uniqueness is enforced by the
 * unique constraint on `payment_orders.utr`.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, fullName, phone, domain, experience, city, candidateId } = body ?? {};

    const plan = typeof body?.plan === "string" ? body.plan : "";
    const utr = normalizeUtr(body?.utr);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters", code: "WEAK_PASSWORD" },
        { status: 400 }
      );
    }
    if (!isPlanKey(plan)) {
      return NextResponse.json(
        { error: "Select a valid plan.", code: "UNKNOWN_PLAN" },
        { status: 400 }
      );
    }
    if (!utr) {
      return NextResponse.json(
        { error: "Enter a valid 12-digit UTR from your UPI receipt.", code: "INVALID_UTR" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const phoneDigits = String(phone ?? "").replace(/\D/g, "");
    const normalizedPhone =
      phoneDigits.length === 11 && phoneDigits.startsWith("0")
        ? phoneDigits.slice(1)
        : phoneDigits.length === 12 && phoneDigits.startsWith("91")
        ? phoneDigits.slice(2)
        : phoneDigits;
    if (!/^\d{10}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit mobile number.", code: "INVALID_PHONE" },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();

    // Resolve server-side values BEFORE creating anything.
    const planView = await resolvePlan(plan);
    if (!planView) {
      return NextResponse.json(
        { error: "That plan is not available.", code: "UNKNOWN_PLAN" },
        { status: 400 }
      );
    }
    let upiId: string;
    try {
      upiId = getUpiConfig().upiId;
    } catch {
      return NextResponse.json(
        { error: "Payment is not configured.", code: "PAYMENT_CONFIG" },
        { status: 500 }
      );
    }

    // Early duplicate checks — nothing is created when they fire.
    const [{ data: emailHit }, { data: phoneHit }, { data: utrHit }] = await Promise.all([
      admin.from("candidates").select("candidate_id").eq("email", normalizedEmail).maybeSingle(),
      admin.from("candidates").select("candidate_id").eq("phone", normalizedPhone).maybeSingle(),
      admin.from("payment_orders").select("id").eq("utr", utr).limit(1).maybeSingle(),
    ]);
    if (emailHit) {
      return NextResponse.json(
        { error: "An account with this email already exists. Sign in instead.", code: "EMAIL_TAKEN" },
        { status: 409 }
      );
    }
    if (phoneHit) {
      return NextResponse.json(
        { error: "This mobile number is already registered with another account.", code: "PHONE_TAKEN" },
        { status: 409 }
      );
    }
    if (utrHit) {
      return NextResponse.json(
        { error: "This UTR is already used by another payment. Enter the UTR from your own UPI receipt.", code: "UTR_TAKEN" },
        { status: 409 }
      );
    }

    // Human-verification gate: the email must carry a recently verified OTP
    // (sent + verified on the registration screen). No verified code → no
    // account. The code is consumed only AFTER everything below succeeds, so
    // a rolled-back signup (e.g. UTR race) doesn't burn the verification.
    const { data: otpChallenge } = await admin
      .from("email_otp_challenges")
      .select("verified_at, verified_expires_at, consumed_at")
      .eq("email", normalizedEmail)
      .maybeSingle();
    const otpVerified =
      otpChallenge &&
      !otpChallenge.consumed_at &&
      otpChallenge.verified_at !== null &&
      otpChallenge.verified_expires_at !== null &&
      new Date(otpChallenge.verified_expires_at).getTime() > Date.now();
    if (!otpVerified) {
      return NextResponse.json(
        {
          error: "Verify your email with the 6-digit code before creating the account.",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }

    // Create the account. Never reset the password of an existing email.
    const { data: created, error: createErr } = await adminSupabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone: normalizedPhone,
        domain,
        candidate_id: candidateId,
      },
    });

    if (createErr) {
      const alreadyRegistered =
        createErr.code === "email_exists" ||
        /already (been )?registered|already exists/i.test(createErr.message);
      if (alreadyRegistered) {
        return NextResponse.json(
          { error: "An account with this email already exists. Sign in instead.", code: "EMAIL_TAKEN" },
          { status: 409 }
        );
      }
      console.error("Create user error:", createErr);
      return NextResponse.json({ error: createErr.message }, { status: 400 });
    }

    const authId = created.user.id;
    const rollback = async () => {
      try {
        await admin.from("candidates").delete().eq("auth_user_id", authId);
      } catch {
        /* best effort */
      }
      try {
        await adminSupabase.auth.admin.deleteUser(authId);
      } catch {
        /* best effort */
      }
    };

    try {
      const partnerRoute =
        plan === "mentorship_1on1"
          ? "1-on-1 Mentorship (₹8,999)"
          : plan === "pro_all_access"
          ? "CareerLoop Pro (₹4,999)"
          : "Starter 7-Day Trial (₹999)";
      const serverCandidateId =
        typeof candidateId === "string" && /^CL-2026-\d{6}$/.test(candidateId)
          ? candidateId
          : `CL-2026-${Math.floor(100000 + Math.random() * 900000)}`;

      const { error: candErr } = await admin.from("candidates").insert({
        auth_user_id: authId,
        candidate_id: serverCandidateId,
        full_name: typeof fullName === "string" ? fullName : "",
        email: normalizedEmail,
        phone: normalizedPhone,
        domain: typeof domain === "string" ? domain : null,
        experience: typeof experience === "string" ? experience : null,
        city: typeof city === "string" ? city : null,
        partner_route: partnerRoute,
        updated_at: new Date().toISOString(),
      });
      if (candErr) throw candErr;

      const { error: orderErr } = await admin.from("payment_orders").insert({
        user_id: authId,
        plan,
        amount_inr: planView.amountInr,
        upi_id: upiId,
        utr,
        status: "pending",
      });
      if (orderErr) throw orderErr;

      // Everything succeeded — burn the OTP so one verification = one account.
      await admin
        .from("email_otp_challenges")
        .update({ consumed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("email", normalizedEmail);

      return NextResponse.json({
        success: true,
        user: { id: authId, email: created.user?.email },
      });
    } catch (err) {
      await rollback();
      const detail = `${(err as { message?: string })?.message ?? ""} ${(err as { details?: string })?.details ?? ""} ${(err as { code?: string })?.code ?? ""}`;
      if (/23505/.test(detail) && /utr/i.test(detail)) {
        return NextResponse.json(
          { error: "This UTR is already used by another payment. Enter the UTR from your own UPI receipt.", code: "UTR_TAKEN" },
          { status: 409 }
        );
      }
      if (/23505/.test(detail) && /phone/i.test(detail)) {
        return NextResponse.json(
          { error: "This mobile number is already registered with another account.", code: "PHONE_TAKEN" },
          { status: 409 }
        );
      }
      if (/23505/.test(detail)) {
        return NextResponse.json(
          { error: "An account with these details already exists. Sign in instead.", code: "EMAIL_TAKEN" },
          { status: 409 }
        );
      }
      console.error("Registration rolled back after failure:", err);
      return NextResponse.json(
        { error: "Could not complete registration. No account was created — please try again.", code: "INTERNAL" },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    console.error("Auth register API route error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
