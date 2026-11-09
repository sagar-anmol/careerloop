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
  AlertTriangle,
  LogOut,
  Building2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Settings,
  HelpCircle,
  Menu,
  ExternalLink,
  RefreshCw,
  Sparkles,
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
    <div className="min-h-screen bg-[#f4f7fe] text-slate-900 flex flex-col font-sans">
      {/* Top Corporate Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-blue-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003c5e] to-[#405FE2] flex items-center justify-center text-white shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Career<span className="text-[#405FE2]">Loop</span>
              </span>
            </Link>
            <Badge variant="outline" className="hidden sm:inline-flex bg-blue-50/50 text-[#003c5e] border-blue-200 font-semibold text-xs ml-2">
              Verified Candidate Portal
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action: Take/Retake Test */}
            <Button
              size="sm"
              onClick={() => setIsAssessmentOpen(true)}
              disabled={totalTests >= 2}
              className={`font-semibold shadow-sm text-xs sm:text-sm ${
                totalTests >= 2
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed hover:bg-slate-200"
                  : "bg-[#405FE2] hover:bg-[#2e47b3] text-white"
              }`}
            >
              <PlayCircle className="w-4 h-4 mr-1.5" />
              {totalTests >= 2 ? "Test Completed (2/2)" : totalTests === 1 ? "Retake Test (Final)" : "Take Assessment"}
            </Button>

            {/* User Avatar & Menu */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <Avatar className="w-8 h-8 ring-2 ring-[#405FE2]/20">
                <AvatarImage src={photoUrl || undefined} alt={fullName} />
                <AvatarFallback className="bg-[#405FE2] text-white font-bold text-xs">
                  {fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left text-xs leading-tight">
                <p className="font-bold text-slate-800">{fullName}</p>
                <p className="text-slate-400 font-mono">{candidateId}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign Out"
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 ml-1"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="sm:hidden text-slate-700" />}>
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="w-10 h-10 ring-2 ring-[#405FE2]">
                      <AvatarImage src={photoUrl || undefined} />
                      <AvatarFallback className="bg-[#405FE2] text-white font-bold">
                        {fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{fullName}</h4>
                      <p className="text-xs text-slate-400 font-mono">{candidateId}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {[
                      { id: "overview", label: "Executive Dashboard", icon: Layers },
                      { id: "assessments", label: "Assessment & Integrity", icon: Shield },
                      { id: "dossier", label: "Candidate Dossier", icon: FileText },
                      { id: "partners", label: "Recruiter Placement Route", icon: Building2 },
                      { id: "settings", label: "Account & Privacy", icon: Settings },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as typeof activeTab);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            activeTab === item.id
                              ? "bg-[#405FE2] text-white"
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
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 mt-6"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main App Body with Sidebar & Content Tabs */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar Sub-Navigation */}
        <aside className="hidden md:block md:col-span-3">
          <Card className="border-blue-100/70 shadow-sm sticky top-24 bg-white/95">
            <CardHeader className="p-4 pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 rounded-xl ring-2 ring-[#405FE2]/20">
                  <AvatarImage src={photoUrl || undefined} alt={fullName} />
                  <AvatarFallback className="bg-gradient-to-tr from-[#003c5e] to-[#405FE2] text-white font-bold text-lg rounded-xl">
                    {fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{fullName}</h3>
                  <Badge variant="secondary" className="font-mono text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0">
                    {candidateId}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <Separator className="bg-slate-100" />

            <CardContent className="p-2 space-y-1">
              {[
                { id: "overview", label: "Executive Dashboard", icon: Layers, badge: totalTests > 0 ? "Active" : "Ready" },
                { id: "assessments", label: "Assessment & Scoring", icon: Shield, badge: `${totalTests}/2` },
                { id: "dossier", label: "Candidate Dossier", icon: FileText, badge: "Verified" },
                { id: "partners", label: "Agency Dispatch", icon: Building2, badge: "Locked" },
                { id: "settings", label: "Settings & Security", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-[#405FE2] text-white shadow-sm shadow-blue-500/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
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

            <div className="p-3 bg-blue-50/60 rounded-b-xl border-t border-blue-100/60">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-[#003c5e]">Evaluation Quota</span>
                <span className="font-mono font-bold text-[#405FE2]">{attemptsLeft} left</span>
              </div>
              <Progress value={(totalTests / 2) * 100} className="h-1.5 bg-blue-200/50" />
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Max 2 proctored attempts to ensure strict employer integrity standards.
              </p>
            </div>
          </Card>
        </aside>

        {/* Dynamic Main Workspace Content */}
        <main className="md:col-span-9 space-y-6">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Hero Banner Card */}
              <Card className="border-blue-100 bg-gradient-to-r from-[#00223d] via-[#003c5e] to-[#405FE2] text-white overflow-hidden relative shadow-md">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
                <CardContent className="p-6 sm:p-8 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                          Identity Verified
                        </Badge>
                        <span className="text-blue-200 text-xs font-mono font-semibold">
                          ID: {candidateId}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        Welcome, {fullName}
                      </h1>
                      <p className="text-blue-100/90 text-sm max-w-xl leading-relaxed">
                        Your technical profile is configured for direct dispatch to our 450+ hiring agencies. Complete your evaluation to generate a verified scorecard.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        onClick={() => setIsAssessmentOpen(true)}
                        disabled={totalTests >= 2}
                        className="bg-white text-[#003c5e] hover:bg-blue-50 font-bold px-5 py-2.5 shadow-md shadow-black/10"
                      >
                        <PlayCircle className="w-4 h-4 mr-2 text-[#405FE2]" />
                        {totalTests >= 2 ? "2/2 Attempts Used" : totalTests === 1 ? "Retake Assessment" : "Start Proctored Test"}
                      </Button>
                      <span className="text-[11px] text-blue-200 text-center font-medium">
                        {attemptsLeft} attempts remaining
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-blue-100/70 shadow-sm bg-white hover:border-[#405FE2]/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Test Score</span>
                      <Award className="w-4 h-4 text-[#405FE2]" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {totalTests > 0 ? `${averageScore}%` : "—"}
                    </div>
                    <p className="text-xs font-semibold text-emerald-600 mt-1">
                      {totalTests > 0 ? (averageScore >= 60 ? "Qualified for Dispatch" : "Technical Review") : "Test Pending"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100/70 shadow-sm bg-white hover:border-[#405FE2]/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attempts</span>
                      <Clock className="w-4 h-4 text-[#405FE2]" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {totalTests} / 2
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {attemptsLeft === 0 ? "Quota Exhausted" : `${attemptsLeft} attempt remaining`}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100/70 shadow-sm bg-white hover:border-[#405FE2]/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pass Rate</span>
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black text-emerald-600">
                      {totalTests > 0 ? `${passRate}%` : "—"}
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Target: &gt;= 60% Passing
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100/70 shadow-sm bg-white hover:border-[#405FE2]/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Integrity</span>
                      <Shield className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black text-emerald-600">
                      100%
                    </div>
                    <p className="text-xs font-semibold text-emerald-700 mt-1">
                      Zero Security Flags
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Technical Domain Competency Breakdown */}
              <Card className="border-blue-100/70 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        Technical Skill Diagnostic
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Assessed against ApexHire and BlueChip employer requirements
                      </CardDescription>
                    </div>
                    <Sparkles className="w-4 h-4 text-[#405FE2]" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Precision Metrology & Quality Inspection", value: totalTests > 0 ? 85 : 0, color: "bg-[#405FE2]" },
                    { title: "Industrial Safety & 5S Operational Standards", value: totalTests > 0 ? 90 : 0, color: "bg-emerald-500" },
                    { title: "Electrical & Clean Energy Battery Systems", value: totalTests > 0 ? 80 : 0, color: "bg-[#003c5e]" },
                    { title: "CNC / VMC Machining & Production Diagnostics", value: totalTests > 0 ? 75 : 0, color: "bg-purple-600" },
                  ].map((skill, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{skill.title}</span>
                        <span className="text-slate-900 font-bold">{totalTests > 0 ? `${skill.value}%` : "Pending Evaluation"}</span>
                      </div>
                      <Progress value={skill.value} className="h-2 bg-slate-100" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Test History Card */}
              <Card className="border-blue-100/70 shadow-sm bg-white">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Recent Assessment Attempts
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Proctored technical and safety evaluations recorded in database
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("assessments")}
                    className="text-xs font-semibold text-[#405FE2] border-blue-200 hover:bg-blue-50"
                  >
                    View All Logs
                  </Button>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <h4 className="font-bold text-sm text-slate-700">No Assessment Records Yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Take the 5-question proctored evaluation to generate your verified scorecard.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setIsAssessmentOpen(true)}
                        className="bg-[#405FE2] hover:bg-[#2e47b3] text-white font-semibold text-xs"
                      >
                        <PlayCircle className="w-4 h-4 mr-1.5" />
                        Start Proctored Assessment
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-100">
                            <TableHead className="text-xs font-bold">Date</TableHead>
                            <TableHead className="text-xs font-bold">Assessment</TableHead>
                            <TableHead className="text-xs font-bold text-center">Score</TableHead>
                            <TableHead className="text-xs font-bold">Status</TableHead>
                            <TableHead className="text-xs font-bold">Integrity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {history.slice(0, 3).map((item, idx) => (
                            <TableRow key={item.id || idx} className="border-slate-100">
                              <TableCell className="text-xs text-slate-500 font-mono">
                                {new Date(item.completed_at).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </TableCell>
                              <TableCell className="text-xs font-semibold text-slate-800">
                                {item.test_title}
                              </TableCell>
                              <TableCell className="text-xs font-bold text-center">
                                <Badge
                                  variant="outline"
                                  className={item.score >= 60 ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold" : "bg-amber-50 text-amber-700 border-amber-300 font-bold"}
                                >
                                  {item.score} / {item.total_score || 100}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs font-bold text-emerald-600">
                                {item.score >= 60 ? "PASSED (Qualified)" : "Under Review"}
                              </TableCell>
                              <TableCell className="text-xs">
                                <Badge variant="outline" className="text-[11px] font-semibold border-slate-200">
                                  {item.integrity_flags || 0} Flags
                                </Badge>
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
            <div className="space-y-6">
              <Card className="border-blue-100/70 shadow-sm bg-white">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">
                        Proctored Technical Evaluation Suite
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Automated AI face verification and anti-cheating monitoring active
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs font-bold px-2.5 py-1">
                        Attempts Used: {totalTests} / 2
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => setIsAssessmentOpen(true)}
                        disabled={totalTests >= 2}
                        className="bg-[#405FE2] hover:bg-[#2e47b3] text-white font-semibold text-xs"
                      >
                        <PlayCircle className="w-4 h-4 mr-1.5" />
                        {totalTests >= 2 ? "Quota Completed" : totalTests === 1 ? "Retake (Attempt 2 of 2)" : "Take Assessment"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {totalTests >= 2 && (
                    <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 flex items-start gap-3">
                      <Lock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm text-red-900">Maximum Attempt Limit Reached</h4>
                        <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                          You have completed both permitted attempts. Your highest verified score ({averageScore}%) has been locked and shared with partner hiring agencies.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-100">
                          <TableHead className="text-xs font-bold">Attempt Timestamp</TableHead>
                          <TableHead className="text-xs font-bold">Evaluation Title</TableHead>
                          <TableHead className="text-xs font-bold text-center">Score</TableHead>
                          <TableHead className="text-xs font-bold">Status</TableHead>
                          <TableHead className="text-xs font-bold">Integrity Rating</TableHead>
                          <TableHead className="text-xs font-bold">Partner Route</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-xs text-slate-400">
                              No assessment records logged. Click "Take Assessment" to begin.
                            </TableCell>
                          </TableRow>
                        ) : (
                          history.map((test, index) => (
                            <TableRow key={test.id || index} className="border-slate-100 hover:bg-slate-50/50">
                              <TableCell className="text-xs font-mono text-slate-500">
                                {new Date(test.completed_at).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </TableCell>
                              <TableCell className="text-xs font-semibold text-slate-800">
                                {test.test_title}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  className={test.score >= 60 ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-bold" : "bg-amber-100 text-amber-800 hover:bg-amber-100 font-bold"}
                                >
                                  {test.score} / {test.total_score || 100}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs font-bold text-emerald-600">
                                {test.score >= 60 ? "QUALIFIED (Dispatched)" : "Under Technical Review"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs font-semibold border-emerald-300 text-emerald-700 bg-emerald-50">
                                  <Shield className="w-3 h-3 mr-1 text-emerald-600" />
                                  {test.integrity_flags || 0} Flags
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs font-medium text-slate-500">
                                {test.partner_route || "ApexHire • TalentPulse • BlueChip"}
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
            <div className="space-y-6">
              <Card className="border-blue-100/70 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    Candidate Dossier &amp; Identity Credentials
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Verified photo ID snapshot, uploaded resume and domain classification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</span>
                      <p className="font-bold text-sm text-slate-800">{fullName}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Candidate ID</span>
                      <p className="font-mono font-bold text-sm text-[#405FE2]">{candidateId}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</span>
                      <div className="flex items-center gap-1.5 font-medium text-sm text-slate-800">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{email}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mobile Phone</span>
                      <div className="flex items-center gap-1.5 font-medium text-sm text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{phone}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Industry Domain</span>
                      <div className="flex items-center gap-1.5 font-medium text-sm text-slate-800">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span>{domain}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Location &amp; Mobility</span>
                      <div className="flex items-center gap-1.5 font-medium text-sm text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Photo ID and Resume Document Viewers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 flex items-center gap-4">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Live Verified Photo"
                          className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Live Photo ID Verified</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Geometric face alignment passed during candidate onboarding.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#405FE2]/10 text-[#405FE2] flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[140px]">{resumeName}</p>
                          <span className="text-[11px] text-slate-400">Scorecard Attached</span>
                        </div>
                      </div>

                      {resumeUrl && (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-[#405FE2] bg-white hover:bg-blue-50 transition-colors shadow-xs"
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
            <div className="space-y-6">
              <Card className="border-red-200/80 shadow-md bg-white overflow-hidden relative">
                {/* Red Security Banner */}
                <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-wide">RESTRICTED DISPATCH ACCESS</h3>
                      <p className="text-[11px] text-red-100">Tier-1 Corporate Recruitment Integration Channel</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-white/30 text-white bg-white/10 text-[10px] font-mono uppercase tracking-wider font-bold">
                    Secure Enclave
                  </Badge>
                </div>

                <CardContent className="p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                  {/* Red Keypad Lock Icon Graphic */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500 via-rose-600 to-red-700 flex flex-col items-center justify-center shadow-xl shadow-red-500/25 ring-8 ring-red-100">
                      <Lock className="w-10 h-10 text-white drop-shadow-md mb-1" />
                      {/* Keypad dots simulation */}
                      <div className="grid grid-cols-3 gap-1 px-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border-2 border-white shadow-sm">
                      Locked
                    </div>
                  </div>

                  {/* High Visibility Prompt Text */}
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight max-w-md">
                    Attempt the test, give your best
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm max-w-lg mt-2 leading-relaxed">
                    Partner Recruiter Dispatch Pipeline unlocks automatically once you complete your proctored assessment. Ensure maximum focus to achieve your qualifying benchmark.
                  </p>

                  {/* Status Indicator */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                      <Lock className="w-3.5 h-3.5 text-red-600" />
                      <span>Pipeline Gated</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#003c5e] text-xs font-semibold">
                      <span>Quota: {attemptsLeft} attempts remaining</span>
                    </div>
                  </div>

                  {/* Action Button to launch test */}
                  <div className="mt-8">
                    <Button
                      size="lg"
                      onClick={() => setIsAssessmentOpen(true)}
                      disabled={totalTests >= 2}
                      className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold shadow-lg shadow-red-500/25 px-8"
                    >
                      <PlayCircle className="w-5 h-5 mr-2" />
                      {totalTests >= 2 ? "Attempts Completed" : totalTests === 1 ? "Retake Assessment Now" : "Start Proctored Test Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 5: SETTINGS & SECURITY */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card className="border-blue-100/70 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    Security &amp; Account Settings
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Manage session, camera permissions, and privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Registered Account</h4>
                      <p className="text-xs text-slate-500">Signed in as {email}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-1.5" />
                      Sign Out
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Webcam Proctoring Clearance</h4>
                      <p className="text-xs text-slate-500">AI Face Verification active</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 text-xs font-bold">
                      Active
                    </Badge>
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
