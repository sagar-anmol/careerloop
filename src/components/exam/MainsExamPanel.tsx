"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  BadgeCheck,
  Clock,
  FileText,
  Loader2,
  Lock,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  accessToken,
  fetchHistory,
  fetchSets,
  formatDuration,
  type HistoryItem,
  type SetCatalogItem,
} from "@/lib/exams/client";

/** The official scored mains set. Everything else is a practice mock set. */
export const OFFICIAL_MAINS_SET_ID = "careerloop-mains-01";

type PanelScope = "all" | "mains" | "practice";

const SCOPE_COPY: Record<PanelScope, { title: string; description: string }> = {
  all: {
    title: "Mains Exam — Timed Test Sets",
    description:
      "JEE-Mains style interface · fullscreen · mark for review · server clock · answers scored on the backend",
  },
  mains: {
    title: "Official Mains Exam",
    description:
      "The scored exam that feeds your verified dossier. 2 attempts, highest score counts. Server-verified.",
  },
  practice: {
    title: "Weekly Mock & Practice Sets",
    description:
      "Practice modules scored the same way as the mains exam. Practice scores never overwrite your official mains score.",
  },
};

function setMatchesScope(setId: string, scope: PanelScope) {
  if (scope === "mains") return setId === OFFICIAL_MAINS_SET_ID;
  if (scope === "practice") return setId !== OFFICIAL_MAINS_SET_ID;
  return true;
}

export function MainsExamPanel({
  scope = "all",
  onStartDemo,
}: {
  scope?: PanelScope;
  onStartDemo?: () => void;
}) {
  const [sets, setSets] = useState<SetCatalogItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [demoCompleted, setDemoCompleted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = await accessToken();
        if (!token) {
          if (!cancelled) {
            setSignedIn(false);
            setLoading(false);
          }
          return;
        }
        const [setsResponse, historyResponse] = await Promise.all([fetchSets(), fetchHistory()]);
        if (cancelled) return;
        setSignedIn(true);
        setSets(setsResponse.sets);
        setDemoCompleted(setsResponse.demoCompleted);
        setHistory(historyResponse.attempts);
        setError(null);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load the exam sets.");
          setLoading(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const refresh = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  if (loading) {
    return (
      <Card className="border-slate-200 shadow-none bg-white">
        <CardContent className="flex items-center justify-center gap-2 py-12 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your test sets…
        </CardContent>
      </Card>
    );
  }

  if (!signedIn) {
    return (
      <Card className="border-slate-200 shadow-none bg-white">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Lock className="h-6 w-6 text-slate-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sign in to take tests</h3>
            <p className="mt-1 text-xs text-slate-500">
              Scores are verified on the server against your account, so a sign-in is required.
            </p>
          </div>
          <Button size="sm" render={<Link href="/" />}>
            Go to sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Hard gate: no sets, no history, no scores until the demo is on record.
  if (!demoCompleted) {
    return (
      <Card className="border-amber-300 shadow-none bg-gradient-to-br from-amber-50 to-white">
        <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-slate-950">
            <Lock className="h-6 w-6" />
          </div>
          <div className="max-w-md">
            <h3 className="text-sm font-bold text-slate-900">
              {scope === "practice" ? "Weekly mocks are locked" : "Mains exam is locked"}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              The 3-question demo orientation calibrates the exam interface and unlocks every
              scored test. It is not scored and does not use one of your mains attempts.
            </p>
          </div>
          {onStartDemo ? (
            <Button
              size="sm"
              onClick={onStartDemo}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-9 px-5"
            >
              <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
              Take the Demo Set
            </Button>
          ) : (
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-9 px-5" render={<Link href="/profile" />}>
              Take the Demo Set
            </Button>
          )}
          <p className="text-[11px] text-slate-500">
            Unlocking is checked on the server, not just in the browser.
          </p>
        </CardContent>
      </Card>
    );
  }

  const visibleSets = sets.filter((set) => setMatchesScope(set.id, scope));
  const visibleHistory = history.filter((attempt) => setMatchesScope(attempt.setId, scope));
  const copy = SCOPE_COPY[scope];

  return (
    <div className="space-y-5">
      <Card className="border-slate-200 shadow-none bg-white">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                  {copy.title}
                </CardTitle>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold text-[10px]">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Server-verified
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                {copy.description}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={refresh}>
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-3">
          {error && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              {error}
            </p>
          )}

          {visibleSets.length === 0 && !error && (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500">
              No exam sets are published yet. Check back soon.
            </p>
          )}

          {visibleSets.map((set) => {
            const resumable = Boolean(set.openAttemptId);
            const blocked = set.attemptsRemaining <= 0 && !resumable;
            const official = set.id === OFFICIAL_MAINS_SET_ID;
            return (
              <div
                key={set.id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-900">{set.title}</h4>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium ${
                          official
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "text-slate-600"
                        }`}
                      >
                        {official ? "Official mains" : "Practice mock"}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-medium text-slate-600">
                        {formatDuration(set.durationSeconds)}
                      </Badge>
                      {set.bestPercentage !== null && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                          <Trophy className="mr-1 h-3 w-3" />
                          Best {set.bestScore}/{set.maxMarks}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {set.sections.map((section) => (
                        <span
                          key={section.id}
                          className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {section.title} · {section.questionCount}
                        </span>
                      ))}
                    </div>

                    <p className="mt-2 text-[11px] text-slate-500">
                      {set.questionCount} questions · +{set.marksPerQuestion} correct
                      {set.negativeMarks > 0 ? ` · −${set.negativeMarks} wrong` : " · no negative marking"} ·{" "}
                      {set.attemptsUsed}/{set.attemptCap} attempts used
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                    {resumable ? (
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-8 px-4"
                        render={<Link href={`/exam/${set.id}`} />}
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        Resume attempt
                      </Button>
                    ) : blocked ? (
                      <Button size="sm" disabled variant="outline" className="text-xs h-8 px-4">
                        <Lock className="h-3.5 w-3.5" />
                        Attempts used
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-8 px-4"
                        render={<Link href={`/exam/${set.id}`} />}
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        Start test
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <p className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2 text-[11px] leading-relaxed text-blue-900">
            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Questions are original practice items written to match each exam pattern — not copies of official papers.
            Your answers are graded by the server and stored with the attempt, so the score shown here is the same one
            any placement partner would see.
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-none bg-white">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
              Verified attempt history
            </CardTitle>
            <Award className="h-4 w-4 text-slate-400" />
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Every row is scored and stored by the backend — editing the browser cannot change it.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {visibleHistory.length === 0 ? (
            <p className="flex flex-col items-center gap-1.5 py-8 text-xs text-slate-400">
              <FileText className="h-5 w-5 text-slate-300" />
              No attempts yet. Start a set above to record your first verified score.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 bg-slate-50/50">
                    <TableHead className="text-xs font-medium text-slate-600">Date</TableHead>
                    <TableHead className="text-xs font-medium text-slate-600">Set</TableHead>
                    <TableHead className="text-xs font-medium text-slate-600 text-center">Score</TableHead>
                    <TableHead className="text-xs font-medium text-slate-600">Status</TableHead>
                    <TableHead className="text-xs font-medium text-slate-600 text-right">Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleHistory.map((attempt) => (
                    <TableRow key={attempt.attemptId} className="border-slate-100 hover:bg-slate-50/50">
                      <TableCell className="text-xs font-mono text-slate-500 py-3">
                        {new Date(attempt.submittedAt ?? attempt.startedAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-800 py-3">{attempt.setTitle}</TableCell>
                      <TableCell className="text-center py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold tabular-nums ${
                            attempt.passed === true
                              ? "bg-emerald-50 text-emerald-700"
                              : attempt.passed === false
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-50 text-slate-500"
                          }`}
                        >
                          {attempt.score === null ? "—" : `${attempt.score} / ${attempt.maxMarks}`}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-medium py-3 text-slate-700">
                        {attempt.status === "in_progress"
                          ? "In progress"
                          : attempt.status === "expired"
                          ? "Time expired"
                          : attempt.passed === true
                          ? "Passed"
                          : "Needs practice"}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        {attempt.status !== "in_progress" ? (
                          <Link
                            href={`/exam/${attempt.setId}?attempt=${attempt.attemptId}`}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                          >
                            View result
                          </Link>
                        ) : (
                          <Link
                            href={`/exam/${attempt.setId}`}
                            className="text-xs font-semibold text-amber-600 hover:text-amber-800"
                          >
                            Resume
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {visibleHistory.length > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Clock className="h-3 w-3" />
              Showing your 50 most recent attempts.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
