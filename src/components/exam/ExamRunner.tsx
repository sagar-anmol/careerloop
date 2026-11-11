"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Flag,
  Loader2,
  Maximize,
  Minimize,
  RefreshCw,
  TriangleAlert,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  autosaveAttempt,
  submitAttempt,
  type ExamResultPayload,
  type SavedResponse,
  type StartResponse,
} from "@/lib/exams/client";
import { ExamTimer } from "./ExamTimer";
import { QuestionPalette } from "./QuestionPalette";
import { SubmitDialog } from "./SubmitDialog";
import { statusOf, type PaletteEntry } from "./types";

type SaveState = "saved" | "saving" | "error" | "finalized";

interface FlatQuestion {
  id: string;
  label: number;
  sectionId: string;
  sectionTitle: string;
  subject: string;
  stem: string;
  options: string[];
  topic: string;
}

const LETTERS = ["A", "B", "C", "D"];

export function ExamRunner({
  payload,
  onFinished,
}: {
  payload: StartResponse;
  onFinished: (result: ExamResultPayload) => void;
}) {
  const flatQuestions = useMemo<FlatQuestion[]>(() => {
    const sections = payload.sections;
    return sections.flatMap((section, sectionIndex) => {
      const offset = sections
        .slice(0, sectionIndex)
        .reduce((total, earlier) => total + earlier.questions.length, 0);
      return section.questions.map((question, questionIndex) => ({
        id: question.id,
        label: offset + questionIndex + 1,
        sectionId: section.id,
        sectionTitle: section.title,
        subject: question.subject,
        stem: question.stem,
        options: question.options,
        topic: question.topic,
      }));
    });
  }, [payload.sections]);

  const initial = useMemo(() => {
    const answers: Record<string, number | null> = {};
    const marked: Record<string, boolean> = {};
    const visited: Record<string, boolean> = {};
    for (const response of payload.responses) {
      answers[response.questionId] = response.selectedIndex;
      marked[response.questionId] = response.markedForReview;
      visited[response.questionId] = response.visited;
    }
    return { answers, marked, visited };
  }, [payload.responses]);

  const [answers, setAnswers] = useState<Record<string, number | null>>(initial.answers);
  const [marked, setMarked] = useState<Record<string, boolean>>(initial.marked);
  const [visited, setVisited] = useState<Record<string, boolean>>(initial.visited);
  const [currentId, setCurrentId] = useState<string>(flatQuestions[0]?.id ?? "");
  const [remaining, setRemaining] = useState<number>(payload.remainingSeconds);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [fullscreenExit, setFullscreenExit] = useState(false);
  const [inFullscreen, setInFullscreen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(true);

  const current = flatQuestions.find((question) => question.id === currentId) ?? flatQuestions[0];
  const setMeta = payload.set;

  // Latest state for the periodic autosave without re-registering the interval.
  const stateRef = useRef({ answers, marked, visited });
  useEffect(() => {
    stateRef.current = { answers, marked, visited };
  }, [answers, marked, visited]);

  const deadlineRef = useRef(0);
  const flagsRef = useRef<string[]>([]);
  const submittingRef = useRef(false);
  const lastSaveRef = useRef(0);

  // The clock starts from the server-provided remaining time, never the client wall clock.
  useEffect(() => {
    deadlineRef.current = Date.now() + payload.remainingSeconds * 1000;
  }, [payload.remainingSeconds]);

  const pushFlag = useCallback((flag: string) => {
    const stamps = flagsRef.current;
    if (stamps.some((item) => item.startsWith(flag))) return;
    stamps.push(`${flag}:${Date.now()}`);
  }, []);

  const buildResponses = useCallback((): SavedResponse[] => {
    const { answers: currentAnswers, marked: currentMarked, visited: currentVisited } = stateRef.current;
    return flatQuestions
      .filter(
        (question) =>
          currentVisited[question.id] ||
          currentMarked[question.id] ||
          currentAnswers[question.id] !== null && currentAnswers[question.id] !== undefined
      )
      .map((question) => ({
        questionId: question.id,
        selectedIndex: currentAnswers[question.id] ?? null,
        markedForReview: currentMarked[question.id] ?? false,
        visited: currentVisited[question.id] ?? false,
        timeSpentMs: 0,
      }));
  }, [flatQuestions]);

  const finish = useCallback(
    (result: ExamResultPayload) => {
      submittingRef.current = true;
      if (typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => undefined);
      }
      onFinished(result);
    },
    [onFinished]
  );

  const doSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { result } = await submitAttempt({
        attemptId: payload.attemptId,
        attemptToken: payload.attemptToken,
        responses: buildResponses(),
      });
      setSaveState("finalized");
      finish(result);
    } catch (error) {
      submittingRef.current = false;
      setSubmitting(false);
      setTimeUp(false);
      setSubmitError(error instanceof Error ? error.message : "Could not submit. Try again.");
    }
  }, [buildResponses, finish, payload.attemptId, payload.attemptToken]);

  const save = useCallback(
    async (keepalive = false) => {
      if (submittingRef.current) return;
      if (!keepalive && Date.now() - lastSaveRef.current < 3000) return;
      lastSaveRef.current = Date.now();
      setSaveState("saving");
      try {
        const response = await autosaveAttempt({
          attemptId: payload.attemptId,
          attemptToken: payload.attemptToken,
          responses: buildResponses(),
          integrityFlags: flagsRef.current,
          clientMeta: {
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            fullscreen: Boolean(document.fullscreenElement),
          },
          keepalive,
        });
        if (response.finalized || response.status !== "in_progress") {
          setSaveState("finalized");
          // The server closed the attempt (time expired). Fetch the stored result.
          const { result } = await submitAttempt({
            attemptId: payload.attemptId,
            attemptToken: payload.attemptToken,
            responses: [],
          });
          finish(result);
          return;
        }
        deadlineRef.current = Math.min(
          deadlineRef.current,
          Date.now() + response.remainingSeconds * 1000
        );
        setRemaining(response.remainingSeconds);
        setSaveState("saved");
      } catch {
        if (!submittingRef.current) setSaveState("error");
      }
    },
    [buildResponses, finish, payload.attemptId, payload.attemptToken]
  );

  // Periodic autosave.
  useEffect(() => {
    const id = window.setInterval(() => {
      void save();
    }, 15000);
    return () => window.clearInterval(id);
  }, [save]);

  // Save when the tab is hidden or the page is closing.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        pushFlag("tab_hidden");
        setFullscreenExit((was) => was || Boolean(document.fullscreenElement));
        void save(true);
      }
    };
    const onPageHide = () => {
      void save(true);
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [pushFlag, save]);

  // Countdown. Resynced by every autosave response.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (deadlineRef.current === 0) return;
      const left = Math.ceil((deadlineRef.current - Date.now()) / 1000);
      setRemaining(left);
      if (left <= 0 && !submittingRef.current) {
        setTimeUp(true);
        void doSubmit();
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [doSubmit]);

  // Fullscreen tracking.
  useEffect(() => {
    const onChange = () => {
      const active = Boolean(document.fullscreenElement);
      setInFullscreen(active);
      if (!active) {
        pushFlag("fullscreen_exit");
        setFullscreenExit(true);
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [pushFlag]);

  // Warn before leaving with an unfinished attempt.
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (submittingRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const goTo = useCallback(
    (questionId: string) => {
      setCurrentId(questionId);
      setVisited((previous) => (previous[questionId] ? previous : { ...previous, [questionId]: true }));
    },
    []
  );

  const step = useCallback(
    (delta: number) => {
      const index = flatQuestions.findIndex((question) => question.id === currentId);
      const next = flatQuestions[index + delta];
      if (next) goTo(next.id);
    },
    [currentId, flatQuestions, goTo]
  );

  const select = useCallback((questionId: string, optionIndex: number) => {
    setAnswers((previous) => ({ ...previous, [questionId]: optionIndex }));
  }, []);

  const clearResponse = useCallback(() => {
    setAnswers((previous) => ({ ...previous, [currentId]: null }));
  }, [currentId]);

  const markAndNext = useCallback(() => {
    setMarked((previous) => ({ ...previous, [currentId]: true }));
    step(1);
  }, [currentId, step]);

  // Keyboard shortcuts, NTA style.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      if (["1", "2", "3", "4"].includes(event.key) && current) {
        select(current.id, Number(event.key) - 1);
      } else if (event.key === "ArrowRight") {
        step(1);
      } else if (event.key === "ArrowLeft") {
        step(-1);
      } else if (event.key === "m" || event.key === "M") {
        markAndNext();
      } else if (event.key === "s" || event.key === "S") {
        void save();
        step(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, markAndNext, save, select, step]);

  const entries = useMemo<PaletteEntry[]>(
    () =>
      flatQuestions.map((question) => ({
        questionId: question.id,
        sectionId: question.sectionId,
        sectionTitle: question.sectionTitle,
        label: question.label,
        status: statusOf(
          answers[question.id] ?? null,
          marked[question.id] ?? false,
          visited[question.id] ?? false
        ),
      })),
    [answers, flatQuestions, marked, visited]
  );

  const sections = useMemo(
    () =>
      payload.sections.map((section) => ({
        id: section.id,
        title: section.title,
        firstQuestionId: section.questions[0]?.id ?? "",
      })),
    [payload.sections]
  );

  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Browser refused (no user gesture / already exiting) — never block.
    }
  };

  const answeredCount = entries.filter(
    (entry) => entry.status === "answered" || entry.status === "answered_marked"
  ).length;

  const saveChip = {
    saved: { text: "Answers saved", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Check },
    saving: { text: "Saving…", className: "bg-slate-50 text-slate-600 border-slate-200", icon: Loader2 },
    error: { text: "Not saved — retrying", className: "bg-amber-50 text-amber-800 border-amber-300", icon: TriangleAlert },
    finalized: { text: "Submitted", className: "bg-slate-100 text-slate-600 border-slate-200", icon: Check },
  }[saveState];
  const SaveIcon = saveChip.icon;

  return (
    <div className="flex h-dvh flex-col bg-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-3 py-2 sm:px-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">{setMeta.title}</h1>
            <p className="truncate text-[11px] text-slate-500">
              {current?.sectionTitle} · {answeredCount}/{flatQuestions.length} answered
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`hidden items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium sm:inline-flex ${saveChip.className}`}
            >
              <SaveIcon className={`h-3 w-3 ${saveState === "saving" ? "animate-spin" : ""}`} />
              {saveChip.text}
            </span>
            <ExamTimer seconds={remaining} />
            <Button
              variant="outline"
              size="icon"
              aria-label={inFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              onClick={() => (inFullscreen ? document.exitFullscreen().catch(() => undefined) : requestFullscreen())}
            >
              {inFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button variant="destructive" onClick={() => setShowSubmitDialog(true)} disabled={submitting}>
              Submit
            </Button>
          </div>
        </div>

        {/* Section tabs */}
        <div className="mx-auto mt-2 flex max-w-6xl gap-1 overflow-x-auto pb-0.5">
          {sections.map((section) => {
            const active = current?.sectionId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => section.firstQuestionId && goTo(section.firstQuestionId)}
                className={`shrink-0 rounded-t-md border-b-2 px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                {section.title}
              </button>
            );
          })}
        </div>
      </header>

      {/* Fullscreen warning */}
      {fullscreenExit && (
        <div className="flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
          <span className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            You left fullscreen. This has been recorded with your attempt.
          </span>
          <Button size="sm" onClick={requestFullscreen}>
            <Maximize className="h-3.5 w-3.5" />
            Return to fullscreen
          </Button>
        </div>
      )}

      {/* Body */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 overflow-y-auto p-3 sm:p-4 lg:flex-row">
        <main className="min-w-0 flex-1">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-900 px-2 py-1 text-xs font-bold text-white">
                  Question {current?.label} of {flatQuestions.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPaletteOpen((open) => !open)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 lg:hidden"
              >
                {paletteOpen ? "Hide palette" : "Show palette"}
              </button>
            </div>

            <div className="space-y-5 px-4 py-5 sm:px-6">
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-900">{current?.stem}</p>

              <div className="space-y-2">
                {current?.options.map((option, index) => {
                  const selected = answers[current.id] === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => select(current.id, index)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                        selected
                          ? "border-blue-500 bg-blue-50 text-slate-900 ring-1 ring-blue-400"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                          selected ? "border-blue-500 bg-blue-600 text-white" : "border-slate-300 text-slate-600"
                        }`}
                      >
                        {LETTERS[index]}
                      </span>
                      <span className="min-w-0">{option}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500">
                Marking: +{setMeta.marksPerQuestion} for a correct answer
                {setMeta.negativeMarks > 0 ? `, −${setMeta.negativeMarks} for a wrong answer` : ", no negative marking"}.
                Shortcuts: 1–4 choose, ←/→ move, M mark, S save & next.
              </p>
            </div>
          </div>
        </main>

        {paletteOpen && (
          <QuestionPalette entries={entries} currentQuestionId={currentId} onSelect={goTo} />
        )}
      </div>

      {/* Footer actions */}
      <footer className="border-t border-slate-200 bg-white px-3 py-2.5 sm:px-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <Button variant="outline" onClick={() => step(-1)} disabled={!current || current.label === 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={clearResponse}>
              <X className="h-4 w-4" />
              Clear Response
            </Button>
            <Button variant="outline" onClick={markAndNext} className="border-violet-300 text-violet-700 hover:bg-violet-50">
              <Flag className="h-4 w-4" />
              Mark for Review & Next
            </Button>
            <Button onClick={() => { void save(); step(1); }}>
              Save & Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>

      <SubmitDialog
        open={showSubmitDialog}
        entries={entries}
        submitting={submitting}
        onCancel={() => setShowSubmitDialog(false)}
        onConfirm={() => {
          setShowSubmitDialog(false);
          void doSubmit();
        }}
      />

      {(submitting || timeUp) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
            {submitError ? (
              <>
                <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" />
                <h2 className="mt-3 text-base font-bold text-slate-900">Submit failed</h2>
                <p className="mt-1 text-xs text-slate-500">{submitError}</p>
                <div className="mt-4 flex justify-center gap-2">
                  <Button variant="outline" onClick={() => void save()}>
                    <RefreshCw className="h-4 w-4" />
                    Retry saving
                  </Button>
                  <Button onClick={() => void doSubmit()}>Try submitting again</Button>
                </div>
              </>
            ) : (
              <>
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <h2 className="mt-3 text-base font-bold text-slate-900">
                  {timeUp ? "Time is up" : "Submitting your test"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {timeUp
                    ? "The window has closed. Your last saved answers are being scored."
                    : "The server is scoring your answers…"}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
