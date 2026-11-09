"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { MuiHeader } from "@/components/mui/MuiHeader";
import { MuiHero } from "@/components/mui/MuiHero";
import { MuiHowItWorks } from "@/components/mui/MuiHowItWorks";
import { MuiPlacementGuarantee } from "@/components/mui/MuiPlacementGuarantee";
import { MuiFaq } from "@/components/mui/MuiFaq";
import { MuiFooter } from "@/components/mui/MuiFooter";
import { MuiOnboardingModal, CandidateOnboardingData } from "@/components/mui/MuiOnboardingModal";
import { MuiProctoredAssessmentModal } from "@/components/mui/MuiProctoredAssessmentModal";
import { MuiProfileModal, CandidateProfileData } from "@/components/mui/MuiProfileModal";
import { MuiAuthModal } from "@/components/mui/MuiAuthModal";
import { MuiWhatsAppButton } from "@/components/mui/MuiWhatsAppButton";
import { supabase } from "@/lib/supabaseClient";
import { fetchCandidateProfile, signOutCandidate } from "@/lib/candidateService";

export default function HomePage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [candidateData, setCandidateData] = useState<CandidateProfileData | null>(null);
  const [currentUser, setCurrentUser] = useState<CandidateProfileData | null>(null);

  // Sync Supabase Auth session & profile
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchCandidateProfile(session.user.id).then((profile) => {
          setCurrentUser(profile || { email: session.user.email, id: session.user.id });
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchCandidateProfile(session.user.id).then((profile) => {
          setCurrentUser(profile || { email: session.user.email, id: session.user.id });
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleOpenSignup = () => {
    setIsOnboardingOpen(true);
  };

  const handleOpenSignIn = () => {
    setIsAuthOpen(true);
  };

  // Candidate must login or signup to access the test.
  // Clicking "Take Assessment" opens profile if logged in, or prompts login/signup if not.
  const handleOpenAssessment = () => {
    if (currentUser) {
      setCandidateData(currentUser);
      setIsProfileOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleSignOut = async () => {
    await signOutCandidate();
    setCurrentUser(null);
  };

  // On login: update user, close auth, open profile screen
  const handleUserSignedIn = (profile: CandidateProfileData | null) => {
    setCurrentUser(profile);
    setIsAuthOpen(false);
    setIsProfileOpen(true);
  };

  // On signup finished: go directly to profile screen
  const handleOnboardingSignupCompleted = (data: CandidateProfileData | CandidateOnboardingData) => {
    setCurrentUser(data as CandidateProfileData);
    setCandidateData(data as CandidateProfileData);
    setIsOnboardingOpen(false);
    setIsProfileOpen(true);
  };

  // If user finishes signup, route them directly to their profile screen to review details before taking test
  const handleOnboardingAndStartTest = (data: CandidateProfileData | CandidateOnboardingData) => {
    setCurrentUser(data as CandidateProfileData);
    setCandidateData(data as CandidateProfileData);
    setIsOnboardingOpen(false);
    setIsProfileOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top Corporate App Bar with Profile & Auth support */}
      <MuiHeader
        onStartAssessment={handleOpenAssessment}
        onOpenSignup={handleOpenSignup}
        currentUser={currentUser}
        onOpenSignIn={handleOpenSignIn}
        onSignOut={handleSignOut}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Simple Landing Hero with separated Signup & Assessment actions */}
        <MuiHero
          onOpenSignup={handleOpenSignup}
          onStartAssessment={handleOpenAssessment}
        />

        {/* Winding Highway Candidate Journey Roadmap */}
        <MuiHowItWorks onStartVerification={handleOpenSignup} />

        {/* Performance Placement Guarantee & Cohort Bands */}
        <MuiPlacementGuarantee onStartAssessment={handleOpenAssessment} />

        {/* Essential FAQ Accordion */}
        <MuiFaq />
      </Box>

      {/* Corporate Minimalist Footer */}
      <MuiFooter />

      {/* Floating WhatsApp Support Action */}
      <MuiWhatsAppButton />

      {/* Candidate Profile Dialog: KPI Metrics, Progress Bars & All Previous Test Attempts */}
      <MuiProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        candidateProfile={currentUser}
        onRetakeTest={(data) => {
          setCandidateData(data);
          setIsProfileOpen(false);
          setIsAssessmentOpen(true);
        }}
        onSignOut={handleSignOut}
      />

      {/* Candidate Sign In Dialog -> On login automatically opens Profile Screen */}
      <MuiAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSignedIn={handleUserSignedIn}
        onSwitchToSignUp={() => {
          setIsAuthOpen(false);
          setIsOnboardingOpen(true);
        }}
      />

      {/* Onboarding Dialog: Info -> Live Photo ID -> Resume Upload -> Account Creation */}
      <MuiOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompleteSignup={handleOnboardingSignupCompleted}
        onCompleteAndStartTest={handleOnboardingAndStartTest}
      />

      {/* Strict Proctored Assessment Room: Camera PIP, Anti-Cheating & Results */}
      <MuiProctoredAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        candidateData={candidateData || currentUser}
        onViewProfile={() => {
          setIsAssessmentOpen(false);
          setIsProfileOpen(true);
        }}
      />
    </Box>
  );
}
