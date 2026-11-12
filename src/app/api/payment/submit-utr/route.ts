import { NextResponse } from "next/server";
import { attachUtr, authenticateRequest } from "@/lib/payments/orders";
import { normalizeUtr } from "@/lib/payments/upi";

export const dynamic = "force-dynamic";

/**
 * Records the 12-digit bank UTR against a pending order. It does NOT mark the
 * order paid — verification is an admin step. The unique index on `utr`
 * prevents two candidates claiming the same reference.
 */
export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error.message, code: auth.error.code }, { status: auth.error.status });
    }

    const body = await request.json().catch(() => ({}));
    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId", code: "BAD_REQUEST" }, { status: 400 });
    }

    const utr = normalizeUtr(body.utr);
    if (!utr) {
      return NextResponse.json(
        { error: "UTR must be exactly 12 digits.", code: "BAD_UTR" },
        { status: 400 }
      );
    }

    const result = await attachUtr(auth.userId, orderId, utr);

    if ("error" in result) {
      switch (result.error) {
        case "NOT_FOUND":
          return NextResponse.json({ error: "Order not found.", code: "NOT_FOUND" }, { status: 404 });
        case "UTR_TAKEN":
          return NextResponse.json(
            { error: "This UTR is already used by another order.", code: "UTR_TAKEN" },
            { status: 409 }
          );
        case "BAD_STATE":
        default:
          return NextResponse.json(
            { error: "This order is no longer pending.", code: "BAD_STATE" },
            { status: 409 }
          );
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: result.order.id,
        plan: result.order.plan,
        amountInr: result.order.amount_inr,
        status: result.order.status,
        utr: result.order.utr,
      },
    });
  } catch (err) {
    console.error("payment/submit-utr error:", err);
    return NextResponse.json(
      { error: "Something went wrong submitting the UTR.", code: "INTERNAL" },
      { status: 500 }
    );
  }
}