/**
 * Server-side plan catalogue. Amounts are NEVER taken from the client — the
 * server derives them from the `payment_plans` table (code catalogue as a
 * backstop) before any order row is written and before any PayU hash is
 * computed.
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

/** The entry plan is a time-boxed trial: it expires this many days after payment is verified. */
export const TRIAL_PLAN: PlanKey = "starter_practice";
export const TRIAL_DURATION_DAYS = 7;

export const DEFAULT_PLAN: PlanKey = "pro_all_access";

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && value in PLAN_CATALOG;
}
