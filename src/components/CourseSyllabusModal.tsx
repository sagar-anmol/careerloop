"use client";

import React from "react";
import { Course } from "@/data/courses";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ArrowRight
} from "lucide-react";

interface CourseSyllabusModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
}

export function CourseSyllabusModal({
  course,
  isOpen,
  onClose,
  onEnroll
}: CourseSyllabusModalProps) {
  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-[#0f172a] text-white border-slate-800">
        
        {/* Header */}
        <DialogHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {course.category}
            </Badge>
            {course.badge && (
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-xs">
                {course.badge}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {course.level}
            </Badge>
          </div>

          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            {course.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {course.description}
          </DialogDescription>
        </DialogHeader>

        {/* Highlight KPI Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-4 rounded-2xl bg-secondary/40 border border-border">
          <div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Duration
            </div>
            <div className="text-sm font-bold text-foreground mt-0.5">{course.duration}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              Avg Graduate Salary
            </div>
            <div className="text-sm font-bold text-foreground mt-0.5">{course.avgSalary}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Placement Rate
            </div>
            <div className="text-sm font-bold text-emerald-600 mt-0.5">{course.placementRate}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              Format
            </div>
            <div className="text-sm font-bold text-foreground mt-0.5">{course.format}</div>
          </div>
        </div>

        {/* Partner HR Agencies hiring this cohort */}
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 my-2">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200">
              Partner HR Agencies Actively Hiring for this Track
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {course.partnerAgencies.map((agency, i) => (
              <Badge key={i} variant="outline" className="bg-background text-foreground text-xs font-semibold py-1">
                {agency} &bull; Active Priority Pipeline
              </Badge>
            ))}
          </div>
          <p className="text-[11px] text-blue-800/80 dark:text-blue-300 mt-2">
            Upon capstone completion, your verified benchmark score and project repo are forwarded directly to recruitment managers at these agencies.
          </p>
        </div>

        {/* Week-by-Week Syllabus breakdown */}
        <div className="space-y-4 my-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h4 className="text-base font-bold text-foreground">Week-by-Week Curriculum Breakdown</h4>
          </div>

          <div className="space-y-3">
            {course.syllabusWeeks.map((week, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-bold uppercase text-primary tracking-wide">
                    {week.week}
                  </span>
                  <span className="text-sm font-bold text-foreground">{week.title}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {week.topics.map((t, tIdx) => (
                    <span key={tIdx} className="text-xs px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Capstones */}
        <div className="space-y-3 my-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-base font-bold text-foreground">Production Capstone Deliverables</h4>
          </div>
          <div className="space-y-2">
            {course.keyProjects.map((proj, pIdx) => (
              <div key={pIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border text-xs text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">{proj}</span>
                  <p className="text-muted-foreground mt-0.5">
                    Peer-reviewed, containerized, and deployed live with full README documentation for recruiter screening.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close Syllabus
          </Button>
          <Button 
            onClick={() => {
              onClose();
              onEnroll(course.id);
            }} 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Apply for this Track & Agency Fast-Track
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
