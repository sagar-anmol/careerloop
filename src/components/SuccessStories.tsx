"use client";

import React from "react";
import { SUCCESS_STORIES } from "@/data/testimonials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Quote, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Star,
  ArrowRight
} from "lucide-react";

interface SuccessStoriesProps {
  onOpenCandidateModal: () => void;
}

export function SuccessStories({ onOpenCandidateModal }: SuccessStoriesProps) {
  return (
    <section id="stories" className="py-20 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Verified Alumni Transformations
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            From Zero Coding to Placed via Partner Agencies
          </h2>
          <p className="text-muted-foreground text-base">
            Read real graduate journeys from low-paying dead-end jobs into six-figure tech careers through our rigorous courses and dedicated agency representation.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SUCCESS_STORIES.map((story) => (
            <div 
              key={story.id}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl relative group"
            >
              <div>
                
                {/* Header: Graduate info & salary increase badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={story.avatar} 
                      alt={story.name} 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/30"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {story.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {story.currentRole}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        at {story.currentCompany}
                      </p>
                    </div>
                  </div>
                  
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-bold shrink-0">
                    {story.salaryIncrease}
                  </Badge>
                </div>

                {/* Trajectory comparison row */}
                <div className="p-3 rounded-xl bg-secondary/50 border border-border/70 my-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase font-bold">Previous Background:</span>
                    <span className="text-muted-foreground line-through">{story.previousRole}</span>
                  </div>
                  <div className="hidden sm:block text-muted-foreground">&rarr;</div>
                  <div>
                    <span className="text-[10px] text-primary block uppercase font-bold">Placed Via HR Partner:</span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      {story.placedViaAgency}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block uppercase font-bold">Timeline:</span>
                    <span className="font-semibold text-foreground">{story.timeToPlaced}</span>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative my-4">
                  <Quote className="w-6 h-6 text-primary/15 absolute -top-2 -left-2 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed pl-3 border-l-2 border-primary/40">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

              </div>

              {/* Skills footer */}
              <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {story.skillsAcquired.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {story.courseCompleted}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            onClick={onOpenCandidateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-8 shadow-md"
          >
            Start Your Own Career Transformation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

      </div>
    </section>
  );
}
