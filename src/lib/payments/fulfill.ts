import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import type { SignupPayload } from "@/lib/payments/orders";

/**
 * Account creation shared by the PayU fulfillment path. The money is ALREADY
 * captured when this runs, so any failure here must scrub the auth user but
 * leave the payment order 'completed' (the candidate did pay); the caller
 * stamps gateway_error so support can reconcile by hand. Never delete rows
 * the candidate paid for.
 *
 * Mirrors what the old /api/auth/register route did inline: create the auth
 * user (auto-confirmed), insert the candidates row, roll back the auth user
 * if the candidates insert fails. The payment order itself moves through the
 * orders domain (markOrderCompleted → attachAccountToOrder).
 */
export interface FulfillResult {
  userId: string | null;
  /** Machine-readable failure code when the account could not be created. */
  code?:
    | "EMAIL_TAKEN"
    | "PHONE_TAKEN"
    | "CANDIDATES_INSERT_FAILED"
    | "AUTH_CREATE_FAILED";
  message?: string;
}

function partnerRouteForPlan(plan: string): string {
  return plan === "mentorship_1on1"
    ? "1-on-1 Mentorship (₹8,999)"
    : plan === "pro_all_access"
    ? "CareerLoop Pro (₹4,999)"
    : "Starter 7-Day Trial (₹999)";
}

function serverCandidateId(candidateId: string | undefined): string {
  return typeof candidateId === "string" && /^CL-2026-\d{6}$/.test(candidateId)
    ? candidateId
    : `CL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
}

/**
 * Uploads one base64 asset to the candidate-assets bucket via the service
 * role. Returns the public URL, or `fallback` when anything fails (photo
 * passes its raw base64 as fallback — proctoring needs it; resume passes null
 * — the profile page can re-upload).
 */
async function uploadCandidateAsset(
  admin: ReturnType<typeof getSupabaseAdmin>,
  input: { bucketPath: string; dataUrl: string | null; fallback: string | null; contentType: string }
): Promise<string | null> {
  if (!input.dataUrl) return input.fallback;
  try {
    const base64 = input.dataUrl.includes(",") ? input.dataUrl.split(",")[1] : input.dataUrl;
    const buffer = Buffer.from(base64, "base64");
    if (buffer.length === 0) return input.fallback;
    const { error: uploadErr } = await admin.storage
      .from("candidate-assets")
      .upload(input.bucketPath, buffer, { contentType: input.contentType, upsert: true });
    if (uploadErr) {
      console.warn("PayU fulfill: asset upload failed:", uploadErr.message);
      return input.fallback;
    }
    const { data } = admin.storage.from("candidate-assets").getPublicUrl(input.bucketPath);
    return data.publicUrl;
  } catch (err) {
    console.warn("PayU fulfill: asset upload error:", err);
    return input.fallback;
  }
}

export async function createAccountFromPayload(
  payload: SignupPayload,
  plan: string
): Promise<FulfillResult> {
  const admin = getSupabaseAdmin();
  const email = payload.email.trim().toLowerCase();
  const phoneDigits = String(payload.phone ?? "").replace(/\D/g, "");
  const phone =
    phoneDigits.length === 11 && phoneDigits.startsWith("0")
      ? phoneDigits.slice(1)
      : phoneDigits.length === 12 && phoneDigits.startsWith("91")
      ? phoneDigits.slice(2)
      : phoneDigits;

  // Defensive re-check at fulfill time: a concurrent signup for the same
  // email/phone may have completed since checkout started. Money is already
  // captured in that race, so we report and let the caller stamp the order —
  // never create a second account.
  const [{ data: emailHit }, { data: phoneHit }] = await Promise.all([
    admin.from("candidates").select("candidate_id").eq("email", email).maybeSingle(),
    admin.from("candidates").select("candidate_id").eq("phone", phone).maybeSingle(),
  ]);
  if (emailHit) return { userId: null, code: "EMAIL_TAKEN" };
  if (phoneHit) return { userId: null, code: "PHONE_TAKEN" };

  const candidateId = serverCandidateId(payload.candidateId);
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password: payload.password,
    email_confirm: true,
    user_metadata: {
      full_name: payload.fullName,
      phone,
      domain: payload.domain,
      candidate_id: candidateId,
    },
  });

  if (createErr) {
    const alreadyRegistered =
      createErr.code === "email_exists" ||
      /already (been )?registered|already exists/i.test(createErr.message);
    if (alreadyRegistered) return { userId: null, code: "EMAIL_TAKEN" };
    console.error("PayU fulfill: createUser failed:", createErr);
    return { userId: null, code: "AUTH_CREATE_FAILED", message: createErr.message };
  }

  const authId = created.user.id;
  const rollbackAuthUser = async () => {
    try {
      await admin.auth.admin.deleteUser(authId);
    } catch {
      /* best effort */
    }
  };

  // Assets uploaded here at fulfillment (the browser is on PayU's page by now,
  // so the client can no longer do it). Failures are non-fatal: the account and
  // the payment stand; photo falls back to the raw base64 like the old flow.
  const photoUrl = await uploadCandidateAsset(admin, {
    bucketPath: `photos/${candidateId}_${Date.now()}.jpg`,
    dataUrl: payload.photoBase64 ?? null,
    fallback: payload.photoBase64 ?? null,
    contentType: "image/jpeg",
  });
  const resumeName = payload.resumeName?.trim() || "Resume.pdf";
  const resumeUrl = await uploadCandidateAsset(admin, {
    bucketPath: `resumes/${candidateId}_${resumeName.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
    dataUrl: payload.resumeBase64 ? `data:application/pdf;base64,${payload.resumeBase64}` : null,
    fallback: null,
    contentType: "application/octet-stream",
  });

  try {
    const { error: candErr } = await admin.from("candidates").insert({
      auth_user_id: authId,
      candidate_id: candidateId,
      full_name: payload.fullName,
      email,
      phone,
      domain: payload.domain || null,
      experience: payload.experience ?? null,
      city: payload.city ?? null,
      photo_url: photoUrl,
      resume_url: resumeUrl,
      resume_name: resumeUrl ? resumeName : null,
      partner_route: partnerRouteForPlan(plan),
      updated_at: new Date().toISOString(),
    });
    if (candErr) throw candErr;

    // One verification = one account: burn the OTP challenge for this email.
    await admin
      .from("email_otp_challenges")
      .update({ consumed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("email", email);

    return { userId: authId };
  } catch (err) {
    await rollbackAuthUser();
    console.error("PayU fulfill: candidates insert failed:", err);
    const detail = `${(err as { code?: string })?.code ?? ""}`;
    if (/23505/.test(detail) && /phone/i.test(`${(err as { details?: string })?.details ?? ""}`)) {
      return { userId: null, code: "PHONE_TAKEN" };
    }
    return { userId: null, code: "CANDIDATES_INSERT_FAILED" };
  }
}
