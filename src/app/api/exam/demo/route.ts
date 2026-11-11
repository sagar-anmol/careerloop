import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/exams/attempts";
import { hasCompletedDemo, markDemoCompleted } from "@/lib/exams/demo";
import { jsonError, jsonServerError } from "@/lib/exams/http";

export const dynamic = "force-dynamic";

/** Whether the signed-in account has finished the demo orientation. */
export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if ("error" in auth) return jsonError(auth.error);

    return NextResponse.json({ completed: await hasCompletedDemo(auth.userId) });
  } catch (error) {
    return jsonServerError(error);
  }
}

/**
 * Records demo completion. The demo has no score — it only teaches the exam
 * interface — so nothing is written to the exam or assessment tables here.
 */
export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if ("error" in auth) return jsonError(auth.error);

    await markDemoCompleted(auth.userId);
    return NextResponse.json({ completed: true });
  } catch (error) {
    return jsonServerError(error);
  }
}
