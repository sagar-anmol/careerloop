import { NextResponse } from "next/server";
import {
  authenticateRequest,
  listCompletedOrders,
} from "@/lib/payments/orders";
import { TRIAL_PLAN } from "@/lib/payments/plans";

export const dynamic = "force-dynamic";

/**
 * Used by the whole-site banner and the trial gate. One question:
 *
 *   trialExpired — the user once held the 7-day Starter Trial and it has
 *   lapsed, with no active (unexpired or non-expiring) completed order.
 *   The order row is kept forever; expiry is computed, never deleted.
 *
 * There is no "pending verification" state anymore: PayU payments are
 * verified server-side inside the callback before the account exists, so an
 * order is either completed (entitlement issued) or failed.
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
    const completed = await listCompletedOrders(auth.userId);
    const now = Date.now();
    const active = completed.find(
      (o) => !o.expires_at || new Date(o.expires_at).getTime() > now
    );

    if (!active && completed.length > 0) {
      const expiredTrial = completed.find((o) => o.plan === TRIAL_PLAN) ?? completed[0];
      return NextResponse.json({
        success: true,
        trialExpired: true,
        trial: {
          plan: expiredTrial.plan,
          amountInr: expiredTrial.amount_inr,
          expiresAt: expiredTrial.expires_at,
        },
      });
    }

    return NextResponse.json({
      success: true,
      trialExpired: false,
    });
  } catch (err) {
    console.error("payment/my-status error:", err);
    return NextResponse.json(
      { error: "Something went wrong.", code: "INTERNAL" },
      { status: 500 }
    );
  }
}
