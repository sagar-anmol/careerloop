"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  Clock, 
  Award, 
  HelpCircle,
  FileCheck,
  CreditCard
} from "lucide-react";

interface PricingGuaranteeSectionProps {
  onStartAssessment: () => void;
}

export function PricingGuaranteeSection({ onStartAssessment }: PricingGuaranteeSectionProps) {
  const inclusions = [
    "Full Access to Chosen Course Track (AI, Full-Stack, DevOps, or UI/UX)",
    "Comprehensive Initial Technical Diagnostic Assessment & Scorecard",
    "3 Production Capstone Projects Built to Real Enterprise Specifications",
    "1-on-1 Mentor Code Review & PR Architectural Feedback",
    "Tamper-Proof Digital Skills Passport Recognized by 450+ Partner Agencies",
    "Guaranteed 3 to 5 Direct HR Interview Calls Scheduled via Partner Agencies",
    "Interview Coaching, Salary Negotiation & Resume Re-engineering",
    "100% Money-Back Guarantee if Interview Calls Are Not Delivered"
  ];

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="outline" className="px-3 py-1 bg-white/5 text-[#ffb38a] border-[#ffb38a]/30 text-xs font-semibold">
            <CreditCard className="w-3.5 h-3.5 mr-1" />
            Simple, Transparent Pricing
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            One Single Fee. Zero Hidden Deductions.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            We don’t take a cut of your future salary or lock you into predatory Income Share Agreements (ISAs). You pay a flat <strong className="text-white">₹5,000 INR</strong> for the entire training and placement pipeline.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-[#ffb38a]/30 shadow-2xl">
          
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffb38a]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left: Plan Summary */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-2">
                <Badge className="bg-[#ffb38a]/20 text-[#ffb38a] border-[#ffb38a]/30 text-xs font-bold px-3 py-1">
                  Complete Training &bull; Placement Track
                </Badge>
                <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                  Backed by 450+ HR Agencies
                </Badge>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  The All-Inclusive Career Accelerator
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  Start with the online diagnostic test. If you pass, complete the curriculum, build the capstones, and get direct interview calls coordinated through our backend partner agencies.
                </p>
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {inclusions.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/90 font-medium">
                    <Check className="w-4 h-4 text-[#ffb38a] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right: Price & CTA Box */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-5">
              
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block">
                Total All-Inclusive Investment
              </span>

              <div>
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                  ₹5,000
                </div>
                <div className="text-xs text-white/70 mt-1 font-medium">
                  INR &bull; Flat One-Time Fee
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-center gap-2 text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>100% Refundable if you don't receive qualifying HR interview calls.</span>
              </div>

              <Button
                onClick={onStartAssessment}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#ffb38a] to-[#f59e0b] text-black font-extrabold text-sm shadow-xl hover:opacity-95"
              >
                <span>Take Diagnostic Test</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-[11px] text-muted-foreground">
                Zero ISA &bull; Zero Salary Deductions &bull; Lifetime Community Access
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
