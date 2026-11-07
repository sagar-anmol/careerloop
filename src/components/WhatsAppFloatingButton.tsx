"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloatingButton() {
  const message = encodeURIComponent("Hello JobHai, I want to inquire about the skill assessment, ₹5,000 course training, and guaranteed HR interview calls.");
  const whatsappUrl = `https://wa.me/918789970312?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Admissions & Placement on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-110 active:scale-95 group"
    >
      <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
