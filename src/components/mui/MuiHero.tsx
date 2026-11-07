"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SecurityIcon from "@mui/icons-material/Security";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

interface MuiHeroProps {
  onStartAssessment: () => void;
}

export function MuiHero({ onStartAssessment }: MuiHeroProps) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        minHeight: { xs: 540, md: 520 },
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
          {/* Main Title - Premier on its own line */}
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
            Verified Technical Assessment.
            <Box component="span" sx={{ display: "block" }}>
              Premier Enterprise Roles.
            </Box>
            <Box component="span" sx={{ color: "#60a5fa", display: "block" }}>
              Pay Only When Placed.
            </Box>
          </Typography>

          {/* Subtitle - Punchy & concise */}
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
            JobHai matches ITI, Diploma, and Graduate Engineering candidates with leading companies across top industry sectors. Average packages of <strong style={{ color: "#ffffff" }}>₹2.4L to ₹4.5L CTC</strong> with Government DBT support, free bus commute, and subsidized meals. <strong style={{ color: "#ffffff" }}>Zero upfront fees</strong>—nominal fee for assessment &amp; review is payable only once you receive an interview call or offer letter.
          </Typography>

          {/* Call to Action Button */}
          <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" }, mb: 3.5 }}>
            <Button
              variant="contained"
              size="large"
              onClick={onStartAssessment}
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.3,
                px: 4,
                fontSize: "1rem",
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
              Sign Up &amp; Take Free Assessment
            </Button>
          </Box>

          {/* Clean Value Props - No background circle/container */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-start" },
              gap: { xs: 1.5, sm: 2.5 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <MonetizationOnIcon sx={{ color: "#22c55e", fontSize: 19 }} />
              <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                ₹0 Upfront Cost
              </Typography>
            </Box>

            <Box
              sx={{
                width: 1,
                height: 14,
                bgcolor: "rgba(255, 255, 255, 0.3)",
                display: { xs: "none", sm: "block" },
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <SecurityIcon sx={{ color: "#60a5fa", fontSize: 19 }} />
              <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                Avg. ₹2.4L – ₹4.5L CTC
              </Typography>
            </Box>

            <Box
              sx={{
                width: 1,
                height: 14,
                bgcolor: "rgba(255, 255, 255, 0.3)",
                display: { xs: "none", sm: "block" },
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <VerifiedUserIcon sx={{ color: "#60a5fa", fontSize: 19 }} />
              <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                Free Bus &amp; Subsidized Canteen
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
