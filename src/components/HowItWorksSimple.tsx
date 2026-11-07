"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { UserCheck, ShieldAlert, BookOpen, PhoneCall, ArrowRight } from "lucide-react";

export function HowItWorksSimple() {
  const steps = [
    {
      num: "01",
      title: "Sign Up & Photo Verification",
      desc: "Complete your candidate profile, capture your live webcam verification photo, and upload your resume. 100% free.",
      icon: UserCheck,
      badge: "Free Profile"
    },
    {
      num: "02",
      title: "Strict Proctored Assessment",
      desc: "Take the diagnostic test with laptop camera ON, no backspace, no tab switching, and anti-cheat locks.",
      icon: ShieldAlert,
      badge: "Camera Monitored"
    },
    {
      num: "03",
      title: "Capstone Training Sprints",
      desc: "Build 3 production capstone repos with 1-on-1 mentor code audits. Zero upfront fees charged.",
      icon: BookOpen,
      badge: "Hands-on Code"
    },
    {
      num: "04",
      title: "Direct Placement & Nominal Fee",
      desc: "Our 450+ partner HR agencies schedule your client interviews. You pay a nominal fee only when successfully placed.",
      icon: PhoneCall,
      badge: "Pay When Hired"
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-b border-[#1c263c] bg-[#07090e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2.5">
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30 font-semibold">
            Merit-Based Placement Pipeline
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How The Process Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A transparent 4-step pipeline connecting verified skills to high-paying client interviews.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl pro-card flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-semibold bg-[#161f30] text-slate-300 border border-[#1c263c]">
                      {s.badge}
                    </Badge>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block mb-1">
                    Step {s.num}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2 tracking-tight">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1c263c] flex items-center justify-between text-[11px] text-slate-500 group-hover:text-blue-400 transition-colors">
                  <span>Phase {s.num}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
