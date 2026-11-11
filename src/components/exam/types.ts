export type QuestionStatus =
  | "not_visited"
  | "not_answered"
  | "answered"
  | "marked"
  | "answered_marked";

export interface PaletteEntry {
  questionId: string;
  sectionId: string;
  sectionTitle: string;
  label: number;
  status: QuestionStatus;
}

export const STATUS_STYLES: Record<QuestionStatus, string> = {
  not_visited: "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200",
  not_answered: "bg-red-500 text-white border-red-600 hover:bg-red-600",
  answered: "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600",
  marked: "bg-violet-500 text-white border-violet-600 hover:bg-violet-600",
  answered_marked:
    "bg-emerald-500 text-white border-violet-500 ring-2 ring-violet-400 ring-offset-1 hover:bg-emerald-600",
};

export const STATUS_LABELS: Array<{ status: QuestionStatus; label: string; swatch: string }> = [
  { status: "not_visited", label: "Not visited", swatch: "bg-slate-200 border border-slate-300" },
  { status: "not_answered", label: "Not answered", swatch: "bg-red-500" },
  { status: "answered", label: "Answered", swatch: "bg-emerald-500" },
  { status: "marked", label: "Marked for review", swatch: "bg-violet-500" },
  { status: "answered_marked", label: "Answered & marked", swatch: "bg-emerald-500 ring-2 ring-violet-400" },
];

export function statusOf(selected: number | null, marked: boolean, visited: boolean): QuestionStatus {
  if (selected !== null && marked) return "answered_marked";
  if (selected !== null) return "answered";
  if (marked) return "marked";
  if (visited) return "not_answered";
  return "not_visited";
}
