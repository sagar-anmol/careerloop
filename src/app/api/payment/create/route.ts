import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/payments/orders";
import {
  buildQrImageUrl,
  buildUpiUri,
  DEFAULT_PLAN,
  getUpiConfig,
  isPlanKey,
} from "@/lib/payments/upi";
import {
  createOrder,
  findPendingOrder,
  listActivePlans,
  resolvePlan,
} from "@/lib/payments/orders";

export const dynamic = "force-dynamic";

/**
 * Returns the active plans (price + payee) and, for the signed-in user, a
 * pending order for the requested plan if one exists.
 *
 * Amounts come from the server-side plan table — the client never sends a price.
 */
export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error.message, code: auth.error.code }, { status: auth.error.status });
    }

    const body = await request.json().catch(() => ({}));
    const planKey = isPlanKey(body.plan) ? body.plan : DEFAULT_PLAN;

    const upi = getUpiConfig();
    const plan = await resolvePlan(planKey);
    if (!plan) {
      return NextResponse.json(
        { error: "That plan is not available.", code: "UNKNOWN_PLAN" },
        { status: 404 }
      );
    }

    const plans = await listActivePlans();

    // Reuse an existing pending order for this plan so a page refresh does not
    // create a new pending row (which would fragment the candidate's record).
    let order = await findPendingOrder(auth.userId, planKey);
    if (!order) {
      order = await createOrder(auth.userId, plan, upi.upiId);
    }

    const upiUri = buildUpiUri(upi.upiId, upi.payeeName, order.amount_inr, upi.note);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        plan: order.plan,
        amountInr: order.amount_inr,
        status: order.status,
        utr: order.utr,
      },
      payeeName: upi.payeeName,
      upiUri,
      qrUrl: buildQrImageUrl(upiUri),
      plans,
    });
  } catch (err) {
    console.error("payment/create error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error", code: "PAYMENT_CONFIG" },
      { status: 500 }
    );
  }
}