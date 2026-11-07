"use client";

import React from "react";
import { PARTNER_AGENCIES, Agency } from "@/data/agencies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Quote, 
  ArrowRight, 
  ShieldCheck, 
  Globe2, 
  Handshake,
  Sparkles
} from "lucide-react";

interface AgencyPartnerSectionProps {
  onOpenCandidateModal: () => void;
}

export function AgencyPartnerSection({ onOpenCandidateModal }: AgencyPartnerSectionProps) {
  return (
    <section id="agencies" className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Handshake className="w-3.5 h-3.5" />
            Vetted Recruitment Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Our Network of 450+ Partner HR Agencies
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            We partner with premier executive search firms and technical staffing agencies across the globe. They skip initial resume screenings because our graduates come with verifiable codebases and validated technical competency.
          </p>
        </div>

        {/* Agency Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTNER_AGENCIES.map((agency) => (
            <div 
              key={agency.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg group"
            >
              <div>
                
                {/* Header: Logo avatar + Agency name & badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${agency.accentColor} text-white font-extrabold text-sm flex items-center justify-center shadow-md`}>
                      {agency.logoInitials}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {agency.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {agency.tagline}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold bg-secondary shrink-0">
                    {agency.badge}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {agency.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-secondary/50 border border-border/60 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Placed Cohort Grads</span>
                    <strong className="text-foreground font-bold">{agency.placedGraduates}+ Alumni</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Avg Time-to-Offer</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{agency.avgTimeToHire}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Avg Placed Package</span>
                    <strong className="text-foreground font-bold">{agency.avgOfferSalary}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Active Openings</span>
                    <strong className="text-primary font-bold">{agency.activeOpenings} roles</strong>
                  </div>
                </div>

                {/* Specialization tags */}
                <div className="mb-4">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5">
                    Hiring Focus:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {agency.specialty.map((spec, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recruiter Quote */}
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/30 relative">
                  <Quote className="w-3.5 h-3.5 text-blue-500 absolute top-2 right-2 opacity-50" />
                  <p className="text-[11px] italic text-muted-foreground leading-relaxed pr-3">
                    &ldquo;{agency.recruiterQuote}&rdquo;
                  </p>
                  <div className="mt-2 text-[10px] font-semibold text-foreground">
                    {agency.recruiterName} &bull; <span className="text-muted-foreground font-normal">{agency.recruiterRole}</span>
                  </div>
                </div>

              </div>

              {/* Locations footer */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-primary" />
                  {agency.locations.slice(0, 2).join(", ")}
                </span>
                <span className="font-semibold text-primary">Priority Recruiter</span>
              </div>

            </div>
          ))}
        </div>

        {/* Candidate Representation Guarantee Box */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs px-3 py-1 font-semibold">
                Direct Recruiter Representation
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Get Represented by All 450+ Agencies Simultaneously
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                When you graduate from JobHai, you do not apply one-by-one into cold corporate job portals. Our partner agencies receive your verified code repository and actively advocate for you with their enterprise clients.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Exemption from First-Round ATS Filters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Recruiter-Advocated Salary Bargaining</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Tuition Placement Guarantee</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button 
                onClick={onOpenCandidateModal}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-blue-500/30"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enroll for Direct Agency Placement
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
