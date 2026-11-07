"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Compass, 
  CheckCircle2, 
  UserCheck, 
  Laptop, 
  Code2, 
  FileCheck, 
  Building2, 
  Trophy, 
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface OnboardingProcessProps {
  onOpenCandidateModal: () => void;
}

export function OnboardingProcess({ onOpenCandidateModal }: OnboardingProcessProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const phases = [
    {
      phaseNumber: "01",
      timing: "Days 1 – 3",
      title: "Application & Skill Diagnostic",
      subtitle: "Personalized Trajectory Assessment",
      icon: UserCheck,
      color: "from-blue-600 to-indigo-600",
      summary: "We evaluate your current technical baseline, work history, and career targets to map the optimal skill track and agency placement route.",
      details: [
        "15-minute 1-on-1 strategy call with a Senior Admissions Advisor",
        "Technical background & strengths diagnostic benchmark",
        "Target salary bracket & relocation/remote preference alignment",
        "Instant Agency Matching Preview based on live hiring mandates"
      ],
      milestone: "Candidate Action Plan & Track Assignment"
    },
    {
      phaseNumber: "02",
      timing: "Days 4 – 7",
      title: "Cohort Induction & Tooling Setup",
      subtitle: "Welcome to the Engineering Suite",
      icon: Laptop,
      color: "from-indigo-600 to-purple-600",
      summary: "Get fully provisioned with enterprise developer tooling, private repositories, cloud sandboxes, and dedicated 1-on-1 mentors.",
      details: [
        "Private Slack/Discord cohort workspace & GitHub Enterprise team seat",
        "Dedicated Senior Engineering Mentor & Placement Career Coach assigned",
        "Cloud workspace configuration (AWS/GCP, Docker, Next.js, PyTorch)",
        "Curated preparatory sprint to ensure Day 1 coding readiness"
      ],
      milestone: "Verified Development Sandbox & Mentor Introduction"
    },
    {
      phaseNumber: "03",
      timing: "Weeks 1 – 12",
      title: "Intensive Sprints & Live Capstones",
      subtitle: "Real Architecture, Zero Fluff",
      icon: Code2,
      color: "from-purple-600 to-pink-600",
      summary: "Engage in live weekend lectures, real-time code reviews, and build 3 full-scale production capstones designed directly to employer specs.",
      details: [
        "Interactive live masterclasses with senior architects from top tech firms",
        "24/7 asynchronous code reviews with strict PR rubric benchmarks",
        "Building 3 production capstones: Multi-tenant SaaS, RAG pipelines, or Kubernetes clusters",
        "Weekly technical quizzes and system design challenges"
      ],
      milestone: "3 Production-Grade Repositories Live on GitHub"
    },
    {
      phaseNumber: "04",
      timing: "Weeks 13 – 14",
      title: "Capstone Defense & Skills Passport",
      subtitle: "Recruiter-Vetted Benchmarking",
      icon: FileCheck,
      color: "from-amber-600 to-orange-600",
      summary: "Defend your codebase before an architectural evaluation panel to earn a verified digital Skills Passport recognized by our 450+ partner agencies.",
      details: [
        "Live 30-minute Capstone Code Defense & architectural walkthrough",
        "Tamper-proof digital Skills Passport generated with benchmark percentiles",
        "Exemption from preliminary HR algorithmic screening phone screens",
        "Resume and LinkedIn transformation tailored to executive recruiter ATS systems"
      ],
      milestone: "Accredited Digital Skills Passport & Recruiter Portfolio"
    },
    {
      phaseNumber: "05",
      timing: "Weeks 15 – 18",
      title: "Multi-Agency Direct Dispatch",
      subtitle: "Direct Fast-Track Interviews",
      icon: Building2,
      color: "from-emerald-600 to-teal-600",
      summary: "Your portfolio and passport are directly transmitted to dedicated account managers across our 450+ partner HR agencies with open job orders.",
      details: [
        "Simultaneous submission to specialized agency pools (ApexHire, TalentPulse, BlueChip)",
        "Dedicated headhunters advocate for you directly with hiring VPs & CTOs",
        "Mock interview rehearsals with specialized behavioral & system design coaches",
        "Average of 3 to 6 direct first-round interview invitations within 14 days"
      ],
      milestone: "Direct Placement Interviews Scheduled"
    },
    {
      phaseNumber: "06",
      timing: "Weeks 18+",
      title: "Offer Negotiation & Placement",
      subtitle: "Securing Top-Tier Compensation",
      icon: Trophy,
      color: "from-blue-600 to-cyan-600",
      summary: "Partner agency recruiters negotiate high-bracket compensation packages on your behalf, backed by our 100% money-back placement guarantee.",
      details: [
        "Recruiter-led compensation bargaining (base, signing bonus, remote stipends)",
        "Formal offer letter review and contract finalization",
        "100% tuition refund if no qualified offer received within 180 days",
        "Ongoing 90-day post-placement check-ins and alumni network access"
      ],
      milestone: "Signed Job Offer & Career Transformation"
    }
  ];

  const currentPhase = phases[activeTab];
  const CurrentIcon = currentPhase.icon;

  return (
    <section id="onboarding" className="py-20 bg-background relative border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="outline" className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 mr-1" />
            The Complete Candidate Journey
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            The 6-Step Onboarding &amp; Placement Process
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            From the moment you apply to the day you sign your offer letter: here is the exact, step-by-step roadmap designed to transition you into a top-tier tech role via our 450+ partner HR agencies.
          </p>
        </div>

        {/* Phase Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {phases.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-blue-500/20 scale-[1.02]"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-xs font-black uppercase ${isSelected ? "text-white/80" : "text-primary"}`}>
                    Phase {item.phaseNumber}
                  </span>
                  <span className={`text-[10px] font-semibold ${isSelected ? "text-white/90" : "text-muted-foreground"}`}>
                    {item.timing}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-foreground"}`} />
                  <span className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-foreground"}`}>
                    {item.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Phase Deep Dive Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-card border border-border shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold py-1 px-3">
                  Phase {currentPhase.phaseNumber} &bull; {currentPhase.timing}
                </Badge>
                <Badge variant="outline" className="text-xs font-medium">
                  {currentPhase.subtitle}
                </Badge>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {currentPhase.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                  {currentPhase.summary}
                </p>
              </div>

              {/* What happens in this step */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Key Steps &amp; Deliverables:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentPhase.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 p-3 rounded-xl bg-secondary/40 border border-border text-xs text-foreground font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Box */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 block">
                    Phase Outcome Milestone:
                  </span>
                  <span className="font-bold text-blue-950 dark:text-blue-100 text-sm">
                    {currentPhase.milestone}
                  </span>
                </div>
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              </div>

            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-indigo-300 font-semibold block uppercase">Roadmap Progress</span>
                  <span className="text-lg font-bold text-white">Step {currentPhase.phaseNumber} of 06</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span>Program Support:</span>
                  <strong className="text-white">1-on-1 Dedicated Mentor</strong>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span>Placement Representation:</span>
                  <strong className="text-emerald-400">450+ Partner Agencies</strong>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span>Assurance Guarantee:</span>
                  <strong className="text-white">100% Money-Back</strong>
                </div>
              </div>

              {/* Next Phase Quick Navigation */}
              <div className="pt-2 flex items-center justify-between gap-3">
                {activeTab < phases.length - 1 ? (
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab(activeTab + 1)}
                    className="w-full text-xs font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
                  >
                    <span>Next: Phase {phases[activeTab + 1].phaseNumber}</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    onClick={onOpenCandidateModal}
                    className="w-full text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
                  >
                    <span>Start Your Phase 01 Now</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              <Button 
                onClick={onOpenCandidateModal}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-500/25"
              >
                <span>Apply for Next Cohort</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
