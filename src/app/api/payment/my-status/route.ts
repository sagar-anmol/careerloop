import { NextResponse } from "next/server";
import {
  authenticateRequest,
  findPendingVerificationOrder,
  listCompletedOrders,
} from "@/lib/payments/orders";
import { TRIAL_PLAN } from "@/lib/payments/upi";

export const dynamic = "force-dynamic";

/**
 * Used by the whole-site banner. Three possible answers, in priority order:
 *
 *   1. pendingVerification — a UTR was submitted but the team has not verified
 *      it yet (red banner).
 *   2. trialExpired — the user once held the 7-day Starter Trial and it has
 *      lapsed, with no other active entitlement (amber "upgrade" banner). The
 *      order row is kept forever; expiry is computed, never deleted.
 *   3. nothing — either no purchases, or an active entitlement (trial inside
 *      its 7 days, or a non-expiring plan).
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
    const order = await findPendingVerificationOrder(auth.userId);
    if (order) {
      return NextResponse.json({
        success: true,
        pendingVerification: true,
        trialExpired: false,
        order: {
          id: order.id,
          plan: order.plan,
          amountInr: order.amount_inr,
          utr: order.utr,
          utrVerified: order.utr_verified,
          submittedAt: order.created_at,
        },
      });
    }

    // Entitlement check over completed orders (few rows per user).
    const completed = await listCompletedOrders(auth.userId);
    const now = Date.now();
    const active = completed.find(
      (o) => !o.expires_at || new Date(o.expires_at).getTime() > now
    );

    if (!active && completed.length > 0) {
      const expiredTrial = completed.find((o) => o.plan === TRIAL_PLAN) ?? completed[0];
      return NextResponse.json({
        success: true,
        pendingVerification: false,
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
      pendingVerification: false,
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
