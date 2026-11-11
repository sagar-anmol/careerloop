import { NextResponse } from "next/server";
import { authenticateRequest, PASS_PERCENT } from "@/lib/exams/attempts";
import { jsonError, jsonServerError } from "@/lib/exams/http";
import { listExamSets } from "@/lib/exams/loader";
import { round2 } from "@/lib/exams/schema";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if ("error" in auth) return jsonError(auth.error);

    const titles = new Map(listExamSets().map((set) => [set.id, set.title]));

    const { data, error } = await getSupabaseAdmin()
      .from("exam_attempts")
      .select(
        "id, set_id, status, started_at, submitted_at, score, max_marks, correct_count, wrong_count, unattempted_count, question_count, integrity_flags"
      )
      .eq("auth_user_id", auth.userId)
      .order("started_at", { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);

    const attempts = (data ?? []).map((row) => {
      const max = Number(row.max_marks) || 0;
      const score = row.score === null ? null : round2(Number(row.score));
      const percentage = score === null || max === 0 ? null : Math.max(0, round2((score / max) * 100));
      return {
        attemptId: row.id,
        setId: row.set_id,
        setTitle: titles.get(row.set_id) ?? row.set_id,
        status: row.status,
        startedAt: row.started_at,
        submittedAt: row.submitted_at,
        score,
        maxMarks: max,
        percentage,
        passed: percentage === null ? null : percentage >= PASS_PERCENT,
        correct: row.correct_count,
        wrong: row.wrong_count,
        unattempted: row.unattempted_count,
        questionCount: row.question_count,
        integrityFlags: row.integrity_flags ?? [],
      };
    });

    return NextResponse.json({ attempts });
  } catch (error) {
    return jsonServerError(error);
  }
}
