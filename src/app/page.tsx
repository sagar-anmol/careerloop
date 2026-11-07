"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import { MuiHeader } from "@/components/mui/MuiHeader";
import { MuiHero } from "@/components/mui/MuiHero";
import { MuiHowItWorks } from "@/components/mui/MuiHowItWorks";
import { MuiPerksSection } from "@/components/mui/MuiPerksSection";
import { MuiPlacementGuarantee } from "@/components/mui/MuiPlacementGuarantee";
import { MuiFaq } from "@/components/mui/MuiFaq";
import { MuiFooter } from "@/components/mui/MuiFooter";
import { MuiOnboardingModal } from "@/components/mui/MuiOnboardingModal";
import { MuiProctoredAssessmentModal } from "@/components/mui/MuiProctoredAssessmentModal";
import { MuiWhatsAppButton } from "@/components/mui/MuiWhatsAppButton";

export default function HomePage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [candidateData, setCandidateData] = useState<any>(null);

  const handleOpenSignup = () => {
    setIsOnboardingOpen(true);
  };

  const handleOnboardingCompleted = (data: any) => {
    setCandidateData(data);
    setIsOnboardingOpen(false);
    setIsAssessmentOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top Corporate App Bar */}
      <MuiHeader onStartAssessment={handleOpenSignup} />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Simple Landing Hero (Zero inputs, clean enterprise value props) */}
        <MuiHero onStartAssessment={handleOpenSignup} />

        {/* Winding Highway Candidate Journey Roadmap (matching user's diagram) */}
        <MuiHowItWorks onStartVerification={handleOpenSignup} />

        {/* Workplace Amenities & Candidate Perks (Bus Commute, Canteen, DBT, Overtime, WCI) */}
        <MuiPerksSection />

        {/* ₹0 Upfront Pay-After-Placement Guarantee & Cohort Stipends (ITI, Diploma, Degree) */}
        <MuiPlacementGuarantee onStartAssessment={handleOpenSignup} />

        {/* Essential FAQ Accordion */}
        <MuiFaq />
      </Box>

      {/* Corporate Minimalist Footer */}
      <MuiFooter />

      {/* Floating WhatsApp Support Action */}
      <MuiWhatsAppButton />

      {/* Onboarding Dialog: Info -> Live Photo ID -> Resume Upload -> Account Creation */}
      <MuiOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompleteAndStartTest={handleOnboardingCompleted}
      />

      {/* Strict Proctored Assessment Room: Camera PIP, No Backspace, No Back Button, Tab Detection */}
      <MuiProctoredAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        candidateData={candidateData}
      />
    </Box>
  );
}
