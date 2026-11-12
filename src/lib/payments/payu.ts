/**
 * PayU India — Hosted (PayU-hosted) Checkout.
 *
 * Nothing here is client-safe: the merchant salt is used to SHA-512 sign the
 * request and to verify the response hash. The client only ever sees the
 * fields this module hands to /api/payment/initiate, plus PayU's own page.
 *
 * Hash contract (PayU docs, "Generate Hash / Merchant Hosted Checkout"):
 *
 *   request  hash = sha512(key|txnid|amount|productinfo|firstname|email
 *                          |udf1|…|udf10 |SALT)          — udfs all empty here
 *   response hash = sha512(SALT|status|udf10|…|udf1
 *                          |email|firstname|productinfo|amount|txnid|key)
 *
 * Amounts are always "<n>.00". surl/furl BOTH point at our callback: the
 * callback inspects `status` and routes to /payment/success or
 * /payment/failed itself.
 */
import { createHash, randomBytes } from "node:crypto";

export type PayUMode = "live" | "test";

export interface PayUConfig {
  key: string;
  salt: string;
  mode: PayUMode;
  /** Absolute site origin used to build surl/furl. No trailing slash. */
  baseUrl: string;
}

export function getPayUConfig(): PayUConfig {
  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;
  if (!key || !salt) {
    throw new Error("Payment is not configured: PAYU_KEY/PAYU_SALT are not set.");
  }
  const mode: PayUMode = (process.env.PAYU_MODE ?? "live").toLowerCase() === "test" ? "test" : "live";
  const baseUrl = (process.env.PAYU_BASE_URL ?? "https://www.careerloop.co.in").replace(/\/+$/, "");
  return { key, salt, mode, baseUrl };
}

/** Where the browser POSTs the checkout form to. */
export function payUFormAction(mode: PayUMode): string {
  return mode === "test" ? "https://test.payu.in/_payment" : "https://secure.payu.in/_payment";
}

/** PayU server-to-server endpoint for the verify_payment command. */
function payUPostserviceUrl(mode: PayUMode): string {
  return mode === "test"
    ? "https://test.payu.in/merchant/postservice.php?form=2"
    : "https://secure.payu.in/merchant/postservice.php?form=2";
}

export function sha512(input: string): string {
  return createHash("sha512").update(input, "utf8").digest("hex");
}

/** Two-decimal rupee string, exactly what PayU expects ("999.00"). */
export function formatAmount(amountInr: number): string {
  return amountInr.toFixed(2);
}

/** Alphanumeric, unique, short (PayU txnid limit is 25 chars). */
export function generateTxnId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = randomBytes(4).toString("hex").toUpperCase(); // 8 hex chars
  return `CL${time}${rand}`.slice(0, 25);
}

export interface PayUCheckoutInput {
  txnid: string;
  amountInr: number;
  productinfo: string;
  firstname: string;
  email: string;
  phone?: string;
}

export interface PayUCheckoutFields {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone?: string;
  surl: string;
  furl: string;
  hash: string;
}

/** Builds the exact field set the hosted-checkout form must POST, signature included. */
export function buildCheckoutFields(cfg: PayUConfig, input: PayUCheckoutInput): PayUCheckoutFields {
  const amount = formatAmount(input.amountInr);
  const udfs = Array.from({ length: 10 }, () => "");
  const requestHash = sha512(
    [cfg.key, input.txnid, amount, input.productinfo, input.firstname, input.email, ...udfs, cfg.salt].join("|")
  );
  const callbackUrl = `${cfg.baseUrl}/api/payment/callback`;
  const fields: PayUCheckoutFields = {
    key: cfg.key,
    txnid: input.txnid,
    amount,
    productinfo: input.productinfo,
    firstname: input.firstname,
    email: input.email,
    surl: callbackUrl,
    furl: callbackUrl,
    hash: requestHash,
  };
  if (input.phone) fields.phone = input.phone;
  return fields;
}

/**
 * Verifies the reverse hash PayU signs the response with. Returns true only if
 * the payload genuinely came from PayU AND we still hold the salt to prove it.
 * `params` is the raw form body of the callback POST.
 */
export function verifyResponseHash(cfg: PayUConfig, params: Record<string, string>): boolean {
  const provided = params.hash;
  if (!provided) return false;
  const udfs = Array.from({ length: 10 }, (_, i) => params[`udf${10 - i}`] ?? ""); // udf10..udf1
  const expected = sha512(
    [
      cfg.salt,
      params.status ?? "",
      ...udfs,
      params.email ?? "",
      params.firstname ?? "",
      params.productinfo ?? "",
      params.amount ?? "",
      params.txnid ?? "",
      cfg.key,
    ].join("|")
  );
  return timingSafeEqualHex(provided.toLowerCase(), expected.toLowerCase());
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export interface VerifyPaymentResult {
  /** true only when PayU confirms the transaction exists and reports success. */
  ok: boolean;
  /** Present when PayU answered at all — useful for audit logs. */
  gatewayStatus?: string;
}

/**
 * Second source of truth recommended by PayU after a successful callback hash:
 * calls the `verify_payment` command (sha512(key|command|var1|salt)) for the
 * txnid and checks PayU-side state. Never throws — on a network/API failure we
 * return ok:false but the caller decides whether to trust the hash alone.
 */
export async function verifyPayment(cfg: PayUConfig, txnid: string): Promise<VerifyPaymentResult> {
  const command = "verify_payment";
  const hash = sha512([cfg.key, command, txnid, cfg.salt].join("|"));
  const body = new URLSearchParams({ key: cfg.key, command, var1: txnid, hash });
  try {
    const res = await fetch(payUPostserviceUrl(cfg.mode), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false };
    const json = (await res.json().catch(() => null)) as {
      status?: number | string;
      transaction_details?: Record<string, { status?: string } | undefined>;
    } | null;
    const detail = json?.transaction_details?.[txnid];
    const gatewayStatus = typeof detail?.status === "string" ? detail.status : undefined;
    const ok =
      (json?.status === 1 || json?.status === "1") &&
      typeof gatewayStatus === "string" &&
      /^(success|captured|completed)$/i.test(gatewayStatus);
    return { ok, gatewayStatus };
  } catch {
    return { ok: false };
  }
}
