import { NextResponse } from "next/server";
import {
  authenticateRequest,
  buildResultPayload,
  EXPIRY_GRACE_SECONDS,
  examSetOrNull,
  finalizeAttempt,
  getAttemptById,
  isPastExpiry,
  normalizeResponses,
  responsesFor,
  saveResponses,
  tokenMatches,
} from "@/lib/exams/attempts";
import { errorOf, jsonError, jsonServerError, readJsonObject } from "@/lib/exams/http";

export const dynamic = "force-dynamic";

/**
 * Scores and closes an attempt. Idempotent: once an attempt is submitted or
 * expired, repeat calls return the stored result instead of rescoring.
 */
export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if ("error" in auth) return jsonError(auth.error);

    const body = await readJsonObject(request);
    const attemptId = typeof body.attemptId === "string" ? body.attemptId : "";
    const attemptToken = typeof body.attemptToken === "string" ? body.attemptToken : "";

    const attempt = attemptId ? await getAttemptById(attemptId) : null;
    if (!attempt || attempt.auth_user_id !== auth.userId) {
      return jsonError(errorOf(404, "ATTEMPT_NOT_FOUND", "That attempt could not be found."));
    }

    if (!(await tokenMatches(attempt, attemptToken))) {
      return jsonError(errorOf(403, "BAD_ATTEMPT_TOKEN", "This attempt was opened in another tab or has expired."));
    }

    const set = examSetOrNull(attempt.set_id);
    if (!set) {
      return jsonError(errorOf(404, "UNKNOWN_SET", "This exam set is no longer available."));
    }

    if (attempt.status !== "in_progress") {
      const rows = await responsesFor(attempt.id);
      return NextResponse.json({ result: buildResultPayload(attempt, set, rows), alreadyFinal: true });
    }

    // Past expiry (beyond the grace window) the late body is ignored and the
    // last saved answers are scored, so a frozen tab cannot add time.
    if (isPastExpiry(attempt.expires_at, EXPIRY_GRACE_SECONDS)) {
      const finalized = await finalizeAttempt(attempt, set, "expired");
      const rows = await responsesFor(finalized.id);
      return NextResponse.json({ result: buildResultPayload(finalized, set, rows), alreadyFinal: false });
    }

    const responses = normalizeResponses(set, body.responses);
    if (responses.length > 0) await saveResponses(attempt.id, responses);

    const finalized = await finalizeAttempt(attempt, set, "submitted");
    const rows = await responsesFor(finalized.id);
    return NextResponse.json({ result: buildResultPayload(finalized, set, rows), alreadyFinal: false });
  } catch (error) {
    return jsonServerError(error);
  }
}
