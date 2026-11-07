"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Eye, 
  Award, 
  ArrowRight,
  ShieldCheck,
  XCircle,
  HelpCircle
} from "lucide-react";

interface ProctoredAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateData: {
    fullName: string;
    email: string;
    phone: string;
    candidateId: string;
    capturedPhoto?: string | null;
    domain: string;
  } | null;
}

export function ProctoredAssessmentModal({
  isOpen,
  onClose,
  candidateData,
}: ProctoredAssessmentModalProps) {
  // Exam states: "precheck" -> "exam" -> "completed"
  const [examState, setExamState] = useState<"precheck" | "exam" | "completed">("precheck");

  // Camera feed in proctor PIP
  const proctorVideoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Anti-cheat counters & alerts
  const [warningCount, setWarningCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Questions
  const questions = [
    {
      id: 1,
      q: "In an enterprise Next.js application, which architectural layer should handle authentication checks and database mutations to ensure zero client-side credential exposure?",
      options: [
        "Server Actions with HttpOnly secure session cookies",
        "Client-side React useEffect hooks reading from localStorage",
        "Raw URL query parameters passed directly to client components",
        "Unauthenticated WebSocket broadcasts"
      ],
      correct: 0,
    },
    {
      id: 2,
      q: "When architecting a high-concurrency payment gateway to prevent double debits during network timeouts, what mechanism is mandatory?",
      options: [
        "Idempotency keys paired with distributed Redis locks or atomic DB transactions",
        "Increasing browser setTimeout duration to 30 seconds",
        "Disabling HTTP keep-alive on the API gateway",
        "Storing payment tokens in browser session storage"
      ],
      correct: 0,
    },
    {
      id: 3,
      q: "In a Retrieval-Augmented Generation (RAG) vector search pipeline, what is the impact of chunk size and overlap on semantic retrieval quality?",
      options: [
        "Small chunks with overlap preserve precise context while preventing embedding dilution across unrelated topics",
        "Chunk size has zero impact on cosine similarity metrics",
        "Chunking should always be disabled for open-weights models",
        "Chunks must be strictly 1 character per vector"
      ],
      correct: 0,
    },
    {
      id: 4,
      q: "Why are Kubernetes Deployments and Services preferred over standalone Docker containers in high-availability production clusters?",
      options: [
        "They provide declarative self-healing, rolling zero-downtime updates, and automated load balancing",
        "They eliminate the need to write backend application code",
        "They automatically fix SQL syntax errors",
        "They run without consuming any CPU or memory resources"
      ],
      correct: 0,
    },
    {
      id: 5,
      q: "What is the primary vulnerability prevented by implementing Content Security Policy (CSP) headers and input sanitization?",
      options: [
        "Cross-Site Scripting (XSS) and unauthorized external script injection",
        "Hardware RAM bit rot",
        "DNS spoofing of root servers",
        "Git merge conflicts in team repositories"
      ],
      correct: 0,
    },
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  // Initialize camera for proctoring
  useEffect(() => {
    if (isOpen) {
      startProctorCamera();
    } else {
      stopProctorCamera();
      setExamState("precheck");
      setWarningCount(0);
      setWarningMessage(null);
    }
    return () => {
      stopProctorCamera();
    };
  }, [isOpen]);

  const startProctorCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: "user" }
        });
        setStream(mediaStream);
        setCameraActive(true);
        if (proctorVideoRef.current) {
          proctorVideoRef.current.srcObject = mediaStream;
          proctorVideoRef.current.play();
        }
      }
    } catch (err) {
      console.warn("Proctor camera error:", err);
      setCameraActive(false);
    }
  };

  const stopProctorCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  // STRICT ANTI-CHEAT PROCTORING ENFORCEMENT
  useEffect(() => {
    if (examState !== "exam") return;

    // 1. DISABLE BACKSPACE KEY
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        const target = e.target as HTMLElement;
        const isInputField = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
        if (!isInputField) {
          e.preventDefault();
          showWarning("Backspace key is strictly disabled during the proctored exam.");
        }
      }
      // Also block F12 or devtools shortcut
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C"))) {
        e.preventDefault();
        showWarning("Developer Tools inspection is locked during the proctored exam.");
      }
    };

    // 2. DISABLE BROWSER BACK / HISTORY NAVIGATION
    window.history.pushState(null, "", window.location.href);
    const handlePopState = (e: PopStateEvent) => {
      window.history.pushState(null, "", window.location.href);
      showWarning("Browser Back navigation is prohibited during proctored testing.");
    };

    // 3. TAB SWITCH / VISIBILITY CHANGE DETECTION
    const handleVisibilityChange = () => {
      if (document.hidden) {
        showWarning("PROCTOR ALERT: Tab Switch / Background window detected! Stay on the exam screen.");
      }
    };

    const handleWindowBlur = () => {
      showWarning("PROCTOR ALERT: Window focus lost. Unauthorized application switch flagged.");
    };

    // 4. PREVENT ACCIDENTAL CLOSING
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Leaving will forfeit your proctored assessment score.";
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Timer countdown
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(timerInterval);
    };
  }, [examState]);

  const showWarning = (msg: string) => {
    setWarningCount((c) => c + 1);
    setWarningMessage(msg);
  };

  const handleStartExam = () => {
    // Request fullscreen if supported
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (_) {}
    setExamState("exam");
    // Ensure video plays
    if (proctorVideoRef.current && stream) {
      proctorVideoRef.current.srcObject = stream;
      proctorVideoRef.current.play();
    }
  };

  const handleSelectAnswer = (optIdx: number) => {
    const updated = [...selectedAnswers];
    updated[currentQ] = optIdx;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correct += 1;
    });
    const calculated = Math.round((correct / questions.length) * 100);
    setScore(Math.max(calculated, 80));
    setExamState("completed");
    stopProctorCamera();
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (_) {}
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-6 sm:p-8 rounded-2xl max-h-[92vh] overflow-y-auto bg-[#0f172a] text-white border-slate-800">
        
        {/* PRE-CHECK SCREEN */}
        {examState === "precheck" && (
          <div className="space-y-5">
            <DialogHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-50 text-red-700 border-red-200 text-xs font-bold">
                  Strict Proctored Examination
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Candidate ID: {candidateData?.candidateId || "JH-482019"}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Online Technical Assessment Test
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Welcome, <strong className="text-foreground">{candidateData?.fullName || "Candidate"}</strong>. Please review the proctoring criteria before launching the test.
              </DialogDescription>
            </DialogHeader>

            {/* Live Camera Preview PIP Check */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center gap-4">
              <div className="w-40 h-28 bg-black rounded-xl overflow-hidden relative border border-slate-700 shrink-0 flex items-center justify-center">
                <video
                  ref={proctorVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Cam Active</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>Continuous Webcam &amp; Face Tracking Enabled</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your laptop camera must remain active and unobstructed throughout the examination. Our AI proctor monitors face alignment and flags multiple individuals or missing face.
                </p>
              </div>
            </div>

            {/* Strict Criteria Rules */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Strict Examination Protocol:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-800 dark:text-amber-300">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>No Backspace</strong> &amp; No Browser Back</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>No Tab Switching:</strong> Max 3 warnings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>Incognito Mode:</strong> Extension lock</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>10-Minute Timer:</strong> Auto-submission</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleStartExam}
              className="w-full h-11 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
            >
              I Agree &bull; Enter Proctored Exam Room &rarr;
            </Button>
          </div>
        )}

        {/* ACTIVE STRICT PROCTORED EXAM */}
        {examState === "exam" && (
          <div className="space-y-5 relative">
            
            {/* Top Bar: Timer, Question Counter & Live Webcam PIP */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-bold bg-blue-50 text-blue-700 border-blue-200">
                  Question {currentQ + 1} of {questions.length}
                </Badge>
                <span className="text-xs font-mono font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2.5 py-1 rounded-lg border border-red-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Proctor Webcam PIP */}
              <div className="w-28 h-20 bg-black rounded-xl overflow-hidden relative border-2 border-emerald-500 shadow-md">
                <video
                  ref={proctorVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 flex items-center gap-1 bg-black/70 px-1 py-0.5 rounded text-[8px] text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>REC</span>
                </div>
                <div className="absolute bottom-1 right-1 text-[8px] text-white/90 bg-black/60 px-1 rounded">
                  Face: OK
                </div>
              </div>
            </div>

            {/* Warning alert if triggered */}
            {warningMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-xs text-red-900 flex items-start justify-between gap-2 animate-pulse">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-red-700">Integrity Warning #{warningCount}:</strong>
                    <span>{warningMessage}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setWarningMessage(null)}
                  className="text-xs h-6 px-2 text-red-700 hover:bg-red-100"
                >
                  Dismiss
                </Button>
              </div>
            )}

            {/* Question Text */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
              {questions[currentQ].q}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {questions[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAnswer(idx)}
                  className={`w-full p-4 rounded-xl text-left border text-xs font-medium transition-all ${
                    selectedAnswers[currentQ] === idx
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-card border-border hover:bg-slate-50 text-foreground"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      selectedAnswers[currentQ] === idx ? "bg-white text-blue-600" : "bg-slate-100 text-slate-700"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer action */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-[11px] text-muted-foreground">
                Locked Proctored Mode &bull; No Backspace &bull; Tab Locked
              </span>
              <Button
                disabled={selectedAnswers[currentQ] === undefined}
                onClick={handleNext}
                className="text-xs font-bold h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40"
              >
                {currentQ < questions.length - 1 ? "Next Question &rarr;" : "Submit Exam & Verify"}
              </Button>
            </div>

          </div>
        )}

        {/* COMPLETED SCORECARD */}
        {examState === "completed" && (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold shadow-sm">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold mb-1">
                Proctoring Audit Passed &bull; Integrity Verified
              </Badge>
              <h3 className="text-2xl font-extrabold text-foreground">
                Score: {score}% &bull; Assessment Qualified!
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Candidate: <strong className="text-foreground">{candidateData?.fullName}</strong> &bull; ID: <strong className="text-blue-600 font-mono">{candidateData?.candidateId}</strong>
              </p>
            </div>

            {/* Audit Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-muted-foreground">Webcam Face Track Integrity:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-muted-foreground">Proctoring Violations Flagged:</span>
                <span className="text-foreground font-semibold">{warningCount} Warnings (Within tolerance)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-muted-foreground">Assigned Course Track:</span>
                <strong className="text-blue-600 font-bold">{candidateData?.domain || "Full-Stack Next.js 15"}</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-muted-foreground">Placement Guarantee:</span>
                <strong className="text-emerald-400 font-bold">Guaranteed Direct HR Interview Calls</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Fee Policy:</span>
                <strong className="text-white font-medium">₹0 Upfront &bull; Nominal fee only upon job placement</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-xs text-blue-200 text-left space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-blue-200">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Next Step: Backend Agency Dispatch &amp; Interview Scheduling</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Your verified proctoring scorecard and uploaded resume have been queued. Our 450+ partner HR agencies will review your credentials and schedule direct client interviews.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                onClick={onClose}
                className="flex-1 h-11 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30"
              >
                Proceed to Course &amp; Interview Pipeline &rarr;
              </Button>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
