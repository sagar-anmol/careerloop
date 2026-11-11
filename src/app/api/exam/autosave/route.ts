import { NextResponse } from "next/server";
import {
  authenticateRequest,
  examSetOrNull,
  finalizeAttempt,
  getAttemptById,
  isPastExpiry,
  normalizeResponses,
  saveResponses,
  secondsUntil,
  tokenMatches,
  touchAttempt,
} from "@/lib/exams/attempts";
import { errorOf, jsonError, jsonServerError, readJsonObject } from "@/lib/exams/http";

export const dynamic = "force-dynamic";

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").slice(0, 50);
}

function metaObject(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export async function PATCH(request: Request) {
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

    if (attempt.status !== "in_progress") {
      return NextResponse.json({
        status: attempt.status,
        savedAt: null,
        remainingSeconds: 0,
        finalized: true,
      });
    }

    const set = examSetOrNull(attempt.set_id);
    if (!set) {
      return jsonError(errorOf(404, "UNKNOWN_SET", "This exam set is no longer available."));
    }

    if (isPastExpiry(attempt.expires_at)) {
      const finalized = await finalizeAttempt(attempt, set, "expired");
      return NextResponse.json({
        status: finalized.status,
        savedAt: null,
        remainingSeconds: 0,
        finalized: true,
      });
    }

    const responses = normalizeResponses(set, body.responses);
    await saveResponses(attempt.id, responses);
    await touchAttempt(attempt.id, stringArray(body.integrityFlags), metaObject(body.clientMeta));

    return NextResponse.json({
      status: "in_progress",
      savedAt: new Date().toISOString(),
      remainingSeconds: secondsUntil(attempt.expires_at),
      finalized: false,
    });
  } catch (error) {
    return jsonServerError(error);
  }
}
