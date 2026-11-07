"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Clock, 
  CheckCircle2 
} from "lucide-react";

interface SalaryCalculatorProps {
  onOpenCandidateModal: (courseId?: string) => void;
}

export function SalaryCalculator({ onOpenCandidateModal }: SalaryCalculatorProps) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState<number>(0);
  const [targetTrackIndex, setTargetTrackIndex] = useState<number>(0);

  const currentRoles = [
    { name: "Customer Support / Non-Tech", baseSalary: 38000 },
    { name: "Junior / Self-Taught Dev", baseSalary: 48000 },
    { name: "IT Helpdesk / Tech Support", baseSalary: 45000 },
    { name: "Graphic Designer / Content", baseSalary: 42000 },
    { name: "Junior QA / Manual Tester", baseSalary: 46000 }
  ];

  const targetTracks = [
    { 
      id: "ai-data-engineering",
      name: "AI & LLM Data Engineering", 
      projectedSalary: 105000, 
      avgDays: "28 Days",
      topAgencies: ["ApexHire Global", "TalentPulse", "NextGen Staffing"]
    },
    { 
      id: "fullstack-modern-web",
      name: "Full-Stack Next.js & Cloud", 
      projectedSalary: 88000, 
      avgDays: "22 Days",
      topAgencies: ["TalentPulse", "Horizon Talent", "Vanguard HR"]
    },
    { 
      id: "cloud-devops-sre",
      name: "Cloud Architecture & DevOps", 
      projectedSalary: 112000, 
      avgDays: "32 Days",
      topAgencies: ["BlueChip Search", "ApexHire Global", "InnovateHR"]
    },
    { 
      id: "product-uiux-design",
      name: "Product Design (UI/UX)", 
      projectedSalary: 84000, 
      avgDays: "26 Days",
      topAgencies: ["Horizon Talent", "EliteTalent Group"]
    },
    { 
      id: "cyber-security-analyst",
      name: "Cyber Security & SOC Analyst", 
      projectedSalary: 98000, 
      avgDays: "24 Days",
      topAgencies: ["NextGen Staffing", "BlueChip Search"]
    }
  ];

  const current = currentRoles[currentRoleIndex];
  const target = targetTracks[targetTrackIndex];

  const salaryDifference = target.projectedSalary - current.baseSalary;
  const percentageIncrease = Math.round((salaryDifference / current.baseSalary) * 100);

  return (
    <section id="calculator" className="py-20 bg-muted/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="outline" className="px-3 py-1 bg-background text-primary border-primary/20 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5 mr-1 text-amber-500" />
            ROI &amp; Career Trajectory Predictor
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Calculate Your Placement Salary Boost
          </h2>
          <p className="text-muted-foreground text-base">
            See your projected compensation leap based on real hiring data from our 450+ partner HR agencies over the past 12 months.
          </p>
        </div>

        {/* Interactive Calculator Card */}
        <div className="max-w-4xl mx-auto bg-card rounded-3xl border border-border shadow-lg p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Current Background */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  1. Select Your Current Background &amp; Role:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentRoles.map((role, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentRoleIndex(idx)}
                      className={`p-3 rounded-xl text-left border text-xs font-medium transition-all ${
                        currentRoleIndex === idx
                          ? "bg-blue-50/80 dark:bg-blue-950/70 border-blue-500 text-blue-950 dark:text-blue-100 font-semibold shadow-sm"
                          : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <div className="text-foreground font-semibold">{role.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Current Baseline: ~${(role.baseSalary / 1000).toFixed(0)}k/yr
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Target Track */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  2. Select Target Skill Course &amp; Placement Track:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {targetTracks.map((track, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTargetTrackIndex(idx)}
                      className={`p-3 rounded-xl text-left border text-xs font-medium transition-all ${
                        targetTrackIndex === idx
                          ? "bg-indigo-50/80 dark:bg-indigo-950/70 border-indigo-500 text-indigo-950 dark:text-indigo-100 font-semibold shadow-sm"
                          : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <div className="text-foreground font-semibold">{track.name}</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                        Avg Grad Offer: ${(track.projectedSalary / 1000).toFixed(0)}k/yr
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Projection Output */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider">
                  Projected Career Outcome
                </span>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                  +{percentageIncrease}% Hike
                </Badge>
              </div>

              {/* Projected Salary Highlight */}
              <div>
                <span className="text-xs text-slate-300 block">Projected Starting Compensation:</span>
                <div className="text-4xl font-black text-white mt-1">
                  ${target.projectedSalary.toLocaleString()}
                  <span className="text-sm font-normal text-slate-300"> / year</span>
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +${salaryDifference.toLocaleString()} annual salary increase
                </div>
              </div>

              {/* Time to offer & Agency match */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Avg Time to First Agency Offer:
                  </span>
                  <strong className="text-white">{target.avgDays}</strong>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    Top Matching HR Agencies:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {target.topAgencies.map((agency, aIdx) => (
                      <span key={aIdx} className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200">
                        {agency}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => onOpenCandidateModal(target.id)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-500/25 mt-2"
              >
                <span>Unlock This Salary Track</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
