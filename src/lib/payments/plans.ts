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
  starter_practice: { key: "starter_practice", name: "Starter Practice Pass", amountInr: 999 },
  pro_all_access: { key: "pro_all_access", name: "CareerLoop Pro All-Access Pass", amountInr: 4999 },
  mentorship_1on1: { key: "mentorship_1on1", name: "1-on-1 Intensive Mentorship Track", amountInr: 8999 },
};

/** Every pack is a one-time purchase with no expiry window. */

export const DEFAULT_PLAN: PlanKey = "pro_all_access";

/** Low → high. A purchase is only an upgrade if the target outranks what is owned. */
export const PLAN_RANK: Record<PlanKey, number> = {
  starter_practice: 1,
  pro_all_access: 2,
  mentorship_1on1: 3,
};

export function planRank(plan: PlanKey | null | undefined): number {
  return plan ? (PLAN_RANK[plan] ?? 0) : 0;
}

/**
 * Full fee on every purchase (Refund Policy §8 — no credit, set-off or
 * proration), so an "upgrade" is simply the next tier up. Buying the same or
 * a lower plan is refused: the owned plan already includes it.
 */
export function isUpgradeFrom(current: PlanKey | null | undefined, next: PlanKey): boolean {
  return PLAN_RANK[next] > planRank(current);
}

/** Label the dashboard and candidate records display for a plan. */
export function partnerRouteForPlan(plan: PlanKey): string {
  return plan === "mentorship_1on1"
    ? "1-on-1 Mentorship (₹8,999)"
    : plan === "pro_all_access"
      ? "CareerLoop Pro (₹4,999)"
      : "Starter Practice Pass (₹999)";
}

export interface CandidatePlanRef {
  plan?: unknown;
  partner_route?: unknown;
}

/**
 * Tier a candidate row refers to: the `plan` column first, then the legacy
 * free-text label (rows backfilled before that column existed). Safe to run in
 * the browser — this module holds no secrets or server imports.
 */
export function planFromCandidate(row: CandidatePlanRef | null | undefined): PlanKey | null {
  if (isPlanKey(row?.plan)) return row.plan;

  const route = typeof row?.partner_route === "string" ? row.partner_route : "";
  if (/1-on-1|8,999/i.test(route)) return "mentorship_1on1";
  if (/\bPro\b|4,999/i.test(route)) return "pro_all_access";
  if (/Starter|999/i.test(route)) return "starter_practice";
  return null;
}

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && value in PLAN_CATALOG;
}
