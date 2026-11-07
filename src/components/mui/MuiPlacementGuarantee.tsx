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
      tier: "ITI Technical Cohort",
      qualification: "Fitter / Turner / Machinist / Electrician (NAPS)",
      packageRange: "Avg. ₹2.4 LPA",
      rangeSub: "Base + Govt. DBT | With Overtime: Up to ₹2.9 LPA",
      icon: <ConstructionIcon sx={{ color: "#d97706", fontSize: 24 }} />,
      feeNote: "Nominal fee for assessment & review is payable only once you receive an interview call or offer letter.",
      features: [
        "CNC / VMC machining & assembly line training",
        "Direct Benefit Transfer (DBT) government subsidy",
        "Subsidized canteen & free fleet transportation",
        "100% direct enterprise onboarding without middleman fees",
      ],
      popular: false,
    },
    {
      tier: "Diploma Engineering Cohort",
      qualification: "Mechanical / Electrical / Automobile / Applied Tech (NATS)",
      packageRange: "Avg. ₹3.2 LPA",
      rangeSub: "Base + Govt. DBT | With Overtime: Up to ₹4.0 LPA",
      icon: <EngineeringIcon sx={{ color: "#405FE2", fontSize: 24 }} />,
      feeNote: "Nominal fee for assessment & review is payable only once you receive an interview call or offer letter.",
      features: [
        "Quality control, operational testing & automation maintenance",
        "Double overtime or ₹125–₹142/hr overtime allowances",
        "Designated bus commute network & subsidized canteen meals",
        "1 Month paid annual leave at top partner enterprises",
      ],
      popular: true,
    },
    {
      tier: "Degree & Graduate Cohort",
      qualification: "B.E. / B.Tech (Mechanical / Auto) & Graduates (BA/B.Sc/B.Com)",
      packageRange: "Avg. ₹3.6 LPA",
      rangeSub: "Base + Govt. DBT | With Overtime: Up to ₹4.5 LPA",
      icon: <SchoolIcon sx={{ color: "#15803d", fontSize: 24 }} />,
      feeNote: "Nominal fee for assessment & review is payable only once you receive an interview call or offer letter.",
      features: [
        "High-growth engineering & advanced technology enterprises",
        "Fast-track supervisory & engineering trainee assignments",
        "Full Workmen Compensation Insurance (WCI) coverage",
        "Dedicated placement coordinator from onboarding to joining",
      ],
      popular: false,
    },
  ];

  return (
    <Box
      id="placement-terms"
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
            label="Zero Risk Candidate Promise"
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
            ₹0 Upfront. Nominal Fee Only Upon Interview or Offer Letter.
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
            There are zero upfront registration or testing charges. <strong>Nominal fee for assessment & review is payable only once you receive an interview call or offer letter.</strong>
          </Typography>
        </Box>

        {/* 3 Qualification Cohort Cards - Annual Avg CTC Only */}
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

                {/* Annual Average CTC Box (Only Annual Avg Mentioned) */}
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
                    ANNUAL AVERAGE CTC
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#405FE2", my: 0.5 }}>
                    {item.packageRange}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block" }}>
                    {item.rangeSub}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ my: 1.5 }}>
                  {item.feeNote}
                </Typography>

                <Box sx={{ mt: "auto", pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary", display: "block", mb: 1.5, letterSpacing: "0.05em" }}>
                    WHAT’S INCLUDED:
                  </Typography>
                  {item.features.map((feat, fIdx) => (
                    <Box key={fIdx} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1.2 }}>
                      <CheckCircleIcon sx={{ fontSize: 17, color: "#15803d", mt: 0.2, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.primary">
                        {feat}
                      </Typography>
                    </Box>
                  ))}
                </Box>
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
            Our 100% Risk-Free Candidate Promise:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Taking the proctored test and having your skills reviewed involves <strong>₹0 advance payment</strong>. <strong>Nominal fee for assessment & review is payable only once you receive an interview call or offer letter.</strong> If you do not receive an interview or offer letter, you owe exactly ₹0.
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
            Create Free Profile & Take Skill Assessment
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
