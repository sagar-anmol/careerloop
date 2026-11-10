"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface MuiHeroProps {
  onOpenSignup: () => void;
  onStartAssessment: () => void;
}

export function MuiHero({ onOpenSignup, onStartAssessment }: MuiHeroProps) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, sm: 10, md: 14, lg: 16 },
        minHeight: { xs: "calc(100vh - 70px)", md: "calc(100vh - 70px)" },
        "@supports (min-height: 100dvh)": {
          minHeight: { xs: "calc(100dvh - 70px)", md: "calc(100dvh - 70px)" },
        },
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        alignItems: "center",
        backgroundImage: {
          xs: `linear-gradient(180deg, rgba(8, 20, 58, 0.85) 0%, rgba(8, 20, 58, 0.55) 32%, rgba(8, 20, 58, 0.88) 65%, rgba(8, 20, 58, 0.98) 100%), url("/hero-banner-mobile.jpg")`,
          md: `linear-gradient(90deg, rgba(8, 20, 58, 0.97) 0%, rgba(8, 20, 58, 0.90) 42%, rgba(8, 20, 58, 0.3) 65%, transparent 80%), url("/hero-banner.jpg")`,
        },
        backgroundSize: "cover",
        backgroundPosition: { xs: "center 10%", md: "center right" },
        backgroundRepeat: "no-repeat",
        borderBottom: "1px solid",
        borderColor: "rgba(64, 95, 226, 0.2)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            maxWidth: { xs: "100%", md: 620 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "1.95rem", sm: "2.55rem", md: "3rem" },
              lineHeight: 1.18,
              fontWeight: 800,
              color: "#ffffff",
              mb: 2,
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            Weekly Mocks. Expert Mentorship.
            <Box component="span" sx={{ display: "block" }}>
              Direct HR &amp; Agency Referrals.
            </Box>
            <Box component="span" sx={{ color: "#60a5fa", display: "block" }}>
              Accelerate Your Career Today.
            </Box>
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              color: "#e2e8f0",
              fontSize: { xs: "0.92rem", sm: "1.02rem" },
              lineHeight: 1.55,
              mb: 3.5,
              maxWidth: 580,
              textShadow: "0 1px 6px rgba(0, 0, 0, 0.4)",
            }}
          >
            Join CareerLoop Pro to access weekly mock tests, live mentorship sessions, and expert resume optimization. Our team analyzes your performance metrics and routes your verified candidate dossier directly to 450+ fast-hiring HR agencies and corporate employers.
          </Typography>

          {/* Call to Action Buttons (Separated Signup & Assessment) */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
            <Button
              variant="contained"
              size="large"
              onClick={onOpenSignup}
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1.02rem",
                fontWeight: 700,
                bgcolor: "#405FE2",
                color: "#ffffff",
                boxShadow: "0 6px 20px rgba(64, 95, 226, 0.5)",
                "&:hover": {
                  bgcolor: "#2843be",
                  boxShadow: "0 8px 24px rgba(64, 95, 226, 0.7)",
                },
              }}
            >
              Unlock CareerLoop Pro
            </Button>
            <Button
              variant="outlined"
              size="large"
              component="a"
              href="#roadmap"
              sx={{
                py: 1.5,
                px: 3.5,
                fontSize: "1.02rem",
                fontWeight: 700,
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.4)",
                bgcolor: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(6px)",
                "&:hover": {
                  borderColor: "#ffffff",
                  bgcolor: "rgba(255, 255, 255, 0.18)",
                },
              }}
            >
              Explore Weekly Schedule
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
