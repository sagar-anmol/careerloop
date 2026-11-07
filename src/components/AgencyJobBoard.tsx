"use client";

import React, { useState, useMemo } from "react";
import { LIVE_JOBS, JobOpening } from "@/data/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Filter,
  ArrowRight,
  ShieldCheck,
  Send
} from "lucide-react";

interface AgencyJobBoardProps {
  onOpenCandidateModal: (courseId?: string, jobId?: string) => void;
}

export function AgencyJobBoard({ onOpenCandidateModal }: AgencyJobBoardProps) {
  const [workTypeFilter, setWorkTypeFilter] = useState<string>("All");
  const [jobSearch, setJobSearch] = useState<string>("");

  const filteredJobs = useMemo(() => {
    return LIVE_JOBS.filter((job) => {
      const matchesType = workTypeFilter === "All" || job.workType === workTypeFilter;
      const query = jobSearch.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.agencyName.toLowerCase().includes(query) ||
        job.hiringIndustry.toLowerCase().includes(query) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(query));

      return matchesType && matchesSearch;
    });
  }, [workTypeFilter, jobSearch]);

  return (
    <section id="live-jobs" className="py-20 bg-muted/30 border-t border-border/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Recruiter Mandates
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Active Openings Sourced by Partner HRs
            </h2>
            <p className="text-muted-foreground text-base">
              These verified positions are exclusively handled by our 450+ partner HR agencies. Complete our course track and gain prioritized, direct presentation to the hiring manager.
            </p>
          </div>

          {/* Quick stats counter */}
          <div className="flex items-center gap-3 p-3 px-4 rounded-2xl bg-card border border-border shadow-sm">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">1,240+ Active Roles</div>
              <div className="text-xs text-muted-foreground">Across 450+ Partner Agencies</div>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-card border border-border mb-8 shadow-sm">
          {/* Work Type Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["All", "Remote", "Hybrid", "On-site"].map((type) => (
              <button
                key={type}
                onClick={() => setWorkTypeFilter(type)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  workTypeFilter === type
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Job search input */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter by role, skill, agency..."
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-secondary/50 rounded-lg border-0"
            />
          </div>
        </div>

        {/* Job Listings List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border p-6">
              <p className="text-sm font-medium text-muted-foreground">No jobs match your current filters.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setWorkTypeFilter("All"); setJobSearch(""); }}
                className="mt-3 text-xs"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left job info */}
                <div className="space-y-3 flex-1">
                  
                  {/* Agency tag & timestamp */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs font-semibold bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {job.agencyName}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] text-muted-foreground font-medium">
                      {job.agencyBadge}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] bg-secondary text-secondary-foreground font-medium">
                      {job.hiringIndustry}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground ml-auto sm:ml-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.postedTime}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Key Pills: Location, Salary, Experience */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{job.location} ({job.workType})</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{job.salaryRange}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Target Track: <strong className="text-foreground">{job.targetCourse}</strong></span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {job.requiredSkills.map((skill, sIdx) => (
                      <span 
                        key={sIdx} 
                        className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Right Action buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
                  <div className="text-[11px] text-muted-foreground text-center lg:text-right hidden sm:block">
                    {job.applicantsCount} graduates in interview pipeline
                  </div>
                  <Button 
                    onClick={() => onOpenCandidateModal(undefined, job.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-10 px-5 shadow-sm"
                  >
                    <span>Apply via Agency</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Agency guarantee footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>All partner agencies are contractually bound to provide transparent interview feedback within 5 business days.</span>
        </div>

      </div>
    </section>
  );
}
