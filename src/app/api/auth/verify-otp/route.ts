import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  normalizeEmail,
  otpMatches,
  OTP_MAX_ATTEMPTS,
  OTP_VERIFIED_TTL_MINUTES,
} from "@/lib/email/otp";

export const dynamic = "force-dynamic";

/**
 * Verifies the 6-digit signup code. On success the challenge is marked
 * verified for 60 minutes — /api/payment/initiate requires that mark (and
 * the payment callback consumes it) before an account can be created.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(body?.email);
    const otp = typeof body?.otp === "string" ? body.otp.replace(/\D/g, "") : "";
    if (!email || otp.length !== 6) {
      return NextResponse.json(
        { error: "Enter the 6-digit code from your email.", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();
    const { data: ch } = await admin
      .from("email_otp_challenges")
      .select("otp_hash, expires_at, attempts, consumed_at")
      .eq("email", email)
      .maybeSingle();

    const now = Date.now();
    if (!ch || ch.consumed_at) {
      return NextResponse.json(
        { error: "No active code for this email. Request a new one.", code: "NO_ACTIVE_CODE" },
        { status: 400 }
      );
    }
    if (new Date(ch.expires_at).getTime() < now) {
      return NextResponse.json(
        { error: "That code has expired. Request a new one.", code: "OTP_EXPIRED" },
        { status: 400 }
      );
    }
    const attempts = Number(ch.attempts ?? 0);
    if (attempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many wrong attempts. Request a new code.", code: "TOO_MANY_ATTEMPTS" },
        { status: 429 }
      );
    }

    if (!otpMatches(email, otp, ch.otp_hash)) {
      const attemptsLeft = OTP_MAX_ATTEMPTS - (attempts + 1);
      await admin
        .from("email_otp_challenges")
        .update({ attempts: attempts + 1, updated_at: new Date().toISOString() })
        .eq("email", email);
      return NextResponse.json(
        {
          error:
            attemptsLeft > 0
              ? `Incorrect code. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left.`
              : "Incorrect code. Request a new one.",
          code: "INVALID_OTP",
          attemptsLeft,
        },
        { status: 400 }
      );
    }

    const { error: verifyErr } = await admin
      .from("email_otp_challenges")
      .update({
        verified_at: new Date(now).toISOString(),
        verified_expires_at: new Date(now + OTP_VERIFIED_TTL_MINUTES * 60_000).toISOString(),
        attempts: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email);
    if (verifyErr) throw verifyErr;

    return NextResponse.json({ success: true, verifiedForMinutes: OTP_VERIFIED_TTL_MINUTES });
  } catch (err) {
    console.error("verify-otp error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", code: "INTERNAL" },
      { status: 500 }
    );
  }
}
