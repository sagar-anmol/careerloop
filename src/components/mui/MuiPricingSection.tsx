"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StarIcon from "@mui/icons-material/Star";
import HandshakeIcon from "@mui/icons-material/Handshake";

interface MuiPricingSectionProps {
  onEnroll?: () => void;
}

export function MuiPricingSection({ onEnroll }: MuiPricingSectionProps) {
  const deliverables = [
    "Unlimited access to Weekly Mock Test Series",
    "Live Expert Mentorship & Interview Prep Sessions",
    "Professional Resume Analysis & Curation by our Team",
    "Performance tracking based on peak mock marks",
    "Complimentary Direct Referrals to 450+ Fast-Hiring HR Agencies",
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
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Chip
            icon={<ShieldOutlinedIcon style={{ fontSize: 16, color: "#15803d" }} />}
            label="CareerLoop Pro Pass"
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
              fontSize: { xs: "1.75rem", sm: "2.4rem" },
              fontWeight: 800,
              mb: 1.5,
              color: "text.primary",
            }}
          >
            One-Time Access Fee for Full Program &amp; Referral Support
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 680,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            One flat fee unlocks your complete access pass. Covers weekly mocks, live mentorship, expert resume curation, performance tracking, and active HR referral dispatch.
          </Typography>
        </Box>

        {/* Pricing Card */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: 4,
            borderColor: "primary.main",
            borderWidth: 2,
            boxShadow: "0 12px 36px rgba(64, 95, 226, 0.12)",
            bgcolor: "#ffffff",
            position: "relative",
            mb: 4,
          }}
        >
          <Chip
            icon={<StarIcon sx={{ fontSize: 14, color: "#ffffff !important" }} />}
            label="All-Access Pass"
            color="primary"
            size="small"
            sx={{
              position: "absolute",
              top: -14,
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: 800,
              px: 1.5,
              py: 0.5,
              fontSize: "0.75rem",
              boxShadow: "0 4px 12px rgba(64, 95, 226, 0.4)",
            }}
          />

          <Box sx={{ textAlign: "center", pb: 3, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
              CareerLoop Pro All-Access Pass
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              One-Time Payment (Lifetime Portal &amp; Program Access)
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 1 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, color: "primary.main", fontSize: { xs: "2.5rem", sm: "3.25rem" } }}>
                ₹5,000
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                net all-inclusive
              </Typography>
            </Box>
          </Box>

          {/* Deliverables List */}
          <Box sx={{ py: 3.5, display: "flex", flexDirection: "column", gap: 1.8 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "0.04em" }}>
              PROGRAM DELIVERABLES INCLUDED:
            </Typography>
            {deliverables.map((item, dIdx) => (
              <Box key={dIdx} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: "#10b981", mt: 0.2, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600, lineHeight: 1.5 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={onEnroll}
            sx={{
              py: 1.7,
              fontSize: "1.08rem",
              fontWeight: 800,
              borderRadius: 2.5,
              boxShadow: "0 6px 20px rgba(64, 95, 226, 0.4)",
              "&:hover": {
                bgcolor: "#2843be",
                boxShadow: "0 8px 24px rgba(64, 95, 226, 0.6)",
              },
            }}
          >
            Enroll &amp; Secure Your Pass (₹5,000)
          </Button>
        </Paper>

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
