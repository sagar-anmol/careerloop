"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StarIcon from "@mui/icons-material/Star";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SchoolIcon from "@mui/icons-material/School";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

interface MuiPricingSectionProps {
  onEnroll?: () => void;
  /** When provided, clicking a paid plan starts the UPI flow for that plan
   *  instead of just opening the signup modal. The "Custom" plan still calls
   *  onEnroll (its price is negotiated, not a fixed UPI amount). */
  onSelectPlan?: (plan: "starter_practice" | "pro_all_access" | "mentorship_1on1") => void;
}

// Maps each priced card to its server plan key. "Custom" has no key by design.
const PLAN_KEYS: Record<string, "starter_practice" | "pro_all_access" | "mentorship_1on1"> = {
  "₹999": "starter_practice",
  "₹4,999": "pro_all_access",
  "₹8,999": "mentorship_1on1",
};

export function MuiPricingSection({ onEnroll, onSelectPlan }: MuiPricingSectionProps) {
  const plans = [
    {
      name: "Starter Practice Pass",
      badge: "Foundational",
      badgeColor: "default" as const,
      isFeatured: false,
      price: "₹999",
      billingSubtitle: "",
      inherits: "",
      description: "A low-cost entry pack to experience CareerLoop before committing. Upgrade to Pro or 1-on-1 anytime for the full programme.",
      deliverables: [
        "Basic version of limited tests — for practice & benchmarking",
        "Standard Resume Diagnostic Checklist",
        "Community Q&A and Knowledge Base Access",
        "Complimentary Direct Referrals to 450+ Fast-Hiring HR Agencies — free",
      ],
      buttonLabel: "Get Starter Pass (₹999)",
      buttonVariant: "outlined" as const,
    },
    {
      name: "CareerLoop Pro All-Access Pass",
      badge: "Most Popular • All-Access",
      badgeColor: "primary" as const,
      isFeatured: true,
      price: "₹4,999",
      billingSubtitle: "",
      inherits: "Everything in the Starter Practice Pass, plus:",
      description: "Complete career acceleration pass. Covers weekly mocks, live mentorship, expert resume curation, and direct HR referral dispatch.",
      deliverables: [
        "Unlimited access to Weekly Mock Test Series",
        "Live Expert Mentorship & Interview Prep Sessions",
        "Professional Resume Analysis & Curation by our Team",
        "Performance tracking based on peak mock marks",
      ],
      buttonLabel: "Enroll & Secure Your Pass (₹4,999)",
      buttonVariant: "contained" as const,
    },
    {
      name: "1-on-1 Intensive Mentorship Track",
      badge: "1-on-1 Mentorship",
      badgeColor: "warning" as const,
      isFeatured: false,
      price: "₹8,999",
      billingSubtitle: "Dedicated Placement Advisory Track",
      inherits: "Everything in the CareerLoop Pro All-Access Pass, plus:",
      description: "For specialists, graduates, and professionals seeking dedicated 1-on-1 interview drills, custom company targeting, and executive resume overhaul.",
      deliverables: [
        "Dedicated 1-on-1 Senior Industry Mock Interviews",
        "Tailored ATS Resume Customization for Target Companies",
        "Priority Fast-Track Dispatch to Enterprise HR Recruiters",
        "Post-Interview Debrief & Offer Negotiation Guidance",
      ],
      buttonLabel: "Join 1-on-1 Track",
      buttonVariant: "outlined" as const,
    },
    {
      name: "For Placement Cells & Organisations",
      badge: "Colleges & Companies",
      badgeColor: "success" as const,
      isFeatured: false,
      price: "Custom",
      billingSubtitle: "Institutional & Bulk Hiring Cohorts",
      inherits: "Everything in the 1-on-1 Intensive Mentorship Track, plus:",
      description: "Customized assessment suites, campus placement acceleration, dedicated drive coordination, and volume candidate referrals tailored for colleges and enterprise hiring teams.",
      deliverables: [
        "Dedicated institutional proctored testing portal",
        "Custom domain mock series tailored to partner employers",
        "Bulk verified dossier exports & analytics dashboard",
        "Co-branded campus recruitment & agency dispatch drives",
        "Dedicated placement account manager & support team",
      ],
      buttonLabel: "Contact for Custom Quote",
      buttonVariant: "outlined" as const,
    },
  ];

  return (
    <Box
      id="pricing"
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: "#f8fafc",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", sm: "2.6rem" },
              fontWeight: 800,
              color: "text.primary",
              letterSpacing: "-0.02em",
            }}
          >
            Our Prices
          </Typography>
        </Box>

        {/* 4 Pricing Cards Grid - Fully Responsive */}
        <Grid container spacing={{ xs: 2.5, sm: 3 }} sx={{ mb: 5, alignItems: "stretch" }}>
          {plans.map((plan, idx) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx} sx={{ display: "flex" }}>
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2.5, sm: 3, md: 3.5 },
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3.5,
                  bgcolor: "#ffffff",
                  position: "relative",
                  borderColor: plan.isFeatured ? "primary.main" : "divider",
                  borderWidth: plan.isFeatured ? 2.5 : 1,
                  boxShadow: plan.isFeatured
                    ? "0 12px 36px rgba(64, 95, 226, 0.16)"
                    : "0 4px 16px rgba(0, 0, 0, 0.04)",
                  transform: plan.isFeatured ? { lg: "scale(1.02)" } : "none",
                  zIndex: plan.isFeatured ? 2 : 1,
                  transition: "all 0.25s ease-in-out",
                }}
              >
                {/* Highlight Badge */}
                <Chip
                  icon={plan.isFeatured ? <StarIcon sx={{ fontSize: 13, color: "#ffffff !important" }} /> : undefined}
                  label={plan.badge}
                  color={plan.badgeColor}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -13,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    px: 1,
                  }}
                />

                {/* Plan Header */}
                <Box sx={{ textAlign: "center", pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "text.primary",
                      mb: 0.5,
                      fontSize: { xs: "1rem", sm: "1.05rem" },
                      minHeight: { sm: 48, lg: 52 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {plan.name}
                  </Typography>
                  {plan.billingSubtitle && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mb: 1.5,
                        fontSize: "0.72rem",
                        minHeight: 32,
                      }}
                    >
                      {plan.billingSubtitle}
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0.8 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        color: plan.isFeatured ? "primary.main" : "text.primary",
                        fontSize: { xs: "2rem", sm: "2.25rem", md: "2.4rem" },
                      }}
                    >
                      {plan.price}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.72rem" }}>
                      net all-inclusive
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    my: 2,
                    minHeight: { xs: "auto", sm: 54 },
                    fontSize: "0.82rem",
                    lineHeight: 1.5,
                  }}
                >
                  {plan.description}
                </Typography>

                {/* Deliverables List */}
                <Box sx={{ mb: 3, flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "0.04em", fontSize: "0.7rem" }}>
                    PROGRAM DELIVERABLES INCLUDED:
                  </Typography>
                  {plan.inherits && (
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.7,
                        borderRadius: 1.5,
                        bgcolor: plan.isFeatured ? "rgba(16, 185, 129, 0.10)" : "rgba(64, 95, 226, 0.07)",
                        border: "1px dashed",
                        borderColor: plan.isFeatured ? "rgba(16, 185, 129, 0.45)" : "rgba(64, 95, 226, 0.35)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 800,
                          color: plan.isFeatured ? "#047857" : "#405FE2",
                          fontSize: "0.72rem",
                          lineHeight: 1.35,
                          display: "block",
                        }}
                      >
                        {plan.inherits}
                      </Typography>
                    </Box>
                  )}
                  {plan.deliverables.map((item, dIdx) => (
                    <Box key={dIdx} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: plan.isFeatured ? "#10b981" : "#405FE2", mt: 0.2, flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 600, lineHeight: 1.45, fontSize: "0.75rem" }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* CTA Button */}
                <Button
                  variant={plan.buttonVariant}
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={() => {
                    const planKey = PLAN_KEYS[plan.price];
                    if (planKey && onSelectPlan) onSelectPlan(planKey);
                    else onEnroll?.();
                  }}
                  sx={{
                    py: 1.2,
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    borderRadius: 2.2,
                    boxShadow: plan.isFeatured ? "0 6px 20px rgba(64, 95, 226, 0.4)" : "none",
                    "&:hover": {
                      bgcolor: plan.isFeatured ? "#2843be" : undefined,
                    },
                  }}
                >
                  {plan.buttonLabel}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Compliance Note */}
        <Alert
          icon={<HandshakeIcon fontSize="inherit" />}
          severity="info"
          variant="outlined"
          sx={{
            borderColor: "rgba(64, 95, 226, 0.35)",
            bgcolor: "rgba(64, 95, 226, 0.06)",
            color: "text.primary",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Program Service &amp; Referral Disclosure:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Subscription fee covers preparation deliverables, mock infrastructure, and dossier optimization. Interview scheduling and placement assistance are provided as complimentary member benefits. Final hiring decisions rest with employers.
          </Typography>
        </Alert>
      </Container>
    </Box>
  );
}
