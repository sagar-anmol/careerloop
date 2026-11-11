"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaletteEntry } from "./types";

export function SubmitDialog({
  open,
  entries,
  submitting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  entries: PaletteEntry[];
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  const answered = entries.filter((entry) => entry.status === "answered" || entry.status === "answered_marked").length;
  const marked = entries.filter((entry) => entry.status === "marked" || entry.status === "answered_marked").length;
  const notAnswered = entries.filter((entry) => entry.status === "not_answered").length;
  const notVisited = entries.filter((entry) => entry.status === "not_visited").length;
  const unansweredNumbers = entries
    .filter((entry) => entry.status === "not_answered" || entry.status === "not_visited")
    .map((entry) => entry.label);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Submit your test?</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Once submitted, the server scores your answers and the attempt counts towards the limit for this set.
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Answered", value: answered, tone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
              { label: "Marked", value: marked, tone: "text-violet-700 bg-violet-50 border-violet-200" },
              { label: "Not answered", value: notAnswered, tone: "text-red-700 bg-red-50 border-red-200" },
              { label: "Not visited", value: notVisited, tone: "text-slate-700 bg-slate-50 border-slate-200" },
            ].map((item) => (
              <div key={item.label} className={`rounded-lg border px-2 py-2 text-center ${item.tone}`}>
                <p className="text-lg font-bold tabular-nums">{item.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>

          {unansweredNumbers.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <p className="text-xs font-semibold text-amber-900">
                    {unansweredNumbers.length} question{unansweredNumbers.length === 1 ? "" : "s"} left without an answer
                  </p>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed text-amber-800">
                    {unansweredNumbers.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Keep working
          </Button>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {submitting ? "Submitting…" : "Submit test"}
          </Button>
        </div>
      </div>
    </div>
  );
}
