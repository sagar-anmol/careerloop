import { NextResponse } from "next/server";
import {
  authenticateRequest,
  getOwnedPlan,
  listActivePlans,
} from "@/lib/payments/orders";
import { isPlanKey, isUpgradeFrom } from "@/lib/payments/plans";

export const dynamic = "force-dynamic";

/**
 * The candidate's own plan picture, read with the service role so prices come
 * from the plan table and never from the browser: what is owned, and what can
 * be bought from here (strictly higher tiers — a lower one is already owned).
 * A free account (no completed order) is offered every plan.
 */
export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json(
      { error: auth.error.message, code: auth.error.code },
      { status: auth.error.status }
    );
  }

  try {
    const current = await getOwnedPlan(auth.userId);

    const upgrades = (await listActivePlans()).filter(
      (plan) => isPlanKey(plan.plan) && isUpgradeFrom(current?.plan ?? null, plan.plan)
    );

    return NextResponse.json({
      current: current
        ? { plan: current.plan, name: current.name, amountInr: current.amountInr }
        : null,
      upgrades,
    });
  } catch (err) {
    console.error("payment/upgrade-options error:", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message, code: "UPGRADE_OPTIONS_FAILED" }, { status: 500 });
  }
}