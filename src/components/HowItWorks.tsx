"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  ShieldCheck, 
  Building2, 
  Trophy, 
  ArrowRight,
  Zap,
  Users2,
  FileCheck
} from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Intensive Hands-On Sprint",
      subtitle: "Industry-vetted curriculum",
      description: "Learn with live senior engineering mentors. Build real, production-ready software architectures instead of toy sandbox apps.",
      icon: Code2,
      tag: "Real Capstones",
      perks: ["1-on-1 Code Reviews", "Production Git Repositories", "No boring theory slides"]
    },
    {
      step: "02",
      title: "Recruiter Audit & Skills Passport",
      subtitle: "Verified portfolio benchmark",
      description: "Complete your technical capstone defense. Earn a tamper-proof digital Skills Passport that verifies your competence directly to HR heads.",
      icon: FileCheck,
      tag: "Tamper-Proof Verification",
      perks: ["Algorithmic Filter Exemption", "Benchmark Score Card", "Architect Signature"]
    },
    {
      step: "03",
      title: "450+ Agency Representation",
      subtitle: "Direct presentation to hiring managers",
      description: "Your verified profile is simultaneously routed to 450+ partner HR agencies (ApexHire, TalentPulse, BlueChip) with active client mandates.",
      icon: Building2,
      tag: "Multi-Agency Network",
      perks: ["Zero Cold Inboxes", "Dedicated Recruiter Advocates", "Immediate Interview Invites"]
    },
    {
      step: "04",
      title: "Fast-Track Offer & Compensation",
      subtitle: "Multiple competing offers",
      description: "Interview directly with hiring managers. Partner agency recruiters negotiate top-tier compensation, signing bonuses, and remote stipends on your behalf.",
      icon: Trophy,
      tag: "Avg $78.5k - $115k",
      perks: ["Salary Negotiation Support", "Visa & Relocation Assistance", "Placement Guarantee"]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="outline" className="px-3 py-1 bg-background text-primary border-primary/20 text-xs font-semibold">
            The careerloop Advantage
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How The Skills &bull; Agency Pipeline Works
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Traditional bootcamps leave you alone in the cold job market. We combine rigorous practical training with <span className="text-foreground font-semibold">guaranteed placement representation by over 450 third-party HR agencies</span>.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="relative flex flex-col p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all group"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-primary/30 group-hover:text-primary transition-colors">
                    {item.step}
                  </span>
                  <Badge variant="secondary" className="text-[11px] font-medium bg-secondary text-secondary-foreground">
                    {item.tag}
                  </Badge>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">
                  {item.title}
                </h3>
                <div className="text-xs font-semibold text-primary mb-3">
                  {item.subtitle}
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>

                {/* Perks bullet points */}
                <div className="pt-3 border-t border-border/60 space-y-1.5">
                  {item.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5 text-[11px] text-foreground font-medium">
                      <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {/* Flywheel comparison card */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-center lg:text-left">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs px-2.5 py-1">
                The Traditional Path vs. The careerloop Agency Model
              </Badge>
              <h4 className="text-2xl font-bold tracking-tight text-white">
                Stop Sending 200 Resumes Into Company ATS Black Holes.
              </h4>
              <p className="text-sm text-blue-100/80 leading-relaxed">
                Third-party HR agencies are commissioned by employers to fill open roles rapidly. When you graduate from careerloop, partner agencies prioritize your candidate profile because our curriculum is calibrated directly to their live client job orders.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[160px]">
                <div className="text-xs uppercase text-blue-200 font-semibold">Traditional Way</div>
                <div className="text-xl font-bold text-red-300 mt-1">2% Response Rate</div>
                <div className="text-[11px] text-blue-200/70 mt-0.5">Cold applications</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-center min-w-[160px]">
                <div className="text-xs uppercase text-emerald-300 font-semibold">careerloop Agency Model</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">78% Interview Rate</div>
                <div className="text-[11px] text-emerald-200/80 mt-0.5">Direct recruiter push</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
