"use client";

import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#090d16] text-slate-400 text-xs py-12 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-sm">JobHai</span>
          <span className="text-slate-500">&bull; Skill Assessment &amp; Pay-After-Placement Network</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-5 text-[11px] font-medium text-slate-400">
          <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimonials</a>
          <a href="#placement-terms" className="hover:text-blue-400 transition-colors">Pay-After-Placement</a>
          <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
          <a 
            href={`https://wa.me/918789970312?text=${encodeURIComponent("Hello JobHai, I want to inquire about the technical assessment and pay-after-placement model.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 text-emerald-500 font-semibold"
          >
            WhatsApp Support
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-slate-500">
          &copy; 2026 JobHai. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
