import { NextResponse } from "next/server";
import {
  findOrderByTxnId,
  markOrderCompleted,
  markOrderFailed,
  attachAccountToOrder,
  recordFulfillmentFailure,
} from "@/lib/payments/orders";
import { createAccountFromPayload } from "@/lib/payments/fulfill";
import { getPayUConfig, verifyResponseHash, verifyPayment } from "@/lib/payments/payu";

export const dynamic = "force-dynamic";

/**
 * PayU hosted-checkout return URL (both surl and furl point here). PayU POSTs
 * application/x-www-form-urlencoded; we verify our way out and always answer
 * with a 303 to a human page — never JSON.
 *
 * Trust model:
 *   1. The reverse SHA-512 hash (needs our salt) — the payload came from PayU.
 *   2. status must be 'success'; amount must match our order (hash already
 *      covers the string, this guards plan/catalog drift).
 *   3. verify_payment server-to-server as a second source of truth; if that
 *      API is unreachable we log and trust the hash rather than punish a user
 *      who already paid.
 * Only then: mark the order completed (starter → expires_at = verified+7d) and
 * — for guest signups — create the account, burn the OTP, wipe signup_payload.
 */
export async function POST(request: Request) {
  const cfg = safeConfig();
  const fail = (reason: string, txnid?: string | null) =>
    redirectTo(request, `/payment/failed?reason=${reason}${txnid ? `&txnid=${encodeURIComponent(txnid)}` : ""}`);

  try {
    const form = await request.formData();
    const params: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      if (typeof value === "string") params[key] = value;
    }

    const txnid = params.txnid ?? null;
    // Never log the hash or full identity; txnid+status is enough to debug.
    console.log("payment/callback:", { txnid, status: params.status, mihpayid: params.mihpayid });

    if (!cfg) {
      console.error("payment/callback: PayU is not configured");
      return fail("config", txnid);
    }
    if (!txnid) return fail("unknown_txn", null);

    const order = await findOrderByTxnId(txnid);
    if (!order) {
      console.error("payment/callback: unknown txnid", txnid);
      return fail("unknown_txn", txnid);
    }

    // Idempotency: PayU retries callbacks. A paid order stays paid.
    if (order.status === "completed") {
      return redirectTo(request, "/payment/success");
    }

    if (!verifyResponseHash(cfg, params)) {
      console.error("payment/callback: hash mismatch for txnid", txnid);
      await markOrderFailed(order.id, params.status ?? null, "Response hash failed verification.");
      return fail("hash", txnid);
    }

    const amount = Number.parseFloat(params.amount ?? "");
    if (!Number.isFinite(amount) || Math.abs(amount - order.amount_inr) > 0.009) {
      console.error("payment/callback: amount mismatch", { expected: order.amount_inr, got: params.amount });
      await markOrderFailed(order.id, params.status ?? null, "Amount mismatch between PayU and order.");
      return fail("amount", txnid);
    }

    if ((params.status ?? "").toLowerCase() !== "success") {
      const err = params.error_Message || params.error || "PayU reported a non-success status.";
      await markOrderFailed(order.id, params.status ?? null, String(err).slice(0, 500));
      return fail("declined", txnid);
    }

    const verification = await verifyPayment(cfg, txnid);
    if (!verification.ok) {
      if (verification.gatewayStatus && !/success|captured|completed/i.test(verification.gatewayStatus)) {
        console.error("payment/callback: verify_payment reports", verification.gatewayStatus);
        await markOrderFailed(order.id, verification.gatewayStatus, "verify_payment reports a non-success status.");
        return fail("verify_declined", txnid);
      }
      // Network/API trouble — log and trust the verified hash.
      console.warn("payment/callback: verify_payment unreachable; proceeding on hash.");
    }

    // Money verified. Flip the order (starter gets its 7-day expiry here).
    await markOrderCompleted(order.id, {
      mihpayid: params.mihpayid ?? null,
      gatewayStatus: params.status ?? null,
      plan: order.plan,
    });

    const payload = order.signup_payload;
    if (payload) {
      const result = await createAccountFromPayload(payload, order.plan);
      if (result.userId) {
        await attachAccountToOrder(order.id, result.userId, null);
      } else {
        // Paid, but the account could not be created — leave it completed with a
        // note for support; the candidate is NOT silently refused after paying.
        const note = `Account not created after payment (${result.code ?? "UNKNOWN"}). Reconcile manually.`;
        console.error("payment/callback:", note, "txnid:", txnid);
        await recordFulfillmentFailure(order.id, note);
        const reason = result.code === "EMAIL_TAKEN" || result.code === "PHONE_TAKEN" ? "account_exists" : "account_failed";
        return fail(reason, txnid);
      }
    }

    return redirectTo(request, `/payment/success?txnid=${encodeURIComponent(txnid)}`);
  } catch (err) {
    console.error("payment/callback error:", err);
    return fail("internal", null);
  }
}

function safeConfig() {
  try {
    return getPayUConfig();
  } catch (err) {
    console.error("payment/callback: config error:", err);
    return null;
  }
}

/** Absolute redirect built from the incoming request (works behind Vercel's proxy). */
function redirectTo(request: Request, path: string) {
  const url = new URL(path, request.url);
  return NextResponse.redirect(url, 303);
}
