import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getExamSet, listExamSets } from "./loader";
import {
  maxMarks as computeMaxMarks,
  questionCount,
  round2,
  toPublicSections,
  type ExamSet,
  type PublicSection,
} from "./schema";
import { scoreExamSet, type AnswerMap, type SectionBreakdown } from "./scoring";

/** Seconds of slack after the server expiry during which a submit is still on time. */
export const EXPIRY_GRACE_SECONDS = 30;
export const PASS_PERCENT = 40;

export type AttemptStatus = "in_progress" | "submitted" | "expired";

export interface AttemptRow {
  id: string;
  auth_user_id: string;
  candidate_id: string | null;
  set_id: string;
  exam_type: string;
  attempt_token_hash: string;
  status: AttemptStatus;
  started_at: string;
  expires_at: string;
  submitted_at: string | null;
  duration_seconds: number;
  question_count: number;
  max_marks: number | string;
  score: number | string | null;
  correct_count: number | null;
  wrong_count: number | null;
  unattempted_count: number | null;
  section_scores: SectionBreakdown[] | null;
  integrity_flags: string[] | null;
  client_meta: Record<string, unknown> | null;
}

export interface ResponseRow {
  attempt_id: string;
  question_id: string;
  selected_index: number | null;
  marked_for_review: boolean;
  visited: boolean;
  time_spent_ms: number;
}

export interface ResponseInput {
  questionId: string;
  selectedIndex: number | null;
  markedForReview: boolean;
  visited: boolean;
  timeSpentMs: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
}

export interface SetStats {
  attemptsUsed: number;
  bestScore: number | null;
  bestPercentage: number | null;
  openAttemptId: string | null;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function authenticateRequest(
  request: Request
): Promise<{ userId: string } | { error: ApiError }> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";

  if (!token) {
    return {
      error: { status: 401, code: "UNAUTHENTICATED", message: "Sign in to start or continue an exam." },
    };
  }

  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) {
    return {
      error: {
        status: 401,
        code: "INVALID_SESSION",
        message: "Your session has expired. Sign in again to continue.",
      },
    };
  }

  return { userId: data.user.id };
}

export async function candidateIdForUser(userId: string): Promise<string | null> {
  const { data } = await getSupabaseAdmin()
    .from("candidates")
    .select("candidate_id")
    .eq("auth_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return typeof data?.candidate_id === "string" ? data.candidate_id : null;
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

export function createAttemptToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashAttemptToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function tokenMatches(attempt: AttemptRow, token: string): Promise<boolean> {
  if (!token) return false;
  return (await hashAttemptToken(token)) === attempt.attempt_token_hash;
}

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------

export function secondsUntil(isoDate: string): number {
  return Math.max(0, Math.ceil((Date.parse(isoDate) - Date.now()) / 1000));
}

export function isPastExpiry(isoDate: string, graceSeconds = 0): boolean {
  return Date.now() > Date.parse(isoDate) + graceSeconds * 1000;
}

// ---------------------------------------------------------------------------
// Attempt rows
// ---------------------------------------------------------------------------

export async function findOpenAttempt(userId: string, setId: string): Promise<AttemptRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("exam_attempts")
    .select("*")
    .eq("auth_user_id", userId)
    .eq("set_id", setId)
    .eq("status", "in_progress")
    .maybeSingle();

  if (error) throw new Error(`Failed to load open attempt: ${error.message}`);
  return (data as AttemptRow | null) ?? null;
}

export async function getAttemptById(attemptId: string): Promise<AttemptRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("exam_attempts")
    .select("*")
    .eq("id", attemptId)
    .maybeSingle();

  if (error) throw new Error(`Failed to load attempt: ${error.message}`);
  return (data as AttemptRow | null) ?? null;
}

export async function countUsedAttempts(userId: string, setId: string): Promise<number> {
  const { count, error } = await getSupabaseAdmin()
    .from("exam_attempts")
    .select("id", { count: "exact", head: true })
    .eq("auth_user_id", userId)
    .eq("set_id", setId)
    .in("status", ["submitted", "expired"]);

  if (error) throw new Error(`Failed to count attempts: ${error.message}`);
  return count ?? 0;
}

export async function setStatsForUser(userId: string): Promise<Map<string, SetStats>> {
  const { data, error } = await getSupabaseAdmin()
    .from("exam_attempts")
    .select("id, set_id, status, score, max_marks")
    .eq("auth_user_id", userId)
    .order("started_at", { ascending: false });

  if (error) throw new Error(`Failed to load attempt history: ${error.message}`);

  const stats = new Map<string, SetStats>();
  for (const row of (data ?? []) as Array<{
    id: string;
    set_id: string;
    status: AttemptStatus;
    score: number | string | null;
    max_marks: number | string;
  }>) {
    const current = stats.get(row.set_id) ?? {
      attemptsUsed: 0,
      bestScore: null,
      bestPercentage: null,
      openAttemptId: null,
    };

    if (row.status === "in_progress") {
      current.openAttemptId = row.id;
    } else {
      current.attemptsUsed += 1;
      if (row.score !== null) {
        const score = Number(row.score);
        const max = Number(row.max_marks) || 1;
        const percentage = Math.max(0, round2((score / max) * 100));
        if (current.bestPercentage === null || percentage > current.bestPercentage) {
          current.bestPercentage = percentage;
          current.bestScore = round2(score);
        }
      }
    }

    stats.set(row.set_id, current);
  }

  return stats;
}

export async function createAttemptRow(
  userId: string,
  candidateId: string | null,
  set: ExamSet,
  tokenHash: string
): Promise<AttemptRow> {
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + set.durationSeconds * 1000);

  const { data, error } = await getSupabaseAdmin()
    .from("exam_attempts")
    .insert({
      auth_user_id: userId,
      candidate_id: candidateId,
      set_id: set.id,
      exam_type: set.examType,
      attempt_token_hash: tokenHash,
      status: "in_progress",
      started_at: startedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      duration_seconds: set.durationSeconds,
      question_count: questionCount(set),
      max_marks: computeMaxMarks(set),
    })
    .select("*")
    .single();

  if (error) {
    // Unique open-attempt index: another request (or tab) already opened one.
    if (error.code === "23505") {
      const existing = await findOpenAttempt(userId, set.id);
      if (existing) return existing;
    }
    throw new Error(`Failed to start attempt: ${error.message}`);
  }

  return data as AttemptRow;
}

export async function rotateAttemptToken(attemptId: string, tokenHash: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("exam_attempts")
    .update({ attempt_token_hash: tokenHash })
    .eq("id", attemptId)
    .eq("status", "in_progress");

  if (error) throw new Error(`Failed to refresh attempt token: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

export async function responsesFor(attemptId: string): Promise<ResponseRow[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("exam_responses")
    .select("*")
    .eq("attempt_id", attemptId);

  if (error) throw new Error(`Failed to load responses: ${error.message}`);
  return (data ?? []) as ResponseRow[];
}

export function normalizeResponses(set: ExamSet, raw: unknown): ResponseInput[] {
  if (!Array.isArray(raw)) return [];

  const known = new Set<string>();
  for (const section of set.sections) {
    for (const question of section.questions) known.add(question.id);
  }

  const byQuestion = new Map<string, ResponseInput>();

  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) continue;
    const item = entry as Record<string, unknown>;
    const questionId = typeof item.questionId === "string" ? item.questionId : null;
    if (!questionId || !known.has(questionId)) continue;

    const rawIndex = item.selectedIndex;
    const selectedIndex =
      typeof rawIndex === "number" && Number.isInteger(rawIndex) && rawIndex >= 0 && rawIndex <= 3
        ? rawIndex
        : null;

    const timeSpent = item.timeSpentMs;
    byQuestion.set(questionId, {
      questionId,
      selectedIndex,
      markedForReview: item.markedForReview === true,
      visited: item.visited === true,
      timeSpentMs:
        typeof timeSpent === "number" && Number.isFinite(timeSpent) && timeSpent >= 0
          ? Math.min(Math.round(timeSpent), 24 * 60 * 60 * 1000)
          : 0,
    });
  }

  return Array.from(byQuestion.values());
}

export async function saveResponses(attemptId: string, responses: ResponseInput[]): Promise<void> {
  if (responses.length === 0) return;

  const rows = responses.map((response) => ({
    attempt_id: attemptId,
    question_id: response.questionId,
    selected_index: response.selectedIndex,
    marked_for_review: response.markedForReview,
    visited: response.visited,
    time_spent_ms: response.timeSpentMs,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await getSupabaseAdmin()
    .from("exam_responses")
    .upsert(rows, { onConflict: "attempt_id,question_id" });

  if (error) throw new Error(`Failed to save responses: ${error.message}`);
}

export async function touchAttempt(
  attemptId: string,
  integrityFlags: string[],
  clientMeta: Record<string, unknown> | null
): Promise<void> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (integrityFlags.length > 0) patch.integrity_flags = integrityFlags.slice(0, 50);
  if (clientMeta) patch.client_meta = clientMeta;

  const { error } = await getSupabaseAdmin()
    .from("exam_attempts")
    .update(patch)
    .eq("id", attemptId)
    .eq("status", "in_progress");

  if (error) throw new Error(`Failed to update attempt: ${error.message}`);
}

export function answerMapFrom(rows: ResponseRow[]): AnswerMap {
  const answers: AnswerMap = new Map();
  for (const row of rows) answers.set(row.question_id, row.selected_index ?? null);
  return answers;
}

// ---------------------------------------------------------------------------
// Finalising and serialising
// ---------------------------------------------------------------------------

export async function finalizeAttempt(
  attempt: AttemptRow,
  set: ExamSet,
  status: Extract<AttemptStatus, "submitted" | "expired">
): Promise<AttemptRow> {
  if (attempt.status !== "in_progress") return attempt;

  const responses = await responsesFor(attempt.id);
  const result = scoreExamSet(set, answerMapFrom(responses));

  const { data, error } = await getSupabaseAdmin()
    .from("exam_attempts")
    .update({
      status,
      submitted_at: new Date().toISOString(),
      score: result.score,
      correct_count: result.correct,
      wrong_count: result.wrong,
      unattempted_count: result.unattempted,
      section_scores: result.sections,
      updated_at: new Date().toISOString(),
    })
    .eq("id", attempt.id)
    .eq("status", "in_progress")
    .select("*")
    .maybeSingle();

  if (error) throw new Error(`Failed to finalise attempt: ${error.message}`);
  if (data) return data as AttemptRow;

  // Lost the race: another submit already finalised it.
  const current = await getAttemptById(attempt.id);
  if (!current) throw new Error("Attempt disappeared while finalising");
  return current;
}

export interface StartPayload {
  attemptId: string;
  attemptToken: string;
  set: {
    id: string;
    title: string;
    examType: string;
    patternNote: string;
    durationSeconds: number;
    marksPerQuestion: number;
    negativeMarks: number;
    questionCount: number;
    maxMarks: number;
    attemptCap: number;
    reviewPolicy: ExamSet["reviewPolicy"];
  };
  sections: PublicSection[];
  responses: ResponseInput[];
  startedAt: string;
  expiresAt: string;
  remainingSeconds: number;
}

export function buildStartPayload(attempt: AttemptRow, set: ExamSet, token: string, rows: ResponseRow[]): StartPayload {
  return {
    attemptId: attempt.id,
    attemptToken: token,
    set: {
      id: set.id,
      title: set.title,
      examType: set.examType,
      patternNote: set.patternNote,
      durationSeconds: set.durationSeconds,
      marksPerQuestion: set.marksPerQuestion,
      negativeMarks: set.negativeMarks,
      questionCount: questionCount(set),
      maxMarks: computeMaxMarks(set),
      attemptCap: set.attemptCap,
      reviewPolicy: set.reviewPolicy,
    },
    sections: toPublicSections(set),
    responses: rows.map((row) => ({
      questionId: row.question_id,
      selectedIndex: row.selected_index,
      markedForReview: row.marked_for_review,
      visited: row.visited,
      timeSpentMs: row.time_spent_ms,
    })),
    startedAt: attempt.started_at,
    expiresAt: attempt.expires_at,
    remainingSeconds: secondsUntil(attempt.expires_at),
  };
}

export interface ResultPayload {
  attemptId: string;
  setId: string;
  setTitle: string;
  examType: string;
  status: AttemptStatus;
  startedAt: string;
  submittedAt: string | null;
  expiresAt: string;
  durationSeconds: number;
  questionCount: number;
  maxMarks: number;
  score: number | null;
  percentage: number | null;
  correct: number | null;
  wrong: number | null;
  unattempted: number | null;
  passPercent: number;
  passed: boolean | null;
  sections: SectionBreakdown[] | null;
  integrityFlags: string[];
  review:
    | null
    | Array<{
        questionId: string;
        sectionId: string;
        subject: string;
        stem: string;
        options: string[];
        topic: string;
        selectedIndex: number | null;
        correctIndex: number;
        isCorrect: boolean;
        explanation: string;
      }>;
}

export function buildResultPayload(attempt: AttemptRow, set: ExamSet, rows: ResponseRow[]): ResultPayload {
  const isFinal = attempt.status !== "in_progress";
  const storedScore = attempt.score === null ? null : round2(Number(attempt.score));
  const max = Number(attempt.max_marks) || computeMaxMarks(set);
  const percentage = storedScore === null ? null : Math.max(0, round2((storedScore / max) * 100));

  const base: ResultPayload = {
    attemptId: attempt.id,
    setId: attempt.set_id,
    setTitle: set.title,
    examType: attempt.exam_type,
    status: attempt.status,
    startedAt: attempt.started_at,
    submittedAt: attempt.submitted_at,
    expiresAt: attempt.expires_at,
    durationSeconds: attempt.duration_seconds,
    questionCount: attempt.question_count,
    maxMarks: max,
    score: storedScore,
    percentage,
    correct: attempt.correct_count,
    wrong: attempt.wrong_count,
    unattempted: attempt.unattempted_count,
    passPercent: PASS_PERCENT,
    passed: percentage === null ? null : percentage >= PASS_PERCENT,
    sections: (attempt.section_scores as SectionBreakdown[] | null) ?? null,
    integrityFlags: attempt.integrity_flags ?? [],
    review: null,
  };

  if (!isFinal || set.reviewPolicy !== "after_submit") return base;

  const answers = answerMapFrom(rows);
  base.review = set.sections.flatMap((section) =>
    section.questions.map((question) => {
      const selected = answers.get(question.id) ?? null;
      return {
        questionId: question.id,
        sectionId: section.id,
        subject: question.subject,
        stem: question.stem,
        options: question.options,
        topic: question.topic,
        selectedIndex: selected,
        correctIndex: question.correctIndex,
        isCorrect: selected !== null && selected === question.correctIndex,
        explanation: question.explanation,
      };
    })
  );

  return base;
}

export function publicSetCatalog() {
  return listExamSets().map((set) => ({
    id: set.id,
    title: set.title,
    examType: set.examType,
    patternNote: set.patternNote,
    durationSeconds: set.durationSeconds,
    marksPerQuestion: set.marksPerQuestion,
    negativeMarks: set.negativeMarks,
    attemptCap: set.attemptCap,
    reviewPolicy: set.reviewPolicy,
    questionCount: questionCount(set),
    maxMarks: computeMaxMarks(set),
    sections: set.sections.map((section) => ({
      id: section.id,
      title: section.title,
      questionCount: section.questions.length,
    })),
  }));
}

export function examSetOrNull(setId: string): ExamSet | null {
  return getExamSet(setId) ?? null;
}
