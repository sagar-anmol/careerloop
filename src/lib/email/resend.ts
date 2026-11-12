import { randomUUID } from "crypto";
import { Resend } from "resend";
import { BRAND, otpCodeBlock, renderBrandedEmail } from "./template";

/**
 * Transactional email via Resend. Server-only: the API key lives in
 * RESEND_API_KEY and never reaches the client bundle.
 *
 * Sending domain: CareerLoop owns `m.careerloop.co.in` (verified in Resend),
 * so `RESEND_FROM` points at an address on that subdomain. The key is
 * domain-scoped — a `from` on any other domain is rejected by the API.
 */
const DEFAULT_FROM = "CareerLoop <hello@m.careerloop.co.in>";

function fromAddress(): string {
  return process.env.RESEND_FROM ?? DEFAULT_FROM;
}

function replyToAddress(): string {
  const raw = process.env.OTP_MAIL_REPLY_TO?.trim();
  return raw || BRAND.replyEmail;
}

export interface SendResult {
  /** Resend email id when accepted. */
  id?: string;
  error?: string;
}

interface BrandedMessage {
  to: string;
  subject: string;
  heading: string;
  preheader: string;
  bodyHtml: string;
  codeBlockHtml?: string;
  footnoteHtml?: string;
  /** Plain-text alternative; never an HTML dump. */
  text: string;
}

/** One send with a single retry on network failure (never on 4xx). */
async function deliver(payload: BrandedMessage): Promise<SendResult> {
  if (!process.env.RESEND_API_KEY) {
    return { error: "RESEND_API_KEY is not configured." };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const message = {
    from: fromAddress(),
    to: [payload.to],
    subject: payload.subject,
    text: payload.text,
    html: renderBrandedEmail({
      heading: payload.heading,
      preheader: payload.preheader,
      bodyHtml: payload.bodyHtml,
      codeBlockHtml: payload.codeBlockHtml,
      footnoteHtml:
        payload.footnoteHtml ??
        `You are receiving this because someone started a CareerLoop enrollment with this address.
         If it was not you, no action is needed — the message can be ignored safely.`,
    }),
    replyTo: replyToAddress(),
  };

  try {
    const { data, error } = await resend.emails.send(message, {
      headers: { "Idempotency-Key": randomUUID() },
    });
    if (error) return { error: error.message };
    return { id: data?.id };
  } catch {
    // Transient network failure — retry once, with its own idempotency key.
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const { data, error } = await resend.emails.send(message, {
        headers: { "Idempotency-Key": randomUUID() },
      });
      if (error) return { error: error.message };
      return { id: data?.id };
    } catch (retryErr) {
      return { error: retryErr instanceof Error ? retryErr.message : "Network error" };
    }
  }
}

/** Generic branded transactional mail (same logo, palette and footer). */
export async function sendBrandedEmail(message: BrandedMessage): Promise<SendResult> {
  return deliver(message);
}

export async function sendOtpEmail(to: string, otp: string, ttlMinutes: number): Promise<SendResult> {
  const bodyText =
    "Enter this 6-digit code on the registration screen to finish creating your CareerLoop account.";
  const bodyHtml = `<p style="margin:0 0 12px 0;">Enter this 6-digit code on the registration screen to finish creating your
        <strong style="color:${BRAND.heading};">CareerLoop</strong> account.</p>
      <p style="margin:0 0 12px 0;">We ask for it so every enrollment is verified by a real inbox — one verified code creates exactly one account.</p>`;

  return deliver({
    to,
    subject: `Your CareerLoop verification code: ${otp}`,
    heading: "Verify your email address",
    preheader: `Your CareerLoop code is ${otp}. It expires in ${ttlMinutes} minutes.`,
    bodyHtml,
    codeBlockHtml: otpCodeBlock(otp, ttlMinutes),
    footnoteHtml: `Code valid for ${ttlMinutes} minutes. You have 5 attempts before a new code is required.
      <br /><strong style="color:${BRAND.text};">Reply to this email</strong> if you need help — it reaches ${BRAND.replyEmail}.`,
    text: [
      "Welcome to CareerLoop!",
      "",
      `Your email verification code is: ${otp}`,
      "",
      bodyText,
      "",
      `It is valid for ${ttlMinutes} minutes and allows 5 attempts. If you did not request it, you can ignore this email.`,
      "",
      "Need help? You can simply reply to this email — it reaches our team directly.",
      "",
      "— Team CareerLoop",
      BRAND.siteUrl,
    ].join("\n"),
  });
}
