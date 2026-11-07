"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, ArrowRight } from "lucide-react";

interface PricingCleanProps {
  onStartAssessment: () => void;
}

export function PricingClean({ onStartAssessment }: PricingCleanProps) {
  const points = [
    "Complete access to your chosen skill-boosting course track",
    "Comprehensive initial technical diagnostic assessment",
    "3 production-grade capstone repos evaluated by senior mentors",
    "Digital Skills Passport verifying your benchmark score",
    "Guaranteed 3 to 5 direct HR interview calls via partner agencies",
    "100% money-back refund if interview calls are not scheduled"
  ];

  return (
    <section id="pricing" className="py-16 border-b border-border/70 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-semibold">
            Simple Flat Investment
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            ₹5,000 INR Flat Fee. Zero ISA Cuts.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            No salary deductions. No surprise fees. A single nominal investment with a complete money-back placement guarantee.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left points */}
          <div className="space-y-3 flex-1">
            <h3 className="font-bold text-base text-foreground">Everything Included in Your ₹5,000 Plan:</h3>
            <div className="space-y-2">
              {points.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-foreground font-medium">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Price Box */}
          <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100 text-center min-w-[220px] w-full md:w-auto space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">One-Time Fee</span>
              <div className="text-4xl font-black text-blue-600 mt-1">₹5,000</div>
              <span className="text-[11px] text-muted-foreground">INR &bull; All-Inclusive</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-blue-100 text-[11px] text-blue-900 font-semibold flex items-center justify-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Refundable Guarantee</span>
            </div>

            <Button onClick={onStartAssessment} className="w-full text-xs font-semibold h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25">
              Start Skill Assessment &rarr;
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}
