import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { TRIAL_DURATION_DAYS, TRIAL_PLAN } from "@/lib/payments/upi";

export const dynamic = "force-dynamic";

/**
 * Admin payment verification. Bearer-authenticated with CAREERLOOP_ADMIN_KEY
 * (or `x-api-key`). Reads and updates payment orders only — service-role
 * access, so this is the only place an order becomes 'completed'.
 */
function isAuthorized(request: Request): boolean {
  const key = process.env.CAREERLOOP_ADMIN_KEY;
  if (!key) return false;

  const header = request.headers.get("authorization") ?? "";
  if (header.toLowerCase().startsWith("bearer ") && header.slice(7).trim() === key) {
    return true;
  }
  return request.headers.get("x-api-key") === key;
}

export async function GET(request: Request) {
  if (!process.env.CAREERLOOP_ADMIN_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured: CAREERLOOP_ADMIN_KEY is not set." },
      { status: 500 }
    );
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const statusParam = (searchParams.get("status") || "all").toLowerCase();
  const searchParam = searchParams.get("search")?.trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get("limit") || "200", 10) || 200));
  const skip = (page - 1) * limit;

  // Summary is computed over the full table, ignoring the page filters.
  const { data: allOrders } = await admin
    .from("payment_orders")
    .select("status, amount_inr, utr, utr_verified");
  const all = (allOrders ?? []) as Array<{
    status: string;
    amount_inr: number;
    utr: string | null;
    utr_verified: boolean;
  }>;
  const summary = {
    total: all.length,
    pending: all.filter((r) => r.status === "pending").length,
    completed: all.filter((r) => r.status === "completed").length,
    failed: all.filter((r) => r.status === "failed").length,
    // Orders waiting on the operator's eyes: UTR submitted, never confirmed.
    awaitingVerification: all.filter((r) => r.status === "pending" && r.utr !== null && !r.utr_verified).length,
    totalAmountPaid: all
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + Number(r.amount_inr || 0), 0),
  };

  // Filtered list (status + free-text search across utr / user_id / plan).
  let listQuery = admin
    .from("payment_orders")
    .select("id, user_id, plan, amount_inr, upi_id, utr, utr_verified, status, created_at, verified_at, expires_at");

  if (["pending", "completed", "failed"].includes(statusParam)) {
    listQuery = listQuery.eq("status", statusParam);
  }
  if (searchParam) {
    const escaped = searchParam.replace(/[%,()]/g, "");
    listQuery = listQuery.or(
      `utr.ilike.%${escaped}%,user_id.ilike.%${escaped}%,plan.ilike.%${escaped}%`
    );
  }

  const { data: records, error: listError } = await listQuery
    .order("created_at", { ascending: false })
    .range(skip, skip + limit - 1);

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    summary,
    pagination: { page, limit, totalMatchingRecords: records?.length ?? 0 },
    records: records ?? [],
  });
}

/** Body: { orderId, action: "complete" | "fail" } */
export async function POST(request: Request) {
  if (!process.env.CAREERLOOP_ADMIN_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured: CAREERLOOP_ADMIN_KEY is not set." },
      { status: 500 }
    );
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const orderId = typeof body.orderId === "string" ? body.orderId : "";
  const action = typeof body.action === "string" ? body.action : "";

  if (!orderId || !["complete", "fail"].includes(action)) {
    return NextResponse.json({ error: "orderId and action are required." }, { status: 400 });
  }

  // Completing an order is the only place utr_verified flips true; failing resets it.
  // Trial plans (starter) additionally get an expiry stamped at verification:
  // the entitlement runs 7 days from the moment the team confirms the payment.
  const nextStatus = action === "complete" ? "completed" : "failed";
  let trialExpiresAt: string | null = null;
  if (nextStatus === "completed") {
    const { data: existing } = await getSupabaseAdmin()
      .from("payment_orders")
      .select("plan")
      .eq("id", orderId)
      .maybeSingle();
    if (existing?.plan === TRIAL_PLAN) {
      trialExpiresAt = new Date(Date.now() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  const { data, error } = await getSupabaseAdmin()
    .from("payment_orders")
    .update({
      status: nextStatus,
      utr_verified: nextStatus === "completed",
      verified_at: nextStatus === "completed" ? new Date().toISOString() : null,
      expires_at: nextStatus === "completed" ? trialExpiresAt : null,
    })
    .eq("id", orderId)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, order: data });
}