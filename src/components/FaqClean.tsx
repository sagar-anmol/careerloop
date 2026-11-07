"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function FaqClean() {
  const faqs = [
    {
      q: "How does the fee structure work?",
      a: "There is zero upfront cost. Sign up, live photo verification, the strict proctored assessment, and hands-on capstone training are 100% free to start. You only pay a modest, nominal fee once you successfully receive and accept your job offer. The fee is calibrated fairly based upon the company tier and salary package you are placed into."
    },
    {
      q: "What happens if I don't get placed in a job?",
      a: "If you do not get placed or do not receive a qualifying job offer, you pay absolutely nothing (₹0). We operate purely on a success-based model aligned with your career outcome."
    },
    {
      q: "Why is the online assessment strictly proctored with laptop camera on?",
      a: "Our 450+ partner HR recruitment agencies rely on our technical benchmark scores to bypass cold resume filtering and skip preliminary phone screens. To guarantee 100% credential credibility, the assessment enforces strict anti-cheat criteria: live webcam face tracking, disabling the backspace key and browser back navigation, and detecting unauthorized tab switches."
    },
    {
      q: "How do the 450+ partner HR agencies schedule my interview calls?",
      a: "Once your assessment score and capstone project repositories are audited, our backend platform automatically routes your verified Skills Passport directly to dedicated technical recruiters at partner agencies like ApexHire, TalentPulse, and BlueChip. They contact you directly to schedule client interviews."
    }
  ];

  return (
    <section id="faq" className="py-20 border-b border-[#1c263c] bg-[#07090e]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-2.5">
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30 font-semibold">
            Common Inquiries
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Clear, transparent answers about our proctoring rules, agency partnerships, and placement guarantee.
          </p>
        </div>

        {/* Accordion */}
        <div className="bg-[#0c111d] border border-[#1c263c] rounded-2xl p-4 sm:p-6 shadow-2xl">
          <Accordion className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-[#1c263c] py-1.5 last:border-0">
                <AccordionTrigger className="text-left font-semibold text-xs sm:text-sm py-3.5 text-slate-200 hover:text-blue-400 hover:no-underline transition-colors">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-slate-400 leading-relaxed pb-3.5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
}
