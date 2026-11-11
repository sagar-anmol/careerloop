import { NextResponse } from "next/server";
import {
  authenticateRequest,
  buildResultPayload,
  examSetOrNull,
  finalizeAttempt,
  getAttemptById,
  isPastExpiry,
  responsesFor,
} from "@/lib/exams/attempts";
import { errorOf, jsonError, jsonServerError } from "@/lib/exams/http";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ attemptId: string }> }
) {
  try {
    const auth = await authenticateRequest(request);
    if ("error" in auth) return jsonError(auth.error);

    const { attemptId } = await context.params;
    const attempt = attemptId ? await getAttemptById(attemptId) : null;
    if (!attempt || attempt.auth_user_id !== auth.userId) {
      return jsonError(errorOf(404, "ATTEMPT_NOT_FOUND", "That attempt could not be found."));
    }

    const set = examSetOrNull(attempt.set_id);
    if (!set) {
      return jsonError(errorOf(404, "UNKNOWN_SET", "This exam set is no longer available."));
    }

    const current =
      attempt.status === "in_progress" && isPastExpiry(attempt.expires_at)
        ? await finalizeAttempt(attempt, set, "expired")
        : attempt;

    const rows = await responsesFor(current.id);
    return NextResponse.json({ result: buildResultPayload(current, set, rows) });
  } catch (error) {
    return jsonServerError(error);
  }
}
