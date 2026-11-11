"use client";

import { supabase } from "@/lib/supabaseClient";

export interface SetCatalogItem {
  id: string;
  title: string;
  examType: string;
  patternNote: string;
  durationSeconds: number;
  marksPerQuestion: number;
  negativeMarks: number;
  attemptCap: number;
  reviewPolicy: "after_submit" | "score_only";
  questionCount: number;
  maxMarks: number;
  sections: Array<{ id: string; title: string; questionCount: number }>;
  attemptsUsed: number;
  attemptsRemaining: number;
  openAttemptId: string | null;
  bestScore: number | null;
  bestPercentage: number | null;
}

export interface PublicQuestion {
  id: string;
  subject: string;
  stem: string;
  options: string[];
  topic: string;
}

export interface PublicSection {
  id: string;
  title: string;
  questions: PublicQuestion[];
}

export interface SavedResponse {
  questionId: string;
  selectedIndex: number | null;
  markedForReview: boolean;
  visited: boolean;
  timeSpentMs: number;
}

export interface StartResponse {
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
    reviewPolicy: "after_submit" | "score_only";
  };
  sections: PublicSection[];
  responses: SavedResponse[];
  startedAt: string;
  expiresAt: string;
  remainingSeconds: number;
}

export interface SectionBreakdown {
  id: string;
  title: string;
  questionCount: number;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  maxMarks: number;
}

export interface ReviewItem {
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
}

export interface ExamResultPayload {
  attemptId: string;
  setId: string;
  setTitle: string;
  examType: string;
  status: "in_progress" | "submitted" | "expired";
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
  review: ReviewItem[] | null;
}

export interface HistoryItem {
  attemptId: string;
  setId: string;
  setTitle: string;
  status: "in_progress" | "submitted" | "expired";
  startedAt: string;
  submittedAt: string | null;
  score: number | null;
  maxMarks: number;
  percentage: number | null;
  passed: boolean | null;
  correct: number | null;
  wrong: number | null;
  unattempted: number | null;
  questionCount: number;
  integrityFlags: string[];
}

export class ExamApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ExamApiError";
    this.code = code;
    this.status = status;
  }
}

export async function accessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  if (!token) {
    throw new ExamApiError("Sign in to continue.", "UNAUTHENTICATED", 401);
  }

  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    throw new ExamApiError(
      typeof payload.error === "string" ? payload.error : "Request failed.",
      typeof payload.code === "string" ? payload.code : "REQUEST_FAILED",
      response.status
    );
  }

  return payload as T;
}

export function fetchSets(): Promise<{ sets: SetCatalogItem[]; demoCompleted: boolean }> {
  return api("/api/exam/sets");
}

export function fetchDemoStatus(): Promise<{ completed: boolean }> {
  return api("/api/exam/demo");
}

export function completeDemo(): Promise<{ completed: boolean }> {
  return api("/api/exam/demo", { method: "POST" });
}

export function startExam(setId: string): Promise<StartResponse> {
  return api("/api/exam/start", { method: "POST", body: JSON.stringify({ setId }) });
}

export function autosaveAttempt(input: {
  attemptId: string;
  attemptToken: string;
  responses: SavedResponse[];
  integrityFlags?: string[];
  clientMeta?: Record<string, unknown>;
  keepalive?: boolean;
}): Promise<{ status: string; savedAt: string | null; remainingSeconds: number; finalized: boolean }> {
  return api("/api/exam/autosave", {
    method: "PATCH",
    body: JSON.stringify({
      attemptId: input.attemptId,
      attemptToken: input.attemptToken,
      responses: input.responses,
      integrityFlags: input.integrityFlags,
      clientMeta: input.clientMeta,
    }),
    keepalive: input.keepalive,
  });
}

export function submitAttempt(input: {
  attemptId: string;
  attemptToken: string;
  responses: SavedResponse[];
}): Promise<{ result: ExamResultPayload; alreadyFinal: boolean }> {
  return api("/api/exam/submit", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchResult(attemptId: string): Promise<{ result: ExamResultPayload }> {
  return api(`/api/exam/result/${encodeURIComponent(attemptId)}`);
}

export function fetchHistory(): Promise<{ attempts: HistoryItem[] }> {
  return api("/api/exam/history");
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  return `${minutes} min`;
}
