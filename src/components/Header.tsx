"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ArrowRight, Menu, X, Coins, Sparkles } from "lucide-react";

interface HeaderProps {
  onStartAssessment: () => void;
}

export function Header({ onStartAssessment }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1c263c] bg-[#07090e]/85 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                Job<span className="text-blue-500">Hai</span>
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-400 border-blue-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                Pay Only When Placed
              </Badge>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="hover:text-white transition-colors">
              Testimonials
            </a>
            <a href="#placement-terms" className="hover:text-white transition-colors flex items-center gap-1.5 text-emerald-400">
              <Coins className="w-3.5 h-3.5" />
              Pay-After-Placement
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Button 
              size="sm" 
              onClick={onStartAssessment}
              className="text-xs font-semibold px-4.5 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-200" />
              Take Free Assessment
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-b border-[#1c263c] bg-[#0c111d] px-4 py-5 space-y-3.5 text-sm font-medium">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block py-1 text-slate-300 hover:text-white">How It Works</a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)} className="block py-1 text-slate-300 hover:text-white">Alumni Testimonials</a>
          <a href="#placement-terms" onClick={() => setMenuOpen(false)} className="block py-1 text-emerald-400 font-semibold">Pay-After-Placement Terms</a>
          <a href="#faq" onClick={() => setMenuOpen(false)} className="block py-1 text-slate-300 hover:text-white">FAQ</a>
          <div className="pt-2 border-t border-slate-800">
            <Button 
              onClick={() => { setMenuOpen(false); onStartAssessment(); }}
              className="w-full text-xs font-semibold h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md"
            >
              Sign Up &amp; Take Assessment (Free) &rarr;
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
