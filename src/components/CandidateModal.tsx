"use client";

import React, { useState } from "react";
import { COURSES } from "@/data/courses";
import { LIVE_JOBS } from "@/data/jobs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  Send, 
  ArrowRight,
  ShieldCheck,
  Star
} from "lucide-react";

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
  initialJobId?: string;
}

export function CandidateModal({
  isOpen,
  onClose,
  initialCourseId,
  initialJobId
}: CandidateModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>(initialCourseId || COURSES[0].id);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [workPreference, setWorkPreference] = useState("Remote");
  const [submitted, setSubmitted] = useState(false);

  // Sync initial selections
  React.useEffect(() => {
    if (initialCourseId) {
      setSelectedCourse(initialCourseId);
    }
  }, [initialCourseId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName("");
    setEmail("");
    setPhone("");
    onClose();
  };

  const selectedCourseData = COURSES.find((c) => c.id === selectedCourse) || COURSES[0];
  const selectedJobData = initialJobId ? LIVE_JOBS.find((j) => j.id === initialJobId) : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleReset()}>
      <DialogContent className="max-w-lg p-6 sm:p-8 rounded-2xl">
        
        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              Application &amp; Agency Fast-Track Submitted!
            </DialogTitle>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Thank you, <strong className="text-foreground">{fullName || "Candidate"}</strong>! Your profile for <span className="font-semibold text-primary">{selectedCourseData.title}</span> has been queued for our partner HR placement desk.
            </p>

            {/* Match scorecard preview */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-foreground font-semibold">
                <span>Agency Priority Pipeline Match:</span>
                <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                  98% High Fit
                </Badge>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Assigned Partner Agencies: <strong className="text-foreground">{selectedCourseData.partnerAgencies.join(", ")}</strong>
              </p>
              <div className="pt-2 border-t border-border flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admissions &amp; placement advisor will reach out via WhatsApp/Email within 12 hours.</span>
              </div>
            </div>

            <Button onClick={handleReset} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Done &bull; Return to Platform
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Candidate Admissions &amp; Placement
                </Badge>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                Apply for Course &amp; Agency Representation
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                {selectedJobData ? (
                  <span>Applying to interview pipeline for <strong className="text-foreground">{selectedJobData.title}</strong> via <strong className="text-primary">{selectedJobData.agencyName}</strong>.</span>
                ) : (
                  <span>Enroll in a verified skill sprint with guaranteed third-party HR agency presentation upon graduation.</span>
                )}
              </DialogDescription>
            </DialogHeader>

            {/* Track selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Target Skill Course Track</Label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {COURSES.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.avgSalary})
                  </option>
                ))}
              </select>
            </div>

            {/* Candidate Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Email Address *</Label>
                <Input
                  type="email"
                  required
                  placeholder="alex@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Phone / WhatsApp *</Label>
                <Input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Target Job Preference</Label>
                <select
                  value={workPreference}
                  onChange={(e) => setWorkPreference(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Remote">100% Remote Global</option>
                  <option value="Hybrid">Hybrid Major Hub</option>
                  <option value="Relocation">Open to Relocation / Sponsorship</option>
                </select>
              </div>
            </div>

            {/* Agency preview banner */}
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Partner Agencies Assigned Upon Graduation:</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {selectedCourseData.partnerAgencies.join(" &bull; ")}
              </p>
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto text-xs">
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Submit Application &amp; Reserve Seat
              </Button>
            </DialogFooter>

          </form>
        )}

      </DialogContent>
    </Dialog>
  );
}
