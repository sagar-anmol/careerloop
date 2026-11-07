"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Building2, ShieldCheck } from "lucide-react";

export function AgencyTrustGrid() {
  const agencies = [
    { name: "ApexHire Global", specialty: "AI & Cloud Roles", hires: "480+ Placed" },
    { name: "TalentPulse Staffing", specialty: "Full-Stack Tech", hires: "860+ Placed" },
    { name: "BlueChip Search", specialty: "Enterprise DevOps", hires: "310+ Placed" },
    { name: "Horizon Talent", specialty: "Product & UI/UX", hires: "290+ Placed" },
    { name: "NextGen Staffing", specialty: "Cyber & Security", hires: "420+ Placed" },
    { name: "Vanguard HR", specialty: "Global Relocation", hires: "510+ Placed" },
  ];

  return (
    <section id="agencies" className="py-20 bg-[#090d16] border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <Badge variant="outline" className="text-xs bg-blue-950/70 text-blue-300 border-blue-800/60 font-semibold">
            Recruitment Partner Network
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Backed by 450+ Partner HR Agencies
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Our backend routes your verified capstone portfolio directly to these recruitment partners to schedule your interview calls.
          </p>
        </div>

        {/* Agency Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {agencies.map((agency, i) => (
            <div 
              key={i}
              className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 text-center flex flex-col justify-between hover:border-blue-500/40 hover:shadow-lg transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400 mx-auto flex items-center justify-center font-bold text-xs mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <strong className="text-xs font-bold text-white block truncate">{agency.name}</strong>
                <span className="text-[10px] text-slate-400 block mt-1">{agency.specialty}</span>
              </div>
              <span className="text-[10px] font-semibold text-blue-400 mt-3 block">
                {agency.hires}
              </span>
            </div>
          ))}
        </div>

        {/* Assurance footnote */}
        <div className="mt-10 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>All agency interview coordination is handled seamlessly on the backend.</span>
        </div>

      </div>
    </section>
  );
}
