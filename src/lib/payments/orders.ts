import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  authenticateRequest as examAuthenticateRequest,
  type ApiError,
} from "@/lib/exams/attempts";
import {
  DEFAULT_PLAN,
  PLAN_CATALOG,
  type PlanKey,
  isPlanKey,
} from "@/lib/payments/upi";

/**
 * Payment order domain logic. Every rule that matters is enforced here, never
 * in the browser: the price comes from the plan, the user comes from the
 * verified access token, and the UTR is unique.
 */

export interface PaymentOrder {
  id: string;
  user_id: string;
  plan: PlanKey;
  amount_inr: number;
  upi_id: string;
  utr: string | null;
  status: "pending" | "completed" | "failed";
  created_at: string;
  verified_at: string | null;
  /** true only after an admin confirms the UTR against the bank statement. */
  utr_verified: boolean;
  /** Trial plans only: when the entitlement lapses (verified_at + 7 days). Null = never expires. */
  expires_at: string | null;
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

export async function findPendingOrder(
  userId: string,
  plan: PlanKey
): Promise<PaymentOrder | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("payment_orders")
    .select("*")
    .eq("user_id", userId)
    .eq("plan", plan)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as PaymentOrder) ?? null;
}

export async function createOrder(
  userId: string,
  plan: PlanView,
  upiId: string
): Promise<PaymentOrder> {
  const { data, error } = await getSupabaseAdmin()
    .from("payment_orders")
    .insert({
      user_id: userId,
      plan: plan.plan,
      amount_inr: plan.amountInr,
      upi_id: upiId,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as PaymentOrder;
}

/**
 * Latest order whose UTR was submitted but never verified by an admin
 * (status 'pending' + UTR present + utr_verified false). This is what the
 * whole-site "payment pending" banner polls for.
 */
export async function findPendingVerificationOrder(
  userId: string
): Promise<PaymentOrder | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("payment_orders")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending")
    .eq("utr_verified", false)
    .not("utr", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as PaymentOrder) ?? null;
}

export async function getOrderForUser(
  userId: string,
  orderId: string
): Promise<PaymentOrder | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("payment_orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as PaymentOrder) ?? null;
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
 * Attaches the 12-digit UTR to a pending order. The unique constraint on `utr`
 * makes a reused UTR impossible even under concurrent submits; the insert
 * returns 23505 which we surface as UTR_TAKEN.
 */
export async function attachUtr(
  userId: string,
  orderId: string,
  utr: string
): Promise<{ order: PaymentOrder } | { error: "NOT_FOUND" | "UTR_TAKEN" | "BAD_STATE" }> {
  const existing = await getOrderForUser(userId, orderId);
  if (!existing) return { error: "NOT_FOUND" };
  if (existing.status !== "pending") return { error: "BAD_STATE" };

  const { data, error } = await getSupabaseAdmin()
    .from("payment_orders")
    .update({ utr })
    .eq("id", orderId)
    .eq("user_id", userId)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") return { error: "UTR_TAKEN" };
    throw new Error(error.message);
  }
  if (!data) return { error: "BAD_STATE" };
  return { order: data as PaymentOrder };
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