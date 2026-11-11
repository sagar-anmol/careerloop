"use client";

import { STATUS_LABELS, STATUS_STYLES, type PaletteEntry } from "./types";

export function QuestionPalette({
  entries,
  currentQuestionId,
  onSelect,
}: {
  entries: PaletteEntry[];
  currentQuestionId: string;
  onSelect: (questionId: string) => void;
}) {
  const sections = Array.from(new Set(entries.map((entry) => entry.sectionId)));

  return (
    <aside className="flex w-full flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 lg:w-64 lg:shrink-0">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Question Palette</h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {entries.filter((entry) => entry.status === "answered" || entry.status === "answered_marked").length} answered of {entries.length}
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((sectionId) => {
          const group = entries.filter((entry) => entry.sectionId === sectionId);
          return (
            <div key={sectionId}>
              <p className="mb-1.5 truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {group[0]?.sectionTitle}
              </p>
              <div className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
                {group.map((entry) => {
                  const isCurrent = entry.questionId === currentQuestionId;
                  return (
                    <button
                      key={entry.questionId}
                      type="button"
                      onClick={() => onSelect(entry.questionId)}
                      className={`flex h-8 items-center justify-center rounded border text-xs font-semibold transition-colors ${STATUS_STYLES[entry.status]} ${
                        isCurrent ? "ring-2 ring-slate-900 ring-offset-1" : ""
                      }`}
                      aria-label={`Question ${entry.label} — ${entry.status.replace(/_/g, " ")}`}
                      aria-current={isCurrent ? "true" : undefined}
                    >
                      {entry.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-1 space-y-1.5 border-t border-slate-100 pt-2.5">
        {STATUS_LABELS.map((item) => (
          <div key={item.status} className="flex items-center gap-2 text-[11px] text-slate-600">
            <span className={`h-3 w-3 rounded-sm ${item.swatch}`} aria-hidden="true" />
            {item.label}
          </div>
        ))}
      </div>
    </aside>
  );
}
