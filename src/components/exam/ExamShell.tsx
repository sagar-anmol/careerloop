"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Loader2, Lock, SearchX, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  accessToken,
  ExamApiError,
  fetchResult,
  fetchSets,
  startExam,
  type ExamResultPayload,
  type SetCatalogItem,
  type StartResponse,
} from "@/lib/exams/client";
import { ExamInstructions } from "./ExamInstructions";
import { ExamResult } from "./ExamResult";
import { ExamRunner } from "./ExamRunner";

type Phase =
  | "loading"
  | "gate"
  | "demo_required"
  | "not_found"
  | "error"
  | "ready"
  | "starting"
  | "running"
  | "result";

export function ExamShell({
  setId,
  initialAttemptId = null,
}: {
  setId: string;
  initialAttemptId?: string | null;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [meta, setMeta] = useState<SetCatalogItem | null>(null);
  const [payload, setPayload] = useState<StartResponse | null>(null);
  const [result, setResult] = useState<ExamResultPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    const response = await fetchSets();
    const match = response.sets.find((set) => set.id === setId) ?? null;
    setMeta(match);
    return { match, demoCompleted: response.demoCompleted };
  }, [setId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Deep link to a stored result (from the dashboard history table).
      if (initialAttemptId) {
        try {
          const { result } = await fetchResult(initialAttemptId);
          if (!cancelled) {
            setResult(result);
            setPhase("result");
            loadCatalog().catch(() => undefined);
            return;
          }
        } catch {
          // Fall through to the normal instructions flow.
        }
      }

      try {
        const token = await accessToken();
        if (!token) {
          if (!cancelled) setPhase("gate");
          return;
        }
        const { match, demoCompleted: demoDone } = await loadCatalog();
        if (cancelled) return;
        if (!match) {
          setPhase("not_found");
          return;
        }
        if (!demoDone) {
          setPhase("demo_required");
          return;
        }
        setPhase("ready");
      } catch (loadError) {
        if (cancelled) return;
        setError(
          loadError instanceof Error ? loadError.message : "Could not load this exam set. Try again."
        );
        setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialAttemptId, loadCatalog]);

  const handleStart = useCallback(async () => {
    setPhase("starting");
    setError(null);
    try {
      // Must run inside the click gesture, before any await.
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Fullscreen is best-effort; leaving it is recorded as an integrity event.
      }
      const started = await startExam(setId);
      setPayload(started);
      setResult(null);
      setPhase("running");
    } catch (startError) {
      if (startError instanceof ExamApiError && startError.code === "DEMO_REQUIRED") {
        setPhase("demo_required");
        return;
      }
      setPhase("ready");
      setError(startError instanceof Error ? startError.message : "Could not start the test. Try again.");
      try {
        await loadCatalog();
      } catch {
        // Keep the previous catalog; the error banner already explains the state.
      }
    }
  }, [loadCatalog, setId]);

  const handleFinished = useCallback(async (finished: ExamResultPayload) => {
    setResult(finished);
    setPhase("result");
    setPayload(null);
    try {
      await loadCatalog();
    } catch {
      // The result screen works without refreshed attempt counts.
    }
  }, [loadCatalog]);

  if (phase === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading exam…
        </div>
      </div>
    );
  }

  if (phase === "gate") {
    return (
      <GateCard
        icon={<Lock className="h-6 w-6 text-slate-500" />}
        title="Sign in to take this test"
        body="Mains scores are verified on the server against your account, so a sign-in is required before the timer starts."
      />
    );
  }

  if (phase === "demo_required") {
    return (
      <GateCard
        icon={<Lock className="h-6 w-6 text-amber-500" />}
        title="Finish the demo orientation first"
        body="Every scored test is locked until the 3-question demo is completed. It is not scored and does not use a mains attempt."
        href="/profile"
        action="Go to your dashboard"
      />
    );
  }

  if (phase === "not_found") {
    return (
      <GateCard
        icon={<SearchX className="h-6 w-6 text-slate-500" />}
        title="Exam set not found"
        body="This set may have been renamed or removed. Pick an available set from the Mains Exam tab on your dashboard."
      />
    );
  }

  if (phase === "error" || (phase === "ready" && !meta)) {
    return (
      <GateCard
        icon={<TriangleAlert className="h-6 w-6 text-amber-500" />}
        title="Something went wrong"
        body={error ?? "Could not load this exam set. Try again."}
      />
    );
  }

  if (phase === "running" && payload) {
    return <ExamRunner payload={payload} onFinished={handleFinished} />;
  }

  if (phase === "result" && result) {
    const retakeAllowed = (meta?.attemptsRemaining ?? 0) > 0;
    return (
      <ExamResult
        result={result}
        onRetake={retakeAllowed ? handleStart : undefined}
        retakeDisabled={false}
      />
    );
  }

  if (meta) {
    return (
      <ExamInstructions
        set={meta}
        starting={phase === "starting"}
        error={error}
        hasOpenAttempt={Boolean(meta.openAttemptId)}
        onStart={() => void handleStart()}
      />
    );
  }

  return null;
}

function GateCard({
  icon,
  title,
  body,
  href = "/dashboard",
  action = "Go to dashboard",
}: {
  icon: ReactNode;
  title: string;
  body: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">{icon}</div>
        <h1 className="mt-4 text-lg font-bold text-slate-900">{title}</h1>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{body}</p>
        <Button className="mt-5" render={<Link href={href} />}>
          {action}
        </Button>
      </div>
    </div>
  );
}
