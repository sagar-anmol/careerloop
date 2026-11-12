import { NextResponse } from "next/server";
import {
  buildQrImageUrl,
  buildUpiUri,
  getUpiConfig,
  isPlanKey,
} from "@/lib/payments/upi";
import { resolvePlan } from "@/lib/payments/orders";

export const dynamic = "force-dynamic";

/**
 * Payment "invoice" preview used BEFORE account creation (signup requires
 * payment). Deliberately unauthenticated: no session exists yet. Creates NO
 * order — it only tells the browser who to pay, for what amount, and hands it
 * a ready-to-render QR. The price comes from the server-side plan table.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const planKey = isPlanKey(body?.plan) ? body.plan : null;
    if (!planKey) {
      return NextResponse.json(
        { error: "Select a valid plan.", code: "UNKNOWN_PLAN" },
        { status: 400 }
      );
    }

    const plan = await resolvePlan(planKey);
    if (!plan) {
      return NextResponse.json(
        { error: "That plan is not available.", code: "UNKNOWN_PLAN" },
        { status: 400 }
      );
    }

    const upi = getUpiConfig();
    const upiUri = buildUpiUri(upi.upiId, upi.payeeName, plan.amountInr, upi.note);

    return NextResponse.json({
      success: true,
      plan: plan.plan,
      planName: plan.name,
      amountInr: plan.amountInr,
      payeeName: upi.payeeName,
      upiUri,
      qrUrl: buildQrImageUrl(upiUri),
    });
  } catch (err) {
    console.error("payment/quote error:", err);
    return NextResponse.json(
      { error: "Payment is not configured.", code: "PAYMENT_CONFIG" },
      { status: 500 }
    );
  }
}
