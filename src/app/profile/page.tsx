"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  FileText,
  PlayCircle,
  LogOut,
  Building2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Layers,
  Settings,
  Menu,
  ExternalLink,
  Lock,
  School,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { supabase } from "@/lib/supabaseClient";
import {
  fetchCandidateProfile,
  signOutCandidate,
} from "@/lib/candidateService";
import { CandidateProfileData } from "@/components/mui/MuiProfileModal";
import { MuiDemoAssessmentModal } from "@/components/mui/MuiDemoAssessmentModal";
import { MainsExamPanel, OFFICIAL_MAINS_SET_ID } from "@/components/exam/MainsExamPanel";
import {
  completeDemo,
  fetchDemoStatus,
  fetchHistory,
  type HistoryItem,
} from "@/lib/exams/client";

export default function CandidateProfileDashboardPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"overview" | "mains_exam" | "mock_tests" | "assessments" | "dossier" | "partners" | "settings">("overview");
  const [currentUser, setCurrentUser] = useState<CandidateProfileData | null>(null);
  const [, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [demoStatusLoaded, setDemoStatusLoaded] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load candidate profile from Supabase Auth & public.candidates table
  useEffect(() => {
    let isMounted = true;

    // Server-verified facts: demo gate status + scored attempt history.
    async function loadServerData() {
      try {
        const [demo, historyResponse] = await Promise.all([fetchDemoStatus(), fetchHistory()]);
        if (isMounted) {
          setDemoCompleted(demo.completed);
          setHistory(historyResponse.attempts);
        }
      } catch (err) {
        // Not signed in yet (or the session expired): leave the gate closed.
        console.debug("Server exam data unavailable:", err);
      } finally {
        if (isMounted) setDemoStatusLoaded(true);
      }
    }

    async function loadCandidate() {
      try {
        // Read local storage cache first for instant display
        const cached = typeof window !== "undefined" ? localStorage.getItem("cl_candidate") : null;
        let cachedParsed: CandidateProfileData | null = null;
        if (cached) {
          try {
            cachedParsed = JSON.parse(cached);
            if (isMounted && cachedParsed) {
              setCurrentUser(cachedParsed);
            }
          } catch (e) {
            console.debug("Failed parsing cached candidate:", e);
          }
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await fetchCandidateProfile(session.user.id, undefined, session.user.email);
          if (isMounted) {
            const loadedUser: CandidateProfileData = profile || cachedParsed || {
              email: session.user.email || "",
              id: session.user.id,
              candidateId: `CL-2026-${session.user.id.slice(0, 6).toUpperCase()}`,
              fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0].replace(/[._-]/g, " ") || "Candidate",
              domain: "Diploma (Mechanical / Auto / Tech)",
              city: "India",
            };
            setCurrentUser(loadedUser);
            if (typeof window !== "undefined" && profile) {
              localStorage.setItem("cl_candidate", JSON.stringify(loadedUser));
            }
          }
        } else {
          // No session: only a cached email can identify a profile. Never fall
          // back to "most recent row" — that shows another account's data.
          const targetEmail = cachedParsed?.email || undefined;
          const profile = targetEmail
            ? await fetchCandidateProfile(undefined, undefined, targetEmail)
            : null;

          if (isMounted && profile) {
            setCurrentUser(profile);
            if (typeof window !== "undefined") {
              localStorage.setItem("cl_candidate", JSON.stringify(profile));
            }
          }
        }
      } catch (err) {
        console.error("Dashboard profile loading error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCandidate();
    loadServerData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && isMounted) {
        const p = await fetchCandidateProfile(session.user.id, undefined, session.user.email);
        if (isMounted && p) {
          setCurrentUser(p);
        }
        loadServerData();
      }
      if (!session?.user && isMounted) {
        // Signed out: close the gate and drop cached scores.
        setDemoCompleted(false);
        setHistory([]);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOutCandidate();
    if (typeof window !== "undefined") {
      localStorage.removeItem("cl_candidate");
    }
    startTransition(() => {
      router.push("/");
    });
  };

  const candidateId = currentUser?.candidateId || currentUser?.candidate_id || "CL-2026-ACTIVE";
  const fullName =
    currentUser?.fullName ||
    currentUser?.full_name ||
    (currentUser?.email ? currentUser.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Candidate");
  const email = currentUser?.email || "";
  const phone = currentUser?.phone || "+91 98XXXXXXXX";
  const domain = currentUser?.domain || "Diploma (Mechanical / Auto / Tech)";
  const city = currentUser?.city || "National Mobility Ready";
  const photoUrl =
    typeof currentUser?.photo === "string"
      ? currentUser.photo
      : typeof currentUser?.photo_url === "string"
      ? currentUser.photo_url
      : typeof currentUser?.photoBase64 === "string"
      ? currentUser.photoBase64
      : undefined;
  const resumeUrl = currentUser?.resume_url;
  const resumeName = currentUser?.resumeName || currentUser?.resume_name || `${fullName.replace(/\s+/g, "_")}_Resume.pdf`;

  // The demo gate is a server fact (public.demo_completions), never localStorage.
  const isDemoCompleted = demoCompleted;

  const scoredHistory = history.filter(
    (attempt) => attempt.status !== "in_progress" && attempt.score !== null
  );

  // "Weekly Mock Average" = average percentage across scored practice sets only.
  const practiceScored = scoredHistory.filter((attempt) => attempt.setId !== OFFICIAL_MAINS_SET_ID);
  const weeklyMockAverage =
    practiceScored.length > 0
      ? Math.round(
          practiceScored.reduce((total, attempt) => total + (attempt.percentage ?? 0), 0) /
            practiceScored.length
        )
      : null;
  const totalTests = practiceScored.length;

  // Official mains attempts come from the server attempt table, not the legacy
  // candidate_assessments table.
  const mainsAttemptsUsed = history.filter(
    (attempt) => attempt.setId === OFFICIAL_MAINS_SET_ID && attempt.status !== "in_progress"
  ).length;
  const mainsAttemptsLeft = Math.max(0, 2 - mainsAttemptsUsed);

  const handleStartMainsExam = () => {
    if (!isDemoCompleted) {
      setIsDemoModalOpen(true);
      return;
    }
    // Real, server-verified runner (fullscreen, mark-for-review, server clock).
    router.push(`/exam/${OFFICIAL_MAINS_SET_ID}`);
  };

  const handleCompleteDemo = async () => {
    try {
      await completeDemo();
      setDemoCompleted(true);
      setIsDemoModalOpen(false);
      setActiveTab("mains_exam");
    } catch (error) {
      // Never unlock optimistically: the server is the source of truth.
      console.error("Could not record demo completion:", error);
      if (typeof window !== "undefined") {
        window.alert("Could not save your demo completion. Check your connection and try again.");
      }
    }
  };

  const is1on1User =
    Boolean(currentUser?.partner_route?.includes("8,999")) ||
    Boolean(currentUser?.partner_route?.includes("1-on-1")) ||
    Boolean(currentUser?.selected_plan === "mentorship_1on1") ||
    Boolean(currentUser?.plan_tier === "mentorship_1on1");
  const isProUser =
    !is1on1User &&
    (Boolean(currentUser?.partner_route?.includes("4,999")) ||
      Boolean(currentUser?.partner_route?.includes("Pro")) ||
      Boolean(currentUser?.selected_plan === "pro_all_access") ||
      Boolean(currentUser?.plan_tier === "pro_all_access"));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Career<span className="text-blue-600">Loop</span>
              </span>
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-medium text-slate-500">Candidate Portal</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action: Take/Retake Test */}
            <Button
              size="sm"
              onClick={handleStartMainsExam}
              disabled={!demoStatusLoaded || (isDemoCompleted && mainsAttemptsUsed >= 2)}
              className={`text-xs font-medium h-8 px-3 ${
                !isDemoCompleted
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm"
                  : mainsAttemptsUsed >= 2
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100 border border-slate-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {!demoStatusLoaded ? (
                "Checking access…"
              ) : !isDemoCompleted ? (
                <>
                  <School className="w-3.5 h-3.5 mr-1.5" />
                  Take Demo Set (Required)
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                  {mainsAttemptsUsed >= 2
                    ? "Mains Completed (2/2)"
                    : mainsAttemptsUsed === 1
                    ? "Retake Mains Exam (2/2)"
                    : "Take Mains Exam"}
                </>
              )}
            </Button>

            {/* User Avatar & Menu */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="relative inline-flex items-center justify-center">
                <Avatar className={`w-8 h-8 rounded-full ${
                  is1on1User
                    ? "border-2 border-black ring-2 ring-amber-400 ring-offset-0 shadow-[0_0_10px_rgba(250,204,21,0.7)]"
                    : isProUser
                    ? "ring-2 ring-amber-400 ring-offset-1 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                    : "border border-slate-200"
                }`}>
                  <AvatarImage src={photoUrl || undefined} alt={fullName} />
                  <AvatarFallback className="bg-slate-800 text-white font-medium text-xs">
                    {fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {is1on1User ? (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-black text-amber-400 font-black text-[8px] px-1.5 py-0.2 rounded shadow-md border border-amber-400 leading-none tracking-wider whitespace-nowrap">
                    1o1
                  </span>
                ) : isProUser ? (
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[8px] px-1 py-0.5 rounded shadow-sm border border-white leading-none tracking-tighter">
                    PRO
                  </span>
                ) : null}
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-800 leading-none">{fullName}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{candidateId}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign Out"
                className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="sm:hidden text-slate-700 h-8 w-8" />}>
                <Menu className="w-4 h-4" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="relative inline-flex items-center justify-center">
                      <Avatar className={`w-10 h-10 rounded-full ${
                        is1on1User
                          ? "border-2 border-black ring-2 ring-amber-400 ring-offset-0 shadow-[0_0_10px_rgba(250,204,21,0.7)]"
                          : isProUser
                          ? "ring-2 ring-amber-400 ring-offset-1 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                          : "border border-slate-200"
                      }`}>
                        <AvatarImage src={photoUrl || undefined} />
                        <AvatarFallback className="bg-slate-800 text-white font-medium">
                          {fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {is1on1User ? (
                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-black text-amber-400 font-black text-[8px] px-1.5 py-0.2 rounded shadow-md border border-amber-400 leading-none tracking-wider whitespace-nowrap">
                          1o1
                        </span>
                      ) : isProUser ? (
                        <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[8px] px-1 py-0.5 rounded shadow-sm border border-white leading-none tracking-tighter">
                          PRO
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{fullName}</h4>
                      <p className="text-xs text-slate-400 font-mono">{candidateId}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {[
                      { id: "overview", label: "Dashboard", icon: Layers },
                      {
                        id: "mains_exam",
                        label: "Mains Exam",
                        icon: Award,
                        badge: "Server-verified",
                      },
                      { id: "mock_tests", label: "Mock Test Series", icon: FileText },
                      { id: "dossier", label: "Verified Dossier", icon: FileText },
                      { id: "partners", label: "Recruiter Pipeline", icon: Building2 },
                      { id: "settings", label: "Account Settings", icon: Settings },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = activeTab === item.id || (item.id === "mains_exam" && activeTab === "assessments");
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as typeof activeTab);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-slate-900 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : isDemoCompleted
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full text-slate-600 border-slate-200 hover:bg-slate-50 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Sign Out
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main App Body with Clean Sidebar & Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Clean Sidebar Navigation */}
        <aside className="hidden md:block md:col-span-3">
          <Card className="border-slate-200 shadow-none bg-white">
            <CardHeader className="p-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative inline-flex items-center justify-center">
                  <Avatar className={`w-10 h-10 rounded-lg ${
                    is1on1User
                      ? "border-2 border-black ring-2 ring-amber-400 ring-offset-0 shadow-[0_0_12px_rgba(250,204,21,0.75)]"
                      : isProUser
                      ? "ring-2 ring-amber-400 ring-offset-1 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                      : "border border-slate-200"
                  }`}>
                    <AvatarImage src={photoUrl || undefined} alt={fullName} />
                    <AvatarFallback className="bg-slate-800 text-white font-medium text-sm rounded-lg">
                      {fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {is1on1User ? (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-black text-amber-400 font-black text-[8px] px-1.5 py-0.2 rounded shadow-md border border-amber-400 leading-none tracking-wider whitespace-nowrap">
                      1o1
                    </span>
                  ) : isProUser ? (
                    <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[8px] px-1 py-0.5 rounded shadow-sm border border-white leading-none tracking-tighter">
                      PRO
                    </span>
                  ) : null}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{fullName}</h3>
                    {is1on1User ? (
                      <span className="bg-slate-950 text-amber-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded border border-amber-400/80 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        1-on-1 Mentorship
                      </span>
                    ) : isProUser ? (
                      <span className="bg-amber-100 text-amber-800 font-bold text-[9px] px-1.5 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                        Pro Member
                      </span>
                    ) : null}
                  </div>
                  <p className="font-mono text-[11px] text-slate-500">{candidateId}</p>
                </div>
              </div>
            </CardHeader>

            <Separator className="bg-slate-100" />

            <CardContent className="p-2 space-y-0.5">
              {[
                { id: "overview", label: "Overview", icon: Layers },
                {
                  id: "mains_exam",
                  label: "Mains Exam",
                  icon: Award,
                  badge: "Server-verified",
                },
                { id: "mock_tests", label: "Weekly Mocks & Scores", icon: FileText, badge: "Weekly" },
                { id: "dossier", label: "Resume & Dossier Audit", icon: FileText, badge: "Verified" },
                { id: "mentorship", label: "Mentorship Sessions", icon: Shield, badge: "Live" },
                { id: "partners", label: "HR & Agency Referrals", icon: Building2, badge: "Active" },
                { id: "settings", label: "Account Settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id || (item.id === "mains_exam" && activeTab === "assessments");
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </CardContent>

            <Separator className="bg-slate-100" />

            <div className="p-3 bg-slate-50 rounded-b-lg">
              <div className="flex items-center justify-between text-xs mb-1.5 text-slate-600">
                <span className="font-medium">Proctored Assessment Attempts</span>
                <span className="font-mono text-slate-800">{mainsAttemptsUsed} / 2</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${(mainsAttemptsUsed / 2) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                {!isDemoCompleted
                  ? "🔒 Complete Demo Set first to unlock your 2 proctored Mains attempts."
                  : "Highest score automatically populates your verified dossier."}
              </p>
            </div>
          </Card>
        </aside>

        {/* Dynamic Main Workspace Content */}
        <main className="md:col-span-9 space-y-5">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Header Profile Summary */}
              <Card className="border-slate-200 shadow-none bg-white">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-medium">{candidateId}</span>
                        <span>•</span>
                        <span>{city}</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                        Welcome back, {fullName}
                      </h1>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {domain}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        onClick={handleStartMainsExam}
                        disabled={!demoStatusLoaded || (isDemoCompleted && mainsAttemptsUsed >= 2)}
                        className={`font-medium text-xs h-9 px-4 ${
                          !isDemoCompleted
                            ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {!demoStatusLoaded ? (
                          "Checking access…"
                        ) : !isDemoCompleted ? (
                          <>
                            <School className="w-3.5 h-3.5 mr-1.5" />
                            Take Demo Set (Unlock Mains)
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                            {mainsAttemptsUsed >= 2
                              ? "2/2 Attempts Used"
                              : mainsAttemptsUsed === 1
                              ? "Retake Mains Exam"
                              : "Take Mains Exam"}
                          </>
                        )}
                      </Button>
                      <span className="text-[11px] text-slate-400">
                        {!demoStatusLoaded
                          ? "Checking your access…"
                          : !isDemoCompleted
                          ? "Required before Mains Exam"
                          : `${mainsAttemptsLeft} attempts remaining`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Locked Demo Prerequisite Notice if demo not yet completed */}
              {!isDemoCompleted && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Mains Examination Locked — Demo Set Required
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        To preserve your official attempts, all candidates must complete the 3-minute interactive Demo Walkthrough to calibrate AI proctoring and exam navigation before taking the scored Mains Exam.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsDemoModalOpen(true)}
                    className="bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs h-8 px-4 shrink-0 shadow-sm"
                  >
                    Start Demo Set
                  </Button>
                </div>
              )}

              {/* 3 Real Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-none bg-white">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-slate-500">Weekly Mock Average</p>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                      {weeklyMockAverage !== null ? `${weeklyMockAverage}%` : "—"}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {totalTests > 0
                        ? `Average of ${totalTests} scored practice ${totalTests === 1 ? "mock" : "mocks"}`
                        : "No scored practice mocks yet"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-none bg-white">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-slate-500">Resume Status</p>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">
                      Processing
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pending Verification 
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-none bg-white">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-slate-500">Referral Pipeline</p>
                    <div className="text-2xl font-bold text-blue-600 mt-1">
                      Active Pool
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Active in Fast-Hiring Agency Pool
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Team Note Banner */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-800 font-medium">
                  <strong>Team Note:</strong> Our placement team is actively reviewing your latest mock marks for upcoming corporate batch referrals.
                </p>
              </div>

              {/* Recent Test History Card */}
              <Card className="border-slate-200 shadow-none bg-white">
                <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b border-slate-100">
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                      Assessment History
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Record of completed technical assessments
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("mains_exam")}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 h-8"
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {history.length === 0 ? (
                    <div className="text-center py-10 px-4">
                      <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-medium text-xs text-slate-700">No Assessment Records Yet</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5 mb-3">
                        {!isDemoCompleted
                          ? "Take the interactive Demo Set to unlock your official Mains Exam."
                          : "Take a scored test to record your first server-verified score."}
                      </p>
                      <Button
                        size="sm"
                        onClick={handleStartMainsExam}
                        className={`font-medium text-xs h-8 ${
                          !isDemoCompleted
                            ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {!isDemoCompleted ? (
                          <>
                            <School className="w-3.5 h-3.5 mr-1" />
                            Start Demo Set
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5 mr-1" />
                            Start Mains Exam
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-100 bg-slate-50/50">
                            <TableHead className="text-xs font-medium text-slate-600 h-9">Date</TableHead>
                            <TableHead className="text-xs font-medium text-slate-600 h-9">Assessment</TableHead>
                            <TableHead className="text-xs font-medium text-slate-600 h-9 text-center">Score</TableHead>
                            <TableHead className="text-xs font-medium text-slate-600 h-9">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {history.slice(0, 3).map((item) => (
                            <TableRow key={item.attemptId} className="border-slate-100">
                              <TableCell className="text-xs text-slate-500 font-mono py-2.5">
                                {new Date(item.submittedAt ?? item.startedAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </TableCell>
                              <TableCell className="text-xs text-slate-800 py-2.5">
                                {item.setTitle}
                              </TableCell>
                              <TableCell className="text-xs text-center py-2.5">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold tabular-nums ${
                                  item.passed === true
                                    ? "bg-emerald-50 text-emerald-700"
                                    : item.passed === false
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-50 text-slate-500"
                                }`}>
                                  {item.score === null ? "—" : `${item.score} / ${item.maxMarks}`}
                                </span>
                              </TableCell>
                              <TableCell className="text-xs text-slate-600 py-2.5">
                                {item.status === "in_progress"
                                  ? "In progress"
                                  : item.status === "expired"
                                  ? "Time expired"
                                  : item.passed === true
                                  ? "Passed"
                                  : "Needs practice"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB: WEEKLY MOCKS — real practice sets + their verified scores */}
          {activeTab === "mock_tests" && (
            <MainsExamPanel scope="practice" onStartDemo={() => setIsDemoModalOpen(true)} />
          )}

          {/* TAB 2: MAINS EXAM — REAL SERVER-VERIFIED RUNNER */}
          {(activeTab === "mains_exam" || activeTab === "assessments") && (
            <MainsExamPanel scope="mains" onStartDemo={() => setIsDemoModalOpen(true)} />
          )}

          {/* TAB 3: CANDIDATE DOSSIER */}
          {activeTab === "dossier" && (
            <div className="space-y-5">
              <Card className="border-slate-200 shadow-none bg-white">
                <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                  <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                    Candidate Profile &amp; Documents
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Verified registration details, identity photo, and resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 space-y-5">
                  {/* Personal details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-0.5">
                      <span className="text-[11px] font-medium text-slate-500">Full Name</span>
                      <p className="font-semibold text-sm text-slate-900">{fullName}</p>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-0.5">
                      <span className="text-[11px] font-medium text-slate-500">Candidate ID</span>
                      <p className="font-mono font-semibold text-sm text-slate-900">{candidateId}</p>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-0.5">
                      <span className="text-[11px] font-medium text-slate-500">Email Address</span>
                      <div className="flex items-center gap-1.5 text-sm text-slate-900">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{email}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-0.5">
                      <span className="text-[11px] font-medium text-slate-500">Mobile Phone</span>
                      <div className="flex items-center gap-1.5 text-sm text-slate-900">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{phone}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-0.5">
                      <span className="text-[11px] font-medium text-slate-500">Qualification &amp; Domain</span>
                      <div className="flex items-center gap-1.5 text-sm text-slate-900">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span>{domain}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-0.5">
                      <span className="text-[11px] font-medium text-slate-500">Location</span>
                      <div className="flex items-center gap-1.5 text-sm text-slate-900">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Photo ID and Resume Document Viewers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center gap-3.5">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Candidate Photo"
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Live Photo ID</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Face verified during candidate registration.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">{resumeName}</p>
                          <span className="text-[11px] text-slate-400">Attached Document</span>
                        </div>
                      </div>

                      {resumeUrl && (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 4: RECRUITER PLACEMENT ROUTE */}
          {activeTab === "partners" && (
            <div className="space-y-5">
              <Card className="border-slate-200 shadow-none bg-white">
                <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                      Recruiter Dispatch Pipeline
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Partner Recruiter Dispatch Pipeline automatically routes your best-score certified dossier to 450+ partner agencies
                    </CardDescription>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-300">
                    Active
                  </span>
                </CardHeader>

                <CardContent className="p-6 sm:p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Your verified best-score dossier is active in our agency pool
                  </h3>
                  <p className="text-slate-500 text-xs max-w-md mt-1.5 leading-relaxed">
                    Partner Recruiter Dispatch Pipeline automatically routes your best-score certified dossier to 450+ partner agencies for interview scheduling.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("mains_exam")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-8 px-4"
                    >
                      View Best Score Dossier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 5: SETTINGS & SECURITY */}
          {activeTab === "settings" && (
            <div className="space-y-5">
              <Card className="border-slate-200 shadow-none bg-white">
                <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                  <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                    Account &amp; Session
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Manage session credentials and access settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-xs text-slate-800">Registered Account</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{email}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-xs text-slate-700 border-slate-200 hover:bg-slate-100 h-8"
                    >
                      <LogOut className="w-3 h-3 mr-1.5" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Mandatory Demo Orientation Walkthrough */}
      <MuiDemoAssessmentModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onComplete={handleCompleteDemo}
        candidateName={fullName}
      />
    </div>
  );
}
