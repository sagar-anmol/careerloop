import { NextResponse } from "next/server";
import {
  authenticateRequest,
  buildStartPayload,
  candidateIdForUser,
  countUsedAttempts,
  createAttemptRow,
  createAttemptToken,
  EXPIRY_GRACE_SECONDS,
  examSetOrNull,
  finalizeAttempt,
  findOpenAttempt,
  hashAttemptToken,
  isPastExpiry,
  responsesFor,
  rotateAttemptToken,
} from "@/lib/exams/attempts";
import { hasCompletedDemo } from "@/lib/exams/demo";
import { errorOf, jsonError, jsonServerError, readJsonObject } from "@/lib/exams/http";

export const dynamic = "force-dynamic";

/**
 * Starts (or resumes) an attempt. The attempt cap, the expiry check and the
 * one-live-attempt rule are all enforced here, never in the browser.
 */
export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if ("error" in auth) return jsonError(auth.error);

    const body = await readJsonObject(request);
    const setId = typeof body.setId === "string" ? body.setId : "";
    const set = examSetOrNull(setId);

    if (!set) {
      return jsonError(errorOf(404, "UNKNOWN_SET", "That exam set does not exist."));
    }

    // The demo orientation is a hard prerequisite, enforced on the server so a
    // direct URL to /exam/<set> cannot skip it.
    if (!(await hasCompletedDemo(auth.userId))) {
      return jsonError(
        errorOf(
          403,
          "DEMO_REQUIRED",
          "Finish the demo orientation first — it unlocks every scored test."
        )
      );
    }

    let attempt = await findOpenAttempt(auth.userId, setId);

    // A live attempt whose clock has run out is closed and counts as used.
    if (attempt && isPastExpiry(attempt.expires_at, EXPIRY_GRACE_SECONDS)) {
      await finalizeAttempt(attempt, set, "expired");
      attempt = null;
    }

    if (!attempt) {
      const used = await countUsedAttempts(auth.userId, setId);
      if (used >= set.attemptCap) {
        return jsonError(
          errorOf(
            403,
            "ATTEMPT_LIMIT",
            `You have used all ${set.attemptCap} attempts for this set. Your saved score is on the dashboard.`
          )
        );
      }

      const candidateId = await candidateIdForUser(auth.userId);
      // The row is created with a throwaway hash; the real token is rotated in
      // immediately below so the plaintext only ever exists in this response.
      attempt = await createAttemptRow(auth.userId, candidateId, set, await hashAttemptToken(createAttemptToken()));
    }

    const token = createAttemptToken();
    await rotateAttemptToken(attempt.id, await hashAttemptToken(token));

    const rows = await responsesFor(attempt.id);
    return NextResponse.json(buildStartPayload(attempt, set, token, rows));
  } catch (error) {
    return jsonServerError(error);
  }
}
