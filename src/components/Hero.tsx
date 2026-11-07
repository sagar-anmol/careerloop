"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Coins,
  Building2,
  Users
} from "lucide-react";

interface HeroProps {
  onStartAssessment: () => void;
}

export function Hero({ onStartAssessment }: HeroProps) {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#1c263c] subtle-grid hero-glow">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-inner backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Zero Upfront Fee &bull; Pay Only When You Get Placed</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
          Prove Your Skills. <br />
          Get <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Guaranteed Interview Calls</span> <br className="hidden sm:block" />
          via 450+ HR Agencies.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Sign up with live photo verification, pass our strict proctored technical assessment, and undergo hands-on capstone training. Our 450+ partner HR agencies line up your interview calls—<strong className="text-white font-semibold">you only pay a nominal fee when you successfully get placed</strong>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
          <Button 
            size="lg" 
            onClick={onStartAssessment}
            className="w-full sm:w-auto h-12 px-8 font-semibold text-sm rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            Sign Up &amp; Take Proctored Test (Free)
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <a href="#placement-terms" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto h-12 px-7 font-semibold text-sm rounded-xl border-[#1c263c] bg-[#0c111d] hover:bg-[#161f30] text-slate-200"
            >
              Pay-After-Placement Terms
            </Button>
          </a>
        </div>

        {/* 3 Metrics Cards */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-[#0c111d]/80 border border-[#1c263c] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs text-white block">₹0 Upfront Fee</strong>
              <span className="text-[11px] text-slate-400">Pay only when you get hired</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c111d]/80 border border-[#1c263c] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs text-white block">450+ HR Agencies</strong>
              <span className="text-[11px] text-slate-400">Direct hiring partner network</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c111d]/80 border border-[#1c263c] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs text-white block">Camera Proctored Test</strong>
              <span className="text-[11px] text-slate-400">Verified merit-based evaluation</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
