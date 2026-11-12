import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  generateOtp,
  hashOtp,
  normalizeEmail,
  OTP_HOURLY_SEND_CAP,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_TTL_MINUTES,
} from "@/lib/email/otp";
import { sendOtpEmail } from "@/lib/email/resend";

export const dynamic = "force-dynamic";

/**
 * Sends a 6-digit signup verification code to the given email (via Resend).
 * Called from the onboarding Step 0 as soon as the candidate completes the
 * email field. Guards: format validation, 60s resend cooldown, hourly send
 * cap. The code is stored only as a peppered hash.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(body?.email);
    if (!email) {
      return NextResponse.json(
        { error: "Enter a valid email address.", code: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();
    const { data: existing } = await admin
      .from("email_otp_challenges")
      .select("last_sent_at, sent_count")
      .eq("email", email)
      .maybeSingle();

    const now = Date.now();
    let sentCount = 0;
    if (existing) {
      const sinceMs = now - new Date(existing.last_sent_at).getTime();
      if (sinceMs < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
        const retryAfterSeconds = Math.ceil((OTP_RESEND_COOLDOWN_SECONDS * 1000 - sinceMs) / 1000);
        return NextResponse.json(
          {
            error: `Please wait ${retryAfterSeconds}s before requesting a new code.`,
            code: "COOLDOWN",
            retryAfterSeconds,
          },
          { status: 429 }
        );
      }
      // Hourly cap: a send older than an hour resets the counter.
      sentCount = sinceMs > 3_600_000 ? 0 : Number(existing.sent_count ?? 0);
      if (sentCount >= OTP_HOURLY_SEND_CAP) {
        return NextResponse.json(
          { error: "Too many codes requested. Try again in about an hour.", code: "TOO_MANY_SENT" },
          { status: 429 }
        );
      }
    }

    const otp = generateOtp();
    const { error: upsertErr } = await admin
      .from("email_otp_challenges")
      .upsert({
        email,
        otp_hash: hashOtp(email, otp),
        sent_count: sentCount + 1,
        last_sent_at: new Date().toISOString(),
        expires_at: new Date(now + OTP_TTL_MINUTES * 60_000).toISOString(),
        attempts: 0,
        verified_at: null,
        verified_expires_at: null,
        consumed_at: null,
        updated_at: new Date().toISOString(),
      });
    if (upsertErr) throw upsertErr;

    const mail = await sendOtpEmail(email, otp, OTP_TTL_MINUTES);
    if (mail.error) {
      console.error("OTP email send failed:", mail.error);
      // Drop the challenge so the candidate can retry immediately instead of
      // waiting out the 60s cooldown on a code that never reached them.
      await admin.from("email_otp_challenges").delete().eq("email", email);
      return NextResponse.json(
        { error: "Could not send the verification email right now. Please try again.", code: "SEND_FAILED" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      cooldownSeconds: OTP_RESEND_COOLDOWN_SECONDS,
      expiresInSeconds: OTP_TTL_MINUTES * 60,
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", code: "INTERNAL" },
      { status: 500 }
    );
  }
}
