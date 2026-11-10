"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SchoolIcon from "@mui/icons-material/School";
import ConstructionIcon from "@mui/icons-material/Construction";
import EngineeringIcon from "@mui/icons-material/Engineering";

interface MuiPlacementGuaranteeProps {
  onStartAssessment: () => void;
}

export function MuiPlacementGuarantee({ onStartAssessment }: MuiPlacementGuaranteeProps) {
  const tiers = [
    {
      tier: "Technical & Operations Roles",
      qualification: "Technical certifications, skilled trades & operations",
      packageRange: "Competitive Industry CTC",
      rangeSub: "Indicative band: Standard base pay + applicable shift allowances (set by hiring employer)",
      icon: <ConstructionIcon sx={{ color: "#d97706", fontSize: 24 }} />,
      feeNote: "Program Fee: ₹5,000 for Mock Tests, Multi-Attempt Certification & Dossier Generation. Interview routing is complimentary.",
      features: [
        "Structured domain mock tests & hands-on readiness modules",
        "Multiple proctored final attempts with best-score selection",
        "Verified dossier routing to partner industrial & enterprise recruiters",
        "Transparent evaluation and interview scheduling workflow",
      ],
      popular: false,
    },
    {
      tier: "Specialized Associates & Engineers",
      qualification: "Core technical domains, applied technology & specialists",
      packageRange: "High-Growth Packages",
      rangeSub: "Indicative band: Competitive base + performance & shift incentives (set by hiring employer)",
      icon: <EngineeringIcon sx={{ color: "#405FE2", fontSize: 24 }} />,
      feeNote: "Program Fee: ₹5,000 for Mock Tests, Multi-Attempt Certification & Dossier Generation. Interview routing is complimentary.",
      features: [
        "Advanced mock tests tailored for QA, technical operations & engineering",
        "Matched with partner companies offering standard overtime & shift bonuses",
        "Opportunities at corporate facilities with commute & meal amenities",
        "Direct profile visibility across 450+ partner recruitment agencies",
      ],
      popular: true,
    },
    {
      tier: "Graduates & Advanced Specialists",
      qualification: "Degree graduates, engineering disciplines & management trainees",
      packageRange: "Premium Enterprise Band",
      rangeSub: "Indicative band: Market-standard CTC + growth incentives (set by hiring employer)",
      icon: <SchoolIcon sx={{ color: "#15803d", fontSize: 24 }} />,
      feeNote: "Program Fee: ₹5,000 for Mock Tests, Multi-Attempt Certification & Dossier Generation. Interview routing is complimentary.",
      features: [
        "Evaluations designed for graduate engineer & associate trainee tracks",
        "Profile routing to top-tier corporations & high-growth employers",
        "Matched with enterprises offering standard statutory & health benefits",
        "Dedicated dossier support from skill evaluation to interview scheduling",
      ],
      popular: false,
    },
  ];

  return (
    <Box
      id="pricing-terms"
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip
            icon={<ShieldOutlinedIcon style={{ fontSize: 16, color: "#15803d" }} />}
            label="CareerLoop Pro Program Guarantee"
            size="small"
            variant="outlined"
            sx={{
              mb: 2,
              borderColor: "rgba(21, 128, 61, 0.35)",
              bgcolor: "rgba(21, 128, 61, 0.08)",
              color: "#15803d",
              fontWeight: 600,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.5rem" },
              fontWeight: 800,
              mb: 1.5,
              color: "text.primary",
            }}
          >
            Complete Mock Test Series &amp; Multi-Attempt Proctored Certification (₹5,000)
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 720,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Enroll in the CareerLoop Pro Program to unlock unlimited mock tests, multiple final proctored test attempts (best score selected), and certified dossier generation. Complimentary interview routing is included for all certified candidates.
          </Typography>
        </Box>

        {/* 3 Qualification Cohort Cards - Compensation Bands */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {tiers.map((item, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 3, sm: 3.5 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "background.paper",
                  borderRadius: 3,
                  position: "relative",
                  borderColor: item.popular ? "primary.main" : "divider",
                  borderWidth: item.popular ? 2 : 1,
                  boxShadow: item.popular
                    ? "0 8px 24px rgba(64, 95, 226, 0.14)"
                    : "0 2px 8px rgba(64, 95, 226, 0.04)",
                }}
              >
                {item.popular && (
                  <Chip
                    label="Most In-Demand"
                    color="primary"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontWeight: 700,
                      fontSize: "0.72rem",
                    }}
                  />
                )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.5 }}>
                  {item.icon}
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.1rem" }}>
                    {item.tier}
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ color: "text.secondary", mb: 2, display: "block" }}>
                  {item.qualification}
                </Typography>

                {/* Compensation Band Box */}
                <Box
                  sx={{
                    my: 1.5,
                    p: 2.2,
                    borderRadius: 2,
                    bgcolor: "rgba(64, 95, 226, 0.06)",
                    border: "1px solid rgba(64, 95, 226, 0.18)",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, display: "block", letterSpacing: "0.06em" }}>
                    INDICATIVE EMPLOYER BAND
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#405FE2", my: 0.5 }}>
                    {item.packageRange}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block" }}>
                    {item.rangeSub}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, fontSize: "0.82rem", lineHeight: 1.5 }}>
                  {item.feeNote}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Legal & Compliance Alert */}
        <Alert
          icon={<HandshakeIcon fontSize="inherit" />}
          severity="info"
          variant="outlined"
          sx={{
            borderColor: "rgba(64, 95, 226, 0.35)",
            bgcolor: "rgba(64, 95, 226, 0.06)",
            color: "text.primary",
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Our 100% Program &amp; Service Delivery Promise:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The ₹5,000 program fee covers the delivery of mock test series, study material, multiple proctored final exam attempts, and certified dossier generation. Interview routing is provided as a complimentary placement assistance benefit. Final hiring decisions and CTC packages rest solely with the respective hiring employers.
          </Typography>
        </Alert>

        {/* CTA Banner */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onStartAssessment}
            sx={{ px: 4, py: 1.5, fontWeight: 700 }}
          >
            Enroll in CareerLoop Pro (₹5,000)
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
