"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { MuiHeader } from "@/components/mui/MuiHeader";
import { MuiHero } from "@/components/mui/MuiHero";
import { MuiProgramFeatures } from "@/components/mui/MuiProgramFeatures";
import { MuiPricingSection } from "@/components/mui/MuiPricingSection";
import { MuiFaq } from "@/components/mui/MuiFaq";
import { MuiFooter } from "@/components/mui/MuiFooter";
import { MuiOnboardingModal } from "@/components/mui/MuiOnboardingModal";
import { MuiProctoredAssessmentModal } from "@/components/mui/MuiProctoredAssessmentModal";
import { MuiProfileModal, CandidateProfileData } from "@/components/mui/MuiProfileModal";
import { MuiAuthModal } from "@/components/mui/MuiAuthModal";
import Alert from "@mui/material/Alert";
import type { PlanKey } from "@/lib/payments/plans";
import { MuiWhatsAppButton } from "@/components/mui/MuiWhatsAppButton";
import { supabase } from "@/lib/supabaseClient";
import { fetchCandidateProfile, signOutCandidate, startPayuUpgradeCheckout } from "@/lib/candidateService";

export default function HomePage() {
  const router = useRouter();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  // Checkout-in-flight / failed PayU handoff error (shown as a floating alert).
  const [paymentError, setPaymentError] = useState<string | null>(null);
  // Plan preselected on the onboarding (enrollment) flow.
  const [onboardingPlan, setOnboardingPlan] = useState<PlanKey>("pro_all_access");
  const [candidateData, setCandidateData] = useState<CandidateProfileData | null>(null);
  const [currentUser, setCurrentUser] = useState<CandidateProfileData | null>(null);

  // Sync Supabase Auth session & profile
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchCandidateProfile(session.user.id, undefined, session.user.email).then((profile) => {
          setCurrentUser(profile || { email: session.user.email, id: session.user.id });
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchCandidateProfile(session.user.id, undefined, session.user.email).then((profile) => {
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
    setOnboardingPlan("pro_all_access");
    setIsOnboardingOpen(true);
  };

  const handleOpenSignIn = () => {
    setIsAuthOpen(true);
  };

  // A paid plan was chosen on the pricing grid. Already-signed-in users go
  // straight to PayU checkout (server-created order); signed-out visitors
  // enroll via onboarding (payment happens inside it, preselecting this plan).
  const handleSelectPlan = async (plan: PlanKey) => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      handleUpgrade(plan);
    } else {
      setOnboardingPlan(plan);
      setIsOnboardingOpen(true);
    }
  };

  // Signed-in upgrade (e.g. Starter → Pro): server-created PayU order, then the
  // browser hands off to PayU's hosted checkout.
  const handleUpgrade = (plan: PlanKey) => {
    setPaymentError(null);
    startPayuUpgradeCheckout(plan).catch((err: unknown) => {
      setPaymentError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
    });
  };

  // Candidate must login or signup to access the test.
  // Clicking "Take Assessment" opens profile page if logged in, or prompts login/signup if not.
  const handleOpenAssessment = () => {
    if (currentUser) {
      setCandidateData(currentUser);
      router.push("/profile");
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleSignOut = async () => {
    await signOutCandidate();
    setCurrentUser(null);
  };

  // On login: update user, close auth, go to the profile dashboard.
  const handleUserSignedIn = (profile: CandidateProfileData | null) => {
    setCurrentUser(profile);
    setIsAuthOpen(false);
    router.push("/profile");
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
        onOpenProfile={() => router.push("/profile")}
      />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Simple Landing Hero with separated Signup & Assessment actions */}
        <MuiHero
          onOpenSignup={handleOpenSignup}
          onStartAssessment={handleOpenAssessment}
        />

        {/* All-In-One Program Features */}
        <MuiProgramFeatures />

        {/* Pricing & Pro All-Access Pass */}
        <MuiPricingSection onEnroll={handleOpenSignup} onSelectPlan={handleSelectPlan} />

        {/* Essential FAQ Accordion */}
        <MuiFaq />
      </Box>

      {/* Corporate Minimalist Footer */}
      <MuiFooter />

      {/* Floating WhatsApp Support Action */}
      <MuiWhatsAppButton />

      {/* Ethora AI assistant — lander only. Docked right (bottom: 24, 56px),
          stacked below the WhatsApp FAB into one bottom-right cluster; the FAB
          keeps right: 24 at bottom: 96. Keeps both clear of each other. */}
      <Script
        id="chat-content-assistant"
        src="https://app.chat.ethora.com/widget/assistant-80bb8ba2.js"
        data-app-id="6af56e0f880b7097ec1e7ba0"
        data-api-base="https://api.chat.ethora.com/v1"
        data-position="right"
        strategy="afterInteractive"
      />

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

      {/* Onboarding Dialog: Info -> Live Photo ID -> Resume -> Payment (PayU) -> Done.
          Keyed by plan so picking a pricing card remounts the wizard with that plan preselected. */}
      <MuiOnboardingModal
        key={onboardingPlan}
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialPlan={onboardingPlan}
      />

      {/* Floating error for a failed PayU handoff (upgrade from pricing or gate). */}
      {paymentError && (
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setPaymentError(null)}
          sx={{ position: "fixed", top: 72, left: "50%", transform: "translateX(-50%)", zIndex: 2000, maxWidth: 480, width: "calc(100% - 32px)" }}
        >
          {paymentError}
        </Alert>
      )}

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
