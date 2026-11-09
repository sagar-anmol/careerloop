"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  FileText,
  PlayCircle,
  Clock,
  CheckCircle2,
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  fetchCandidateAssessmentHistory,
  signOutCandidate,
  TestAttempt,
} from "@/lib/candidateService";
import { CandidateProfileData } from "@/components/mui/MuiProfileModal";
import { MuiProctoredAssessmentModal } from "@/components/mui/MuiProctoredAssessmentModal";

export default function CandidateProfileDashboardPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"overview" | "assessments" | "dossier" | "partners" | "settings">("overview");
  const [currentUser, setCurrentUser] = useState<CandidateProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<TestAttempt[]>([]);
  const [averageScore, setAverageScore] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const [passRate, setPassRate] = useState(0);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load candidate profile from Supabase Auth & public.candidates table
  useEffect(() => {
    let isMounted = true;

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
              const cid = cachedParsed.candidateId || cachedParsed.candidate_id;
              if (cid) loadHistory(cid);
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
            const cid = loadedUser.candidateId || loadedUser.candidate_id;
            if (cid) {
              loadHistory(cid);
            }
          }
        } else {
          // If no active auth session, look up by cached candidate email, or most recent candidate record
          const targetEmail = cachedParsed?.email || undefined;
          let profile = null;
          if (targetEmail) {
            profile = await fetchCandidateProfile(undefined, undefined, targetEmail);
          }
          if (!profile) {
            const { data: recentCandidate } = await supabase
              .from("candidates")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();
            profile = recentCandidate;
          }

          if (isMounted && profile) {
            setCurrentUser(profile);
            if (typeof window !== "undefined") {
              localStorage.setItem("cl_candidate", JSON.stringify(profile));
            }
            const cid = profile.candidate_id || profile.candidateId;
            if (cid) loadHistory(cid);
          }
        }
      } catch (err) {
        console.error("Dashboard profile loading error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function loadHistory(cid: string) {
      const res = await fetchCandidateAssessmentHistory(cid);
      if (isMounted) {
        setHistory(res.history);
        setAverageScore(res.averageScore);
        setTotalTests(res.totalTests);
        setPassRate(res.passRate);
      }
    }

    loadCandidate();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user && isMounted) {
        const p = await fetchCandidateProfile(session.user.id, undefined, session.user.email);
        if (isMounted && p) {
          setCurrentUser(p);
          const cid = p.candidate_id || p.candidateId;
          if (cid) loadHistory(cid);
        }
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
  const attemptsLeft = Math.max(0, 2 - totalTests);

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
              onClick={() => setIsAssessmentOpen(true)}
              disabled={totalTests >= 2}
              className={`text-xs font-medium h-8 px-3 ${
                totalTests >= 2
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100 border border-slate-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
              {totalTests >= 2 ? "Test Completed (2/2)" : totalTests === 1 ? "Retake Test (2/2)" : "Take Assessment"}
            </Button>

            {/* User Avatar & Menu */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <Avatar className="w-8 h-8 rounded-full border border-slate-200">
                <AvatarImage src={photoUrl || undefined} alt={fullName} />
                <AvatarFallback className="bg-slate-800 text-white font-medium text-xs">
                  {fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
                    <Avatar className="w-10 h-10 border border-slate-200">
                      <AvatarImage src={photoUrl || undefined} />
                      <AvatarFallback className="bg-slate-800 text-white font-medium">
                        {fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{fullName}</h4>
                      <p className="text-xs text-slate-400 font-mono">{candidateId}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {[
                      { id: "overview", label: "Dashboard", icon: Layers },
                      { id: "assessments", label: "Assessment History", icon: Shield },
                      { id: "dossier", label: "Profile & Documents", icon: FileText },
                      { id: "partners", label: "Recruiter Pipeline", icon: Building2 },
                      { id: "settings", label: "Account Settings", icon: Settings },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as typeof activeTab);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                            activeTab === item.id
                              ? "bg-slate-900 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
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
                <Avatar className="w-10 h-10 rounded-lg border border-slate-200">
                  <AvatarImage src={photoUrl || undefined} alt={fullName} />
                  <AvatarFallback className="bg-slate-800 text-white font-medium text-sm rounded-lg">
                    {fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">{fullName}</h3>
                  <p className="font-mono text-[11px] text-slate-500">{candidateId}</p>
                </div>
              </div>
            </CardHeader>

            <Separator className="bg-slate-100" />

            <CardContent className="p-2 space-y-0.5">
              {[
                { id: "overview", label: "Dashboard", icon: Layers },
                { id: "assessments", label: "Assessment History", icon: Shield, badge: `${totalTests}/2` },
                { id: "dossier", label: "Profile & Documents", icon: FileText },
                { id: "partners", label: "Recruiter Pipeline", icon: Building2, badge: "Locked" },
                { id: "settings", label: "Account Settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
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
                <span className="font-medium">Assessment Attempts</span>
                <span className="font-mono text-slate-800">{totalTests} / 2</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${(totalTests / 2) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                {attemptsLeft > 0 ? `${attemptsLeft} attempt remaining` : "All attempts completed"}
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
                        onClick={() => setIsAssessmentOpen(true)}
                        disabled={totalTests >= 2}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-9 px-4"
                      >
                        <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                        {totalTests >= 2 ? "2/2 Attempts Used" : totalTests === 1 ? "Retake Assessment" : "Take Assessment"}
                      </Button>
                      <span className="text-[11px] text-slate-400">
                        {attemptsLeft} attempts remaining
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3 Real Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-none bg-white">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-slate-500">Latest Score</p>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                      {totalTests > 0 ? `${averageScore}%` : "—"}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {totalTests > 0 ? (averageScore >= 60 ? "Qualified (Passing >= 60%)" : "Under Review") : "Test not attempted"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-none bg-white">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-slate-500">Attempts Completed</p>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                      {totalTests} / 2
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {attemptsLeft === 0 ? "Quota Exhausted" : `${attemptsLeft} attempt available`}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-none bg-white">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-slate-500">Evaluation Status</p>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                      {totalTests > 0 ? (averageScore >= 60 ? "Eligible" : "Pending") : "Pending"}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {totalTests > 0 ? "Score recorded" : "Complete test to qualify"}
                    </p>
                  </CardContent>
                </Card>
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
                    onClick={() => setActiveTab("assessments")}
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
                        Take the 5-question evaluation to record your score.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setIsAssessmentOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-8"
                      >
                        <PlayCircle className="w-3.5 h-3.5 mr-1" />
                        Start Test
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
                          {history.slice(0, 3).map((item, idx) => (
                            <TableRow key={item.id || idx} className="border-slate-100">
                              <TableCell className="text-xs text-slate-500 font-mono py-2.5">
                                {new Date(item.completed_at).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </TableCell>
                              <TableCell className="text-xs text-slate-800 py-2.5">
                                {item.test_title}
                              </TableCell>
                              <TableCell className="text-xs text-center py-2.5">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                  item.score >= 60 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                }`}>
                                  {item.score} / {item.total_score || 100}
                                </span>
                              </TableCell>
                              <TableCell className="text-xs text-slate-600 py-2.5">
                                {item.score >= 60 ? "Passed" : "Needs Review"}
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

          {/* TAB 2: ASSESSMENTS & LOGS */}
          {activeTab === "assessments" && (
            <div className="space-y-5">
              <Card className="border-slate-200 shadow-none bg-white">
                <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                        Assessment Records
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        History of proctored evaluations and recorded results
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium">
                        Attempts: {totalTests} / 2
                      </span>
                      <Button
                        size="sm"
                        onClick={() => setIsAssessmentOpen(true)}
                        disabled={totalTests >= 2}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-8"
                      >
                        <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                        {totalTests >= 2 ? "Completed" : totalTests === 1 ? "Retake Test" : "Take Assessment"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-4">
                  {totalTests >= 2 && (
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
                      <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-xs text-slate-800">Attempt Limit Reached</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Both permitted attempts have been completed. Your highest verified score ({averageScore}%) is recorded.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-100 bg-slate-50/50">
                          <TableHead className="text-xs font-medium text-slate-600">Timestamp</TableHead>
                          <TableHead className="text-xs font-medium text-slate-600">Evaluation</TableHead>
                          <TableHead className="text-xs font-medium text-slate-600 text-center">Score</TableHead>
                          <TableHead className="text-xs font-medium text-slate-600">Status</TableHead>
                          <TableHead className="text-xs font-medium text-slate-600">Integrity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-xs text-slate-400">
                              No assessment records logged. Click "Take Assessment" to begin.
                            </TableCell>
                          </TableRow>
                        ) : (
                          history.map((test, index) => (
                            <TableRow key={test.id || index} className="border-slate-100 hover:bg-slate-50/50">
                              <TableCell className="text-xs font-mono text-slate-500 py-3">
                                {new Date(test.completed_at).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </TableCell>
                              <TableCell className="text-xs font-medium text-slate-800 py-3">
                                {test.test_title}
                              </TableCell>
                              <TableCell className="text-center py-3">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${
                                    test.score >= 60 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  {test.score} / {test.total_score || 100}
                                </span>
                              </TableCell>
                              <TableCell className="text-xs font-medium py-3 text-slate-700">
                                {test.score >= 60 ? "Passed" : "Under Review"}
                              </TableCell>
                              <TableCell className="py-3">
                                <span className="text-xs text-slate-500 font-mono">
                                  {test.integrity_flags || 0} flags
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
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

          {/* TAB 4: RECRUITER PLACEMENT ROUTE (LOCKED) */}
          {activeTab === "partners" && (
            <div className="space-y-5">
              <Card className="border-slate-200 shadow-none bg-white">
                <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                      Recruiter Dispatch Pipeline
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Direct placement network for verified candidates
                    </CardDescription>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-medium border border-rose-200">
                    Locked
                  </span>
                </CardHeader>

                <CardContent className="p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                  {/* Red Keypad Lock Icon Graphic */}
                  <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center text-rose-600 shadow-xs">
                      <Lock className="w-7 h-7 mb-1" />
                      {/* Keypad dots */}
                      <div className="grid grid-cols-3 gap-1">
                        <div className="w-1 h-1 rounded-full bg-rose-400" />
                        <div className="w-1 h-1 rounded-full bg-rose-400" />
                        <div className="w-1 h-1 rounded-full bg-rose-400" />
                      </div>
                    </div>
                  </div>

                  {/* High Visibility Prompt Text */}
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight max-w-md">
                    Attempt the test, give your best
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-md mt-1.5 leading-relaxed">
                    Partner Recruiter Dispatch Pipeline unlocks automatically once you complete your proctored assessment.
                  </p>

                  {/* Action Button to launch test */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      size="sm"
                      onClick={() => setIsAssessmentOpen(true)}
                      disabled={totalTests >= 2}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-9 px-5"
                    >
                      <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                      {totalTests >= 2 ? "Attempts Completed (2/2)" : totalTests === 1 ? "Retake Assessment Now" : "Start Assessment Now"}
                    </Button>
                    <span className="text-xs text-slate-400 font-mono">
                      {attemptsLeft} attempts remaining
                    </span>
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

      {/* Embedded Proctored Assessment Room */}
      <MuiProctoredAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        candidateData={currentUser}
        onViewProfile={() => setIsAssessmentOpen(false)}
      />
    </div>
  );
}
