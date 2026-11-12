/**
 * Server-side payment configuration and plan catalogue.
 *
 * Two rules that differ from the fest26 source on purpose:
 *  1. The UPI ID / payee name are SERVER-ONLY. They come from env here; the
 *     UPI id itself is never sent to the browser as a field and never shown in
 *     the UI — it only exists inside the server-built UPI URI (QR image +
 *     mobile deep link) and the `payment_orders.upi_id` row for admin audit.
 *  2. The price is NEVER taken from the client. `/api/payment/create` looks the
 *     plan up here (or in the `payment_plans` table) and derives the amount.
 */

export type PlanKey = "starter_practice" | "pro_all_access" | "mentorship_1on1";

export interface PlanDefinition {
  key: PlanKey;
  name: string;
  amountInr: number;
}

/**
 * Fallback catalogue used to seed the DB and as a backstop if the
 * `payment_plans` table has not been migrated yet. The DB row is authoritative
 * once present (an admin can adjust a price without a redeploy).
 */
export const PLAN_CATALOG: Record<PlanKey, PlanDefinition> = {
  starter_practice: { key: "starter_practice", name: "Starter 7-Day Trial Pass", amountInr: 999 },
  pro_all_access: { key: "pro_all_access", name: "CareerLoop Pro All-Access Pass", amountInr: 4999 },
  mentorship_1on1: { key: "mentorship_1on1", name: "1-on-1 Intensive Mentorship Track", amountInr: 8999 },
};

/** The entry plan is a time-boxed trial: it expires this many days after the admin verifies the UTR. */
export const TRIAL_PLAN: PlanKey = "starter_practice";
export const TRIAL_DURATION_DAYS = 7;

export const DEFAULT_PLAN: PlanKey = "pro_all_access";

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && value in PLAN_CATALOG;
}

export interface UpiConfig {
  upiId: string;
  payeeName: string;
  note: string;
}

/**
 * Reads the UPI destination from the environment. Throws if unset so a route
 * fails loudly instead of generating a QR that pays nobody. The values are
 * server-only: the client receives them solely through the API response, which
 * it must do in order to render the QR/deep link anyway.
 */
export function getUpiConfig(): UpiConfig {
  const upiId = process.env.PAYMENT_UPI_ID;
  const payeeName = process.env.PAYMENT_PAYEE_NAME || "CareerLoop";
  const note = process.env.PAYMENT_NOTE || "CareerLoop Enrollment";

  if (!upiId) {
    throw new Error("Payment is not configured: PAYMENT_UPI_ID is not set.");
  }
  return { upiId, payeeName, note };
}

/** Builds the standard UPI deep link used both for the QR payload and the mobile hand-off. */
export function buildUpiUri(upiId: string, payeeName: string, amountInr: number, note: string): string {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amountInr),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

/** QR is rendered by a public service so we ship no native QR dependency. */
export function buildQrImageUrl(upiUri: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;
}

/**
 * UTR = the 12-digit bank reference number from the payer's receipt.
 * Basic sanity checks: exactly 12 digits, and not a repeated single digit
 * (000000000000 / 111111111111 …), which no real receipt carries.
 */
export function normalizeUtr(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const clean = input.replace(/\D/g, "");
  if (!/^[0-9]{12}$/.test(clean)) return null;
  if (/^(\d)\1{11}$/.test(clean)) return null;
  return clean;
}