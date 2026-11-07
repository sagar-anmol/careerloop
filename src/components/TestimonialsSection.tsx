"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, Building2, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      role: "AI Solutions Engineer",
      company: "ScaleForge AI",
      agency: "ApexHire Global",
      quote: "The camera proctored assessment and verified capstone gave me instant credibility. ApexHire submitted my scorecard directly to hiring managers and scheduled 3 interview calls within a week!",
      skills: ["LangChain", "Vector DBs", "FastAPI"]
    },
    {
      name: "Priya Patel",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
      role: "Full-Stack Software Engineer",
      company: "NexusPay Cloud",
      agency: "TalentPulse Staffing",
      quote: "I skipped the cold ATS black hole completely. TalentPulse received my verified project benchmarks directly from JobHai and scheduled my interview with the VP of Engineering.",
      skills: ["Next.js 15", "TypeScript", "PostgreSQL"]
    },
    {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
      role: "DevOps & Cloud Engineer",
      company: "FinCore Systems",
      agency: "BlueChip Search",
      quote: "The strict camera proctoring during the initial assessment proves you actually know your code. BlueChip represented me to their banking clients and secured an offer with zero recruiter fees charged to me.",
      skills: ["Kubernetes", "AWS Terraform", "CI/CD"]
    },
    {
      name: "Camila Duarte",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
      role: "Product Systems Designer",
      company: "Aura Health Tech",
      agency: "Horizon Talent",
      quote: "Having my portfolio and assessment score verified by the platform helped me stand out from thousands of design applicants. Horizon Talent matched me with an incredible team.",
      skills: ["Figma Systems", "UX Research", "Design Tokens"]
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-[#07090e] border-b border-[#1c263c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2.5">
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30 font-semibold">
            Verified Alumni Placements
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Placed via 450+ Partner HR Agencies
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Read how candidates who passed our proctored assessment received direct interview calls through our recruitment network.
          </p>
        </div>

        {/* 4 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl pro-card flex flex-col justify-between group"
            >
              <div>
                {/* Header: Avatar, Name, Placed Via Agency */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500/40"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-400">
                        {t.role} &bull; <span className="text-slate-400 font-normal">{t.company}</span>
                      </p>
                    </div>
                  </div>

                  <Badge variant="secondary" className="text-[10px] font-semibold bg-[#161f30] text-blue-300 border border-[#1c263c] shrink-0">
                    Placed via {t.agency}
                  </Badge>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative my-2">
                  <Quote className="w-5 h-5 text-blue-500/20 absolute -top-2 -left-1 pointer-events-none" />
                  <p className="text-xs text-slate-300 italic leading-relaxed pl-3 border-l-2 border-blue-500/40">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Skills Footer */}
              <div className="mt-4 pt-3 border-t border-[#1c263c] flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {t.skills.map((s, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#161f30] text-slate-300 border border-[#1c263c] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct Offer Hired
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-10 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All placement reviews are verified directly through partner HR recruitment client records.</span>
        </div>

      </div>
    </section>
  );
}
