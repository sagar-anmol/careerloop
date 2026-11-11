"use client";

import { Clock } from "lucide-react";
import { formatClock } from "@/lib/exams/client";

export function ExamTimer({ seconds }: { seconds: number }) {
  const danger = seconds <= 300;
  return (
    <div
      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-sm font-semibold tabular-nums ${
        danger
          ? "border-red-300 bg-red-50 text-red-700"
          : "border-slate-200 bg-slate-50 text-slate-800"
      }`}
      aria-live="polite"
      aria-label={`Time remaining ${formatClock(seconds)}`}
    >
      <Clock className={`h-4 w-4 ${danger ? "text-red-600" : "text-slate-500"}`} />
      {formatClock(seconds)}
    </div>
  );
}
