import crypto from "crypto";

/**
 * Signup email-verification OTP primitives. Server-only.
 *
 * The 6-digit code is generated from crypto random, stored ONLY as a peppered
 * SHA-256 hash (the DB never sees the code), and compared timing-safely.
 */
export const OTP_TTL_MINUTES = 10;
export const OTP_VERIFIED_TTL_MINUTES = 60;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
/** Hourly cap on codes per email before we ask the candidate to wait. */
export const OTP_HOURLY_SEND_CAP = 10;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const clean = input.trim().toLowerCase();
  return EMAIL_PATTERN.test(clean) ? clean : null;
}

export function generateOtp(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOtp(email: string, otp: string): string {
  const pepper = process.env.OTP_PEPPER ?? "";
  return crypto.createHash("sha256").update(`${email}:${otp}:${pepper}`).digest("hex");
}

export function otpMatches(email: string, otp: string, hash: string): boolean {
  const a = Buffer.from(hashOtp(email, otp));
  const b = Buffer.from(hash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
