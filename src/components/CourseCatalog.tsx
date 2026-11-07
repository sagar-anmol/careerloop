"use client";

import React, { useState } from "react";
import { COURSES, Course } from "@/data/courses";
import { CourseSyllabusModal } from "@/components/CourseSyllabusModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, ArrowRight, ShieldCheck, Layers } from "lucide-react";

interface CourseCatalogProps {
  onStartAssessment: () => void;
}

export function CourseCatalog({ onStartAssessment }: CourseCatalogProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <section id="tracks" className="py-20 border-b border-slate-800/80 bg-[#0b101d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <Badge variant="outline" className="text-xs mb-2 bg-blue-950/70 text-blue-300 border-blue-800/60 font-semibold">
              Industry Capstone Curriculum
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Skill-Boosting Training Tracks
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Complete hands-on enterprise projects &amp; unlock guaranteed interview calls with our 450+ partner HR agencies.
            </p>
          </div>
          <Button 
            onClick={onStartAssessment} 
            size="sm" 
            className="text-xs self-start sm:self-auto font-medium rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
          >
            Take Skill Diagnostic Test &rarr;
          </Button>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COURSES.slice(0, 4).map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <Badge variant="secondary" className="text-[10px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
                    {course.category}
                  </Badge>
                  <span className="font-semibold text-xs text-emerald-400">Placement Track</span>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 my-4 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sprint Length:</span>
                    <strong className="text-white font-semibold">{course.duration}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Target CTC:</span>
                    <strong className="text-emerald-400 font-bold">{course.avgSalary}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-5">
                  {course.skills.slice(0, 4).map((s, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedCourse(course)}
                  className="w-full text-xs h-9 rounded-xl border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  View Curriculum &amp; Capstones
                </Button>
                <Button 
                  size="sm" 
                  onClick={onStartAssessment}
                  className="w-full text-xs h-9 font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Qualify via Proctored Test
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>

      <CourseSyllabusModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={() => {
          setSelectedCourse(null);
          onStartAssessment();
        }}
      />
    </section>
  );
}
