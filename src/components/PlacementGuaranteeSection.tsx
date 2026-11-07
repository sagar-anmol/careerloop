"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, ArrowRight, Coins, Building2, CheckCircle2 } from "lucide-react";

interface PlacementGuaranteeSectionProps {
  onStartAssessment: () => void;
}

export function PlacementGuaranteeSection({ onStartAssessment }: PlacementGuaranteeSectionProps) {
  const points = [
    "Zero Upfront Fees: Sign up, proctored testing, and training sprints are 100% free",
    "Pay Only When Placed: Fee is applicable exclusively after you sign your job offer",
    "Nominal & Fair Structure: The fee is modest and calibrated based on the company tier you join",
    "Strict Proctored Assessment with live laptop webcam monitoring and tab locking",
    "Direct presentation to 450+ partner HR agencies with guaranteed client interview calls",
    "No Job = Zero Payment: If you don't land a placement offer, you owe nothing"
  ];

  return (
    <section id="placement-terms" className="py-20 border-b border-[#1c263c] bg-[#0c111d]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-2.5">
          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold">
            <Coins className="w-3.5 h-3.5 mr-1" />
            Pay-After-Placement Model
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Pay Only When You Get Placed
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Zero upfront investment. You only pay a modest, nominal fee once you successfully receive your job offer, calibrated to your hiring company.
          </p>
        </div>

        {/* Card */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0c111d] border border-[#1c263c] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left points */}
          <div className="space-y-4 flex-1">
            <h3 className="font-bold text-lg text-white">Fair, Success-Based Candidate Terms:</h3>
            <div className="space-y-2.5">
              {points.map((p, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Action Box */}
          <div className="p-6 rounded-2xl bg-[#161f30] border border-[#1c263c] text-center min-w-[260px] w-full md:w-auto space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Candidate Upfront Cost</span>
              <div className="text-4xl font-black text-white mt-1">₹0 Upfront</div>
              <span className="text-[11px] text-slate-400">Nominal fee only upon job offer</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Company Tier-Based Fee</span>
            </div>

            <Button 
              onClick={onStartAssessment} 
              className="w-full text-xs font-semibold h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              Start Free Assessment &rarr;
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}
