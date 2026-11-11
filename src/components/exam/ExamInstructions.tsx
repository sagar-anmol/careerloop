"use client";

import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration, type SetCatalogItem } from "@/lib/exams/client";
import { STATUS_LABELS } from "./types";

export function ExamInstructions({
  set,
  starting,
  error,
  hasOpenAttempt,
  onStart,
}: {
  set: SetCatalogItem;
  starting: boolean;
  error: string | null;
  hasOpenAttempt: boolean;
  onStart: () => void;
}) {
  const [declared, setDeclared] = useState(false);

  return (
    <div className="min-h-dvh bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">CareerLoop Mains Test</p>
              <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{set.title}</h1>
            </div>
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              Scored on the server
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-600">{set.patternNote}</p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Questions", value: String(set.questionCount) },
              { label: "Duration", value: formatDuration(set.durationSeconds) },
              { label: "Per correct", value: `+${set.marksPerQuestion}` },
              {
                label: "Per wrong",
                value: set.negativeMarks > 0 ? `−${set.negativeMarks}` : "None",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-center">
                <p className="text-base font-bold tabular-nums text-slate-900">{item.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Section</th>
                  <th className="px-3 py-2 text-right font-semibold">Questions</th>
                  <th className="px-3 py-2 text-right font-semibold">Max marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {set.sections.map((section) => (
                  <tr key={section.id}>
                    <td className="px-3 py-2 font-medium">{section.title}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{section.questionCount}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {section.questionCount * set.marksPerQuestion}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-semibold text-slate-900">
                  <td className="px-3 py-2">Total</td>
                  <td className="px-3 py-2 text-right tabular-nums">{set.questionCount}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{set.maxMarks}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">Instructions</h2>
            <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-slate-600">
              <li>The timer runs from the server. Reloading the page will not reset or extend it.</li>
              <li>The test opens in fullscreen. Leaving fullscreen is recorded with your attempt — you can return with one click.</li>
              <li>
                Use <strong>Save & Next</strong> to lock an answer, <strong>Clear Response</strong> to unselect, and{" "}
                <strong>Mark for Review & Next</strong> to flag a question.
              </li>
              <li>Your answers are autosaved to the server every 15 seconds and when you switch tabs.</li>
              <li>
                When the clock reaches 00:00 the test is submitted automatically with your last saved answers.
              </li>
              <li>Shortcuts: 1–4 to choose an option, ←/→ to move, M to mark, S to save & next.</li>
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            {STATUS_LABELS.map((item) => (
              <div key={item.status} className="flex items-center gap-2 text-[11px] text-slate-600">
                <span className={`h-3.5 w-3.5 rounded-sm ${item.swatch}`} aria-hidden="true" />
                {item.label}
              </div>
            ))}
          </div>

          {hasOpenAttempt && (
            <p className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-800">
              You have an attempt already in progress for this set. Starting again resumes it with the remaining time.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              {error}
            </p>
          )}

          <label className="mt-5 flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 p-3 text-xs text-slate-700 hover:bg-slate-50">
            <input
              type="checkbox"
              checked={declared}
              onChange={(event) => setDeclared(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
            />
            <span>
              I have read and understood the instructions. I declare that I will not use any outside help during this
              test and that the score will be treated as my own verified result.
            </span>
          </label>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Attempts used: {set.attemptsUsed}/{set.attemptCap}
            </p>
            <Button onClick={onStart} disabled={!declared || starting} className="px-6">
              {starting && <Loader2 className="h-4 w-4 animate-spin" />}
              {starting ? "Starting…" : hasOpenAttempt ? "Resume test" : "I am ready to begin"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
