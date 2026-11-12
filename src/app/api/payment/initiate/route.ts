import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  createCheckoutOrder,
  findOrderByTxnId,
  resolvePlan,
  supersedePendingCheckouts,
  type SignupPayload,
} from "@/lib/payments/orders";
import {
  buildCheckoutFields,
  generateTxnId,
  getPayUConfig,
  payUFormAction,
} from "@/lib/payments/payu";
import { isPlanKey } from "@/lib/payments/plans";

export const dynamic = "force-dynamic";

/**
 * Starts a PayU hosted-checkout attempt.
 *
 * Guest signup (pay-first, the only path that creates a pre-account order):
 *   body = { plan, signup: { fullName, email, password, phone, domain,
 *                            experience?, city?, candidateId } }
 *   Validates the dossier, duplicates (email/phone) and the Step-0 OTP BEFORE
 *   any money moves; stashes the payload on the pending order so the verified
 *   callback can create the account. The password is held only until the
 *   callback (or until the attempt is superseded), service-role table only.
 *
 * Signed-in upgrade (e.g. lapsed trial):
 *   body = { plan }   + Authorization: Bearer <supabase access token>
 *
 * Returns the PayU form action + signed fields; the browser auto-POSTs it.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const planKey = isPlanKey(body?.plan) ? body.plan : null;
    if (!planKey) {
      return NextResponse.json(
        { error: "Select a valid plan.", code: "UNKNOWN_PLAN" },
        { status: 400 }
      );
    }
    const plan = await resolvePlan(planKey);
    if (!plan) {
      return NextResponse.json(
        { error: "That plan is not available.", code: "UNKNOWN_PLAN" },
        { status: 400 }
      );
    }

    const cfg = getPayUConfig();

    // Signed-in upgrade? A valid bearer token turns this into an account-bound order.
    const bearer = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
    let userId: string | null = null;
    if (bearer) {
      const { data } = await getSupabaseAdmin().auth.getUser(bearer);
      userId = data.user?.id ?? null;
    }

    let signupPayload: SignupPayload | null = null;
    let firstname: string;
    let email: string;
    let phone: string | undefined;

    if (userId) {
      const { data } = await getSupabaseAdmin().auth.admin.getUserById(userId);
      email = (data.user?.email ?? "").trim().toLowerCase();
      const metaName =
        typeof data.user?.user_metadata?.full_name === "string" ? data.user.user_metadata.full_name : "";
      firstname = safeFirstname(metaName) ?? safeFirstname(email.split("@")[0]) ?? "Candidate";
    } else {
      const raw = (body?.signup ?? {}) as Record<string, unknown>;
      const normalizedEmail = String(raw.email ?? "").trim().toLowerCase();
      const password = typeof raw.password === "string" ? raw.password : "";
      const fullName = String(raw.fullName ?? "").trim();
      const phoneDigits = String(raw.phone ?? "").replace(/\D/g, "");
      const normalizedPhone =
        phoneDigits.length === 11 && phoneDigits.startsWith("0")
          ? phoneDigits.slice(1)
          : phoneDigits.length === 12 && phoneDigits.startsWith("91")
          ? phoneDigits.slice(2)
          : phoneDigits;

      if (!normalizedEmail || !/^[^@\s|]+@[^@\s|]+\.[^@\s|]+$/.test(normalizedEmail)) {
        return NextResponse.json(
          { error: "Enter a valid email address.", code: "INVALID_EMAIL" },
          { status: 400 }
        );
      }
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters", code: "WEAK_PASSWORD" },
          { status: 400 }
        );
      }
      if (!fullName) {
        return NextResponse.json(
          { error: "Full name is required.", code: "INVALID_NAME" },
          { status: 400 }
        );
      }
      if (!/^\d{10}$/.test(normalizedPhone)) {
        return NextResponse.json(
          { error: "Enter a valid 10-digit mobile number.", code: "INVALID_PHONE" },
          { status: 400 }
        );
      }

      const admin = getSupabaseAdmin();

      // Duplicates must fail BEFORE money moves.
      const [{ data: emailHit }, { data: phoneHit }] = await Promise.all([
        admin.from("candidates").select("candidate_id").eq("email", normalizedEmail).maybeSingle(),
        admin.from("candidates").select("candidate_id").eq("phone", normalizedPhone).maybeSingle(),
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

      // The OTP verification from Step 0 must still be fresh and unconsumed.
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

      await supersedePendingCheckouts({ email: normalizedEmail });

      const photoBase64 = typeof raw.photoBase64 === "string" ? raw.photoBase64 : null;
      const resumeBase64 = typeof raw.resumeBase64 === "string" ? raw.resumeBase64 : null;
      const resumeName = typeof raw.resumeName === "string" ? raw.resumeName.slice(0, 200) : null;
      if (photoBase64 && photoBase64.length > 900_000) {
        return NextResponse.json(
          { error: "The captured photo is too large to carry through checkout. Retake it and try again.", code: "PHOTO_TOO_LARGE" },
          { status: 400 }
        );
      }
      if (resumeBase64 && resumeBase64.length > 3_200_000) {
        return NextResponse.json(
          { error: "The resume is too large for checkout (max ~2.4 MB). Compress it and try again.", code: "RESUME_TOO_LARGE" },
          { status: 400 }
        );
      }

      signupPayload = {
        fullName,
        email: normalizedEmail,
        password,
        phone: normalizedPhone,
        domain: typeof raw.domain === "string" ? raw.domain : "",
        experience: typeof raw.experience === "string" ? raw.experience : null,
        city: typeof raw.city === "string" ? raw.city : null,
        candidateId: typeof raw.candidateId === "string" ? raw.candidateId : "",
        photoBase64,
        resumeBase64,
        resumeName,
      };
      email = normalizedEmail;
      firstname = safeFirstname(fullName) ?? "Candidate";
      phone = normalizedPhone;
    }

    if (userId) await supersedePendingCheckouts({ userId });

    const txnid = generateTxnId();
    // A unique collision would surface as a 23505 on insert; vanishingly rare, and a 500 is honest.
    const existing = await findOrderByTxnId(txnid);
    if (existing) throw new Error("txnid collision — retry");

    await createCheckoutOrder({ userId, plan, txnid, signupPayload });

    const fields = buildCheckoutFields(cfg, {
      txnid,
      amountInr: plan.amountInr,
      // PayU hash breaks on "|" — strip it from every interpolated value.
      productinfo: plan.name.replace(/\|/g, "/"),
      firstname: firstname.replace(/\|/g, " "),
      email: email.replace(/\|/g, ""),
      phone,
    });

    return NextResponse.json({
      success: true,
      action: payUFormAction(cfg.mode),
      txnid,
      fields,
    });
  } catch (err) {
    console.error("payment/initiate error:", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message, code: "INITIATE_FAILED" }, { status: 500 });
  }
}

/** PayU wants a sane first name; strips to letters/marks/spaces, trims, caps length. */
function safeFirstname(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const first = raw.trim().split(/\s+/)[0] ?? "";
  const cleaned = first.replace(/[^\p{L}\p{M}.'-]/gu, "").slice(0, 60).trim();
  return cleaned || null;
}
