"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

export function MuiPerksSection() {
  const perks = [
    {
      icon: <DirectionsBusIcon sx={{ fontSize: 28, color: "#405FE2" }} />,
      title: "Fleet Bus Transportation",
      description:
        "Complied company bus transportation covering major city routes and key pickup points directly to workplace facilities.",
      tag: "Free / Subsidized",
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 28, color: "#d97706" }} />,
      title: "Subsidized On-Site Canteens",
      description:
        "Nutritious, hot breakfast, lunch, and meal services provided within company premises during standard shift cycles.",
      tag: "Subsidized Meals",
    },
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 28, color: "#15803d" }} />,
      title: "Direct Benefit Transfer (DBT)",
      description:
        "Government stipends (₹1,500 – ₹6,150) under NAPS/NATS disbursed directly into your verified bank account via national apprenticeship portals.",
      tag: "Govt. Backed",
    },
    {
      icon: <MoreTimeIcon sx={{ fontSize: 28, color: "#405FE2" }} />,
      title: "Guaranteed Overtime Pay",
      description:
        "Earn significant extra monthly income with fixed hourly overtime allowances ranging from ₹125/hr to ₹142/hr and double overtime provisions.",
      tag: "₹125 – ₹142 / hr",
    },
    {
      icon: <HealthAndSafetyIcon sx={{ fontSize: 28, color: "#405FE2" }} />,
      title: "Workmen Compensation (WCI)",
      description:
        "Comprehensive workplace safety coverage, workmen compensation insurance (WCI), and modern personal protective equipment (PPE) provided.",
      tag: "100% Insured",
    },
    {
      icon: <EventAvailableIcon sx={{ fontSize: 28, color: "#405FE2" }} />,
      title: "Paid Annual Leave",
      description:
        "Eligible cohorts receive up to 1 month paid leave benefits alongside regular weekly rotational off days.",
      tag: "Up to 1 Month",
    },
  ];

  return (
    <Box
      id="perks"
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(64, 95, 226, 0.04)",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip
            icon={<CardGiftcardIcon style={{ fontSize: 16, color: "#405FE2" }} />}
            label="Workplace Amenities & Candidate Welfare"
            size="small"
            variant="outlined"
            sx={{
              mb: 2,
              borderColor: "rgba(64, 95, 226, 0.35)",
              bgcolor: "rgba(64, 95, 226, 0.08)",
              color: "#2843be",
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
            What You Get: <span style={{ color: "#405FE2" }}>Workplace Perks & Benefits</span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 640,
              mx: "auto",
            }}
          >
            Every enterprise opportunity verified through JobHai comes with comprehensive workplace amenities designed for safety, comfort, and financial growth.
          </Typography>
        </Box>

        {/* 6 Perks Grid */}
        <Grid container spacing={3}>
          {perks.map((item, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "#ffffff",
                  borderRadius: 3,
                  borderColor: "rgba(64, 95, 226, 0.16)",
                  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(64, 95, 226, 0.14)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      bgcolor: "rgba(64, 95, 226, 0.08)",
                      border: "1px solid rgba(64, 95, 226, 0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Chip
                    label={item.tag}
                    size="small"
                    sx={{
                      bgcolor: "rgba(64, 95, 226, 0.1)",
                      color: "#2843be",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", mb: 1, fontSize: "1.05rem" }}>
                  {item.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, flexGrow: 1 }}>
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
