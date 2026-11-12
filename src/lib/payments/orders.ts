import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  authenticateRequest as examAuthenticateRequest,
  type ApiError,
} from "@/lib/exams/attempts";
import {
  DEFAULT_PLAN,
  PLAN_CATALOG,
  TRIAL_DURATION_DAYS,
  TRIAL_PLAN,
  type PlanKey,
  isPlanKey,
} from "@/lib/payments/plans";

/**
 * Payment order domain logic. Every rule that matters is enforced here, never
 * in the browser: the amount comes from the server-side plan table, and an
 * order only becomes 'completed' after PayU's callback verifies the hash.
 *
 * Lifecycle (pay-first, account after payment):
 *   1. /api/payment/initiate validates the dossier + OTP + duplicates, then
 *      inserts a 'pending' row keyed by a unique `txnid`. For guest signup the
 *      row carries `signup_payload` (incl. the plaintext password) and a NULL
 *      user_id; the account does not exist yet. For a signed-in upgrade the
 *      row carries user_id and no payload.
 *   2. PayU POSTs /api/payment/callback; on a verified success the row flips to
 *      'completed' (starter plans get expires_at = verified_at + 7 days) and,
 *      for guest signups, the account is created and signup_payload is wiped.
 */

/** Step-0 dossier held between checkout and the callback. Wiped at fulfillment. */
export interface SignupPayload {
  fullName: string;
  email: string;
  /** Plaintext by necessity: Supabase hashes it at account creation, then this is nulled. */
  password: string;
  phone: string;
  domain: string;
  experience?: string | null;
  city?: string | null;
  candidateId: string;
  /** "data:image/jpeg;base64,…" — uploaded to candidate-assets at fulfillment. */
  photoBase64?: string | null;
  /** Raw base64 (no data-url prefix) of the resume, if small enough to ride along. */
  resumeBase64?: string | null;
  resumeName?: string | null;
}

export interface PaymentOrder {
  id: string;
  /** NULL until the account exists (guest signup) — set at fulfillment. */
  user_id: string | null;
  plan: PlanKey;
  amount_inr: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
  verified_at: string | null;
  /** Trial plans only: entitlement lapses at this instant. Null = never expires. */
  expires_at: string | null;
  gateway: "payu" | "legacy_upi";
  txnid: string | null;
  mihpayid: string | null;
  gateway_status: string | null;
  gateway_error: string | null;
  signup_payload: SignupPayload | null;
  account_created_at: string | null;
}

export interface PlanView {
  plan: PlanKey;
  name: string;
  amountInr: number;
}

/** Resolves the authoritative price for a plan: DB row first, then the code catalogue. */
export async function resolvePlan(planKey: string): Promise<PlanView | null> {
  if (!isPlanKey(planKey)) return null;

  const { data } = await getSupabaseAdmin()
    .from("payment_plans")
    .select("plan, name, amount_inr, is_active")
    .eq("plan", planKey)
    .maybeSingle();

  if (data) {
    // A row exists but is disabled — the plan is off sale; do NOT fall back to the code price.
    if (data.is_active === false) return null;
    return { plan: planKey, name: data.name, amountInr: Number(data.amount_inr) };
  }

  // No DB row at all (migration not applied) — fall back to the code catalogue.
  const fallback = PLAN_CATALOG[planKey];
  return fallback ? { plan: planKey, name: fallback.name, amountInr: fallback.amountInr } : null;
}

export async function listActivePlans(): Promise<PlanView[]> {
  const keys = Object.keys(PLAN_CATALOG) as PlanKey[];
  const resolved = await Promise.all(keys.map((k) => resolvePlan(k)));
  return resolved.filter((p): p is PlanView => p !== null);
}

/** Marks outstanding PayU attempts for the same buyer as superseded and scrubs their payloads. */
export async function supersedePendingCheckouts(match: { email?: string; userId?: string }): Promise<void> {
  const query = () =>
    getSupabaseAdmin()
      .from("payment_orders")
      .update({
        status: "failed",
        gateway_status: "superseded",
        gateway_error: "A newer checkout was started for this buyer.",
        signup_payload: null,
      })
      .eq("gateway", "payu")
      .eq("status", "pending");
  try {
    if (match.email) {
      await query().filter("signup_payload->>email", "eq", match.email);
    } else if (match.userId) {
      await query().eq("user_id", match.userId);
    }
  } catch (err) {
    // Hygiene only — never block checkout on it.
    console.warn("supersedePendingCheckouts failed (non-fatal):", err);
  }
}

export async function createCheckoutOrder(input: {
  userId: string | null;
  plan: PlanView;
  txnid: string;
  signupPayload: SignupPayload | null;
}): Promise<PaymentOrder> {
  const { data, error } = await getSupabaseAdmin()
    .from("payment_orders")
    .insert({
      user_id: input.userId,
      plan: input.plan.plan,
      amount_inr: input.plan.amountInr,
      status: "pending",
      gateway: "payu",
      txnid: input.txnid,
      signup_payload: input.signupPayload,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as PaymentOrder;
}

export async function findOrderByTxnId(txnid: string): Promise<PaymentOrder | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("payment_orders")
    .select("*")
    .eq("txnid", txnid)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as PaymentOrder) ?? null;
}

export async function markOrderFailed(
  orderId: string,
  gatewayStatus: string | null,
  gatewayError: string
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("payment_orders")
    .update({
      status: "failed",
      gateway_status: gatewayStatus,
      gateway_error: gatewayError,
      // Scrub any held credentials — the attempt is over, account never created.
      signup_payload: null,
    })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
}

export async function markOrderCompleted(
  orderId: string,
  input: { mihpayid: string | null; gatewayStatus: string | null; plan: PlanKey }
): Promise<{ expiresAt: string | null }> {
  const now = Date.now();
  const expiresAt =
    input.plan === TRIAL_PLAN
      ? new Date(now + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString()
      : null;
  const { error } = await getSupabaseAdmin()
    .from("payment_orders")
    .update({
      status: "completed",
      gateway_status: input.gatewayStatus,
      gateway_error: null,
      mihpayid: input.mihpayid,
      verified_at: new Date(now).toISOString(),
      expires_at: expiresAt,
    })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
  return { expiresAt };
}

/**
 * Fulfillment blew up AFTER the money was captured: keep the order
 * 'completed' (they paid) but scrub the held credentials and leave a note
 * for support reconciliation. Never creates or deletes accounts.
 */
export async function recordFulfillmentFailure(orderId: string, gatewayError: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("payment_orders")
    .update({ gateway_error: gatewayError, signup_payload: null })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
}

/** After the account exists: link it, stamp fulfillment, scrub the held password. */
export async function attachAccountToOrder(
  orderId: string,
  userId: string,
  failure?: string | null
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("payment_orders")
    .update({
      user_id: userId,
      account_created_at: new Date().toISOString(),
      signup_payload: null,
      gateway_error: failure ?? null,
    })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
}

/**
 * Every completed (verified) order of a user, newest verification first.
 * Used to compute the user's entitlement: an order without expires_at never
 * lapses; a trial order lapses expires_at days after verification. The rows
 * are kept forever — expiry is computed, never deleted — so the record that
 * someone once held a pack persists.
 */
export async function listCompletedOrders(userId: string): Promise<PaymentOrder[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("payment_orders")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("verified_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as PaymentOrder[]) ?? [];
}

/**
 * Bearer-token authentication, mirroring the exam routes' helper but with
 * payment-appropriate wording. The exam helper is reused verbatim otherwise;
 * only the user-facing message differs.
 */
export async function authenticateRequest(
  request: Request
): Promise<{ userId: string } | { error: ApiError }> {
  const auth = await examAuthenticateRequest(request);
  if ("error" in auth) {
    const message =
      auth.error.code === "UNAUTHENTICATED"
        ? "Sign in to pay."
        : "Your session expired. Sign in again to pay.";
    return { error: { ...auth.error, message } };
  }
  return auth;
}

export { DEFAULT_PLAN };
