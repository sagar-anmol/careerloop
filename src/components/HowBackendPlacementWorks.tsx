"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Server, 
  Cpu, 
  Send, 
  PhoneCall, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from "lucide-react";

interface HowBackendPlacementWorksProps {
  onStartAssessment: () => void;
}

export function HowBackendPlacementWorks({ onStartAssessment }: HowBackendPlacementWorksProps) {
  const steps = [
    {
      num: "01",
      title: "Diagnostic Test & Profile Creation",
      desc: "Complete the initial onboarding assessment on this site. Our evaluation engine benchmarks your logic, coding aptitude, and current career trajectory.",
      icon: Cpu,
      tag: "Immediate Evaluation"
    },
    {
      num: "02",
      title: "Intensive Course Training (₹5,000 INR)",
      desc: "Enroll in the targeted training sprint. Build 3 production-grade capstone architectures reviewed by senior engineering mentors.",
      icon: Sparkles,
      tag: "Flat ₹5,000 INR"
    },
    {
      num: "03",
      title: "Automated Backend Agency Dispatch",
      desc: "No cold applications needed. Behind the scenes, our backend platform automatically routes your verified Skills Passport directly to 450+ accredited HR agency heads.",
      icon: Server,
      tag: "Backend Automated"
    },
    {
      num: "04",
      title: "Direct HR Interview Calls & Placement",
      desc: "Partner HR agencies contact you directly via phone and WhatsApp to schedule interviews with hiring managers. Guaranteed 3-5 interview calls or 100% refund.",
      icon: PhoneCall,
      tag: "Guaranteed Calls"
    }
  ];

  return (
    <section className="py-20 relative bg-[#0f1118] border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="outline" className="px-3 py-1 bg-white/5 text-[#ffb38a] border-[#ffb38a]/30 text-xs font-semibold">
            <Server className="w-3.5 h-3.5 mr-1" />
            Backend HR Placement Architecture
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How The Backend Delivers Your Interview Calls
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            You don’t have to search or apply on public job boards. Once you finish the course and pass the final test, our backend syndication engine takes over.
          </p>
        </div>

        {/* 4 Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-3xl relative flex flex-col justify-between glass-card-hover group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-white/20 group-hover:text-[#ffb38a] transition-colors">
                      {step.num}
                    </span>
                    <Badge variant="secondary" className="text-[10px] bg-white/10 text-[#ffb38a] border-white/10">
                      {step.tag}
                    </Badge>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ffb38a] mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#ffb38a]">
                  <span>Step {step.num} of 04</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Backend Guarantee Callout Banner */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#171a26] via-[#1b2033] to-[#141722] border border-white/10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs px-3 py-1 font-semibold">
                Guaranteed Placement Terms
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Complete The Training &bull; Receive Guaranteed HR Interview Calls
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                We charge a single flat fee of <strong className="text-white">₹5,000 INR</strong> for the entire course curriculum, 1-on-1 mentor guidance, and capstone review. If our partner HR agencies do not schedule your interview calls within 90 days of passing, you get an immediate 100% full refund.
              </p>
            </div>

            <Button
              onClick={onStartAssessment}
              className="bg-gradient-to-r from-[#ffb38a] to-[#f59e0b] text-black font-extrabold px-8 h-12 rounded-xl text-sm shrink-0 shadow-xl hover:opacity-95"
            >
              Take Free Assessment Test Now &rarr;
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
