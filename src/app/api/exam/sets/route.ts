import { NextResponse } from "next/server";
import {
  authenticateRequest,
  publicSetCatalog,
  setStatsForUser,
} from "@/lib/exams/attempts";
import { hasCompletedDemo } from "@/lib/exams/demo";
import { jsonError, jsonServerError } from "@/lib/exams/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if ("error" in auth) return jsonError(auth.error);

    const [stats, demoCompleted] = await Promise.all([
      setStatsForUser(auth.userId),
      hasCompletedDemo(auth.userId),
    ]);

    const sets = publicSetCatalog().map((set) => {
      const stat = stats.get(set.id);
      const attemptsUsed = stat?.attemptsUsed ?? 0;
      return {
        ...set,
        attemptsUsed,
        attemptsRemaining: Math.max(0, set.attemptCap - attemptsUsed),
        openAttemptId: stat?.openAttemptId ?? null,
        bestScore: stat?.bestScore ?? null,
        bestPercentage: stat?.bestPercentage ?? null,
      };
    });

    return NextResponse.json({ sets, demoCompleted });
  } catch (error) {
    return jsonServerError(error);
  }
}
