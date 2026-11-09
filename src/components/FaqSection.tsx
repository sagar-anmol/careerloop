"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ShieldCheck } from "lucide-react";

export function FaqSection() {
  const faqs = [
    {
      q: "How does the third-party HR agency placement model actually work?",
      a: "Unlike traditional colleges or bootcamps that merely post jobs on an alumni board, careerloop maintains contractual partnerships with over 450 accredited technical recruitment agencies (including ApexHire, TalentPulse, and BlueChip Search). These agencies are hired by tech companies to find verified candidates. When you complete your capstone and pass the benchmark audit, your candidate profile is directly placed into their high-priority talent pipeline, bypassing cold recruiter inboxes."
    },
    {
      q: "What is the 100% Placement Guarantee?",
      a: "If you complete all coursework, finish your capstone projects with passing code audits, and attend our agency interview sessions, you are guaranteed to receive qualifying job offers within 180 days of graduation. If you do not receive an offer meeting our salary threshold ($65,000+ baseline), you receive a 100% full refund of your tuition."
    },
    {
      q: "Do partner HR agencies charge the graduate any fees?",
      a: "No! Never. You will never pay a dime to any recruitment agency. Third-party HR agencies are compensated directly by the hiring employer when a placement is made. In fact, their incentive is to negotiate the highest possible salary and signing bonus for you, because agency commissions scale with candidate compensation."
    },
    {
      q: "Can I take these courses while working a full-time job?",
      a: "Yes! All our course cohorts feature flexible part-time scheduling (evenings and weekends), recorded mentor sessions, and 24/7 async code review support. The typical student commits 10 to 14 hours per week, allowing you to upskill smoothly without quitting your current job."
    },
    {
      q: "Are the placed jobs remote, hybrid, or on-site?",
      a: "Over 68% of our partner agency mandates are 100% remote (US, UK, European, and Worldwide contracts). The remaining 32% are hybrid or on-site in major tech hubs (San Francisco, New York, London, Berlin, Austin, Toronto, Bangalore) with relocation and visa sponsorship support available."
    },
    {
      q: "How can my HR recruitment agency partner with careerloop?",
      a: "HR recruitment agencies and headhunting firms can join our network for free. Click 'Register as HR Partner Agency' in the header to request verified candidate pipeline access. We will assign a dedicated talent partnership coordinator to match our graduating cohort rosters with your open client job orders."
    }
  ];

  return (
    <section className="py-20 bg-muted/30 border-t border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <Badge variant="outline" className="px-3 py-1 bg-background text-primary border-primary/20 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            Frequently Asked Questions
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Everything You Need to Know
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Clear, transparent answers about our skill acceleration tracks, partner agency network, and guaranteed job placement terms.
          </p>
        </div>

        {/* Accordion */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <Accordion className="w-full space-y-2">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border/60 py-2">
                <AccordionTrigger className="text-left font-bold text-base text-foreground hover:text-primary transition-colors py-3">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1 pb-3">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Guarantee Seal */}
        <div className="mt-8 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center gap-3 text-xs text-blue-900 dark:text-blue-200 text-center">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Every cohort enrollment is backed by our formal Placement Terms &amp; Conditions and Money-Back Agreement.</span>
        </div>

      </div>
    </section>
  );
}
