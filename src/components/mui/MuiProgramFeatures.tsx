"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import QuizIcon from "@mui/icons-material/Quiz";
import DescriptionIcon from "@mui/icons-material/Description";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ShareIcon from "@mui/icons-material/Share";

export function MuiProgramFeatures() {
  const features = [
    {
      icon: <QuizIcon sx={{ fontSize: 32, color: "#405FE2" }} />,
      title: "Weekly Mock Test Series",
      description:
        "Regular timed assessments mirroring actual technical and aptitude rounds used by fast-hiring enterprises.",
      bg: "rgba(64, 95, 226, 0.08)",
    },
    {
      icon: <DescriptionIcon sx={{ fontSize: 32, color: "#15803d" }} />,
      title: "Expert Resume & Profile Curation",
      description:
        "Our internal team reviews, optimizes, and updates your resume and skill dossier to meet strict corporate ATS and HR standards.",
      bg: "rgba(21, 128, 61, 0.08)",
    },
    {
      icon: <RecordVoiceOverIcon sx={{ fontSize: 32, color: "#d97706" }} />,
      title: "Live Expert Mentorship",
      description:
        "Interactive guidance sessions focused on problem-solving approaches, interview etiquette, and technical readiness.",
      bg: "rgba(217, 119, 6, 0.08)",
    },
    {
      icon: <ShareIcon sx={{ fontSize: 32, color: "#0284c7" }} />,
      title: "Direct HR & Agency Referrals",
      description:
        "Your mock scores, performance trends, and curated resume are actively routed by our team to 450+ fast-hiring partner networks.",
      bg: "rgba(2, 132, 199, 0.08)",
    },
  ];

  return (
    <Box
      id="features"
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: "#ffffff",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip
            label="All-In-One Subscription"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 1.5, fontWeight: 700 }}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.35rem" },
              fontWeight: 800,
              mb: 1.5,
              color: "text.primary",
            }}
          >
            Everything Included in Your CareerLoop Pro Pass
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
            Designed to bridge the gap between skill preparation and direct employer hiring.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feat, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  borderColor: "divider",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 24px rgba(64, 95, 226, 0.08)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    bgcolor: feat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  {feat.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.05rem", mb: 1 }}>
                  {feat.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  {feat.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
