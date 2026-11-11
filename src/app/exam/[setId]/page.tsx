"use client";

import { Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { ExamShell } from "@/components/exam/ExamShell";

function ExamPageInner({ setId }: { setId: string }) {
  const searchParams = useSearchParams();
  return <ExamShell setId={setId} initialAttemptId={searchParams.get("attempt")} />;
}

export default function ExamPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = use(params);
  return (
    <Suspense fallback={null}>
      <ExamPageInner setId={setId} />
    </Suspense>
  );
}
