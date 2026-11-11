"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ChevronDown,
  Home,
  RotateCcw,
  Timer,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExamResultPayload } from "@/lib/exams/client";

const LETTERS = ["A", "B", "C", "D"];

export function ExamResult({
  result,
  onRetake,
  retakeDisabled,
}: {
  result: ExamResultPayload;
  onRetake?: () => void;
  retakeDisabled?: boolean;
}) {
  const [showAll, setShowAll] = useState(false);

  const expired = result.status === "expired";
  const passed = result.passed === true;
  const scoreColor = passed ? "text-emerald-600" : "text-amber-600";
  const review = result.review ?? [];
  const visibleReview = showAll ? review : review.slice(0, 8);

  return (
    <div className="min-h-dvh bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Score card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Verified result</p>
              <h1 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">{result.setTitle}</h1>
              <p className="mt-1 text-xs text-slate-500">
                {result.submittedAt
                  ? `Submitted ${new Date(result.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`
                  : "Awaiting submission"}
              </p>
            </div>
            <Badge
              className={
                expired
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : passed
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-amber-100 text-amber-800 border-amber-200"
              }
            >
              {expired ? "Time expired" : passed ? "Passed" : "Needs practice"}
            </Badge>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-6">
            <div>
              <p className={`text-4xl font-black tabular-nums ${scoreColor}`}>
                {result.score ?? "—"}
                <span className="text-lg font-semibold text-slate-400"> / {result.maxMarks}</span>
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {result.percentage === null ? "—" : `${result.percentage}%`} · pass mark {result.passPercent}%
              </p>
            </div>
            {result.percentage !== null && (
              <div className="flex flex-1 items-center gap-2">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${passed ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, Math.max(0, result.percentage))}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Correct", value: result.correct, icon: CheckCircle2, tone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
              { label: "Wrong", value: result.wrong, icon: XCircle, tone: "text-red-700 bg-red-50 border-red-200" },
              { label: "Unattempted", value: result.unattempted, icon: Timer, tone: "text-slate-700 bg-slate-50 border-slate-200" },
              { label: "Questions", value: result.questionCount, icon: Award, tone: "text-blue-700 bg-blue-50 border-blue-200" },
            ].map((item) => (
              <div key={item.label} className={`rounded-lg border px-3 py-2.5 text-center ${item.tone}`}>
                <p className="text-lg font-bold tabular-nums">{item.value ?? "—"}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>

          {expired && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Your time ran out, so the server submitted the attempt with your last saved answers.
            </p>
          )}

          {result.integrityFlags.length > 0 && (
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              Recorded during the test: {result.integrityFlags.length} integrity event
              {result.integrityFlags.length === 1 ? "" : "s"} (for example, leaving fullscreen or hiding the tab).
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-1.5" render={<Link href="/dashboard" />}>
              <Home className="h-4 w-4" />
              Back to dashboard
            </Button>
            {onRetake && (
              <Button onClick={onRetake} disabled={retakeDisabled} className="gap-1.5">
                <RotateCcw className="h-4 w-4" />
                {retakeDisabled ? "No attempts left" : "Retake this set"}
              </Button>
            )}
          </div>
        </div>

        {/* Section breakdown */}
        {result.sections && result.sections.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-3">
              <h2 className="text-sm font-bold text-slate-900">Section-wise performance</h2>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-semibold">Section</th>
                  <th className="px-3 py-2 text-center font-semibold">Correct</th>
                  <th className="px-3 py-2 text-center font-semibold">Wrong</th>
                  <th className="px-3 py-2 text-center font-semibold">Left</th>
                  <th className="px-4 py-2 text-right font-semibold">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {result.sections.map((section) => (
                  <tr key={section.id}>
                    <td className="px-4 py-2 font-medium">{section.title}</td>
                    <td className="px-3 py-2 text-center tabular-nums text-emerald-700">{section.correct}</td>
                    <td className="px-3 py-2 text-center tabular-nums text-red-700">{section.wrong}</td>
                    <td className="px-3 py-2 text-center tabular-nums text-slate-500">{section.unattempted}</td>
                    <td className="px-4 py-2 text-right font-semibold tabular-nums">
                      {section.score} / {section.maxMarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Answer review */}
        {review.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setShowAll((show) => !show)}
              className="flex w-full items-center justify-between px-5 py-3 text-left"
            >
              <div>
                <h2 className="text-sm font-bold text-slate-900">Answer review & explanations</h2>
                <p className="text-[11px] text-slate-500">{review.length} questions with worked solutions</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showAll ? "rotate-180" : ""}`} />
            </button>

            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {visibleReview.map((item, index) => {
                const selectedLabel = item.selectedIndex === null ? "Not answered" : LETTERS[item.selectedIndex];
                const correctLabel = LETTERS[item.correctIndex];
                return (
                  <div
                    key={item.questionId}
                    className={`px-5 py-4 ${
                      item.selectedIndex === null
                        ? "border-l-4 border-slate-300"
                        : item.isCorrect
                        ? "border-l-4 border-emerald-400"
                        : "border-l-4 border-red-400"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400">Q{index + 1}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                        {item.subject} · {item.topic}
                      </span>
                      {item.selectedIndex === null ? (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Skipped
                        </span>
                      ) : item.isCorrect ? (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                          Correct
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-red-600">
                          Wrong
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-slate-900">{item.stem}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      Your answer: <span className="font-semibold">{selectedLabel}</span>
                      {item.selectedIndex !== null && ` — ${item.options[item.selectedIndex]}`}
                    </p>
                    <p className="text-xs text-slate-600">
                      Correct answer: <span className="font-semibold text-emerald-700">{correctLabel}</span> —{" "}
                      {item.options[item.correctIndex]}
                    </p>
                    <p className="mt-2 rounded-lg bg-blue-50/70 px-3 py-2 text-xs leading-relaxed text-blue-900">
                      {item.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            {review.length > 8 && (
              <button
                type="button"
                onClick={() => setShowAll((show) => !show)}
                className="w-full border-t border-slate-100 px-5 py-2.5 text-xs font-semibold text-blue-600 hover:bg-slate-50"
              >
                {showAll ? "Show fewer questions" : `Show all ${review.length} questions`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
