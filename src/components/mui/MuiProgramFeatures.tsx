"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import QuizIcon from "@mui/icons-material/Quiz";
import DescriptionIcon from "@mui/icons-material/Description";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ShareIcon from "@mui/icons-material/Share";

export function MuiProgramFeatures() {
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
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.35rem" },
              fontWeight: 800,
              mb: 1.5,
              color: "text.primary",
            }}
          >
            What your pass includes
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            Four programmes working together to move you from preparation to placement.
          </Typography>
        </Box>

        {/* Row 1: Featured pair — different compositions to reflect content hierarchy */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Flagship card: Mock Tests — larger, left-aligned icon, more visual weight */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 3, md: 4 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                borderColor: "primary.main",
                borderWidth: 1.5,
                bgcolor: "rgba(64, 95, 226, 0.03)",
                transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 28px rgba(64, 95, 226, 0.12)",
                },
                "&:hover .feature-icon": {
                  transform: "scale(1.08)",
                },
              }}
            >
              <Box
                className="feature-icon"
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "rgba(64, 95, 226, 0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2.5,
                  transition: "transform 0.25s ease",
                }}
              >
                <QuizIcon sx={{ fontSize: 30, color: "#405FE2" }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.1rem", mb: 1 }}>
                Weekly Mock Test Series
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                Timed assessments that mirror the technical and aptitude rounds used by fast-hiring enterprises. Each set is scored server-side with negative marking, so your result reflects what hiring managers actually see.
              </Typography>
            </Paper>
          </Grid>

          {/* Supporting flagship: Resume Curation — horizontal layout, text-heavier */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 3, md: 4 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                borderColor: "divider",
                transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.06)",
                  borderColor: "primary.main",
                },
                "&:hover .feature-icon": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box className="feature-icon" sx={{ display: "inline-flex", transition: "transform 0.25s ease" }}>
                  <DescriptionIcon sx={{ fontSize: 26, color: "#15803d", flexShrink: 0 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.05rem" }}>
                  Expert Resume &amp; Profile Curation
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                Our internal team reviews your resume against corporate ATS criteria, optimizes it for the roles you are targeting, and packages it with your mock results into a verified dossier ready for HR dispatch.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Row 2: Supporting pair — equal columns, simpler treatment */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                borderColor: "divider",
                transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.06)",
                  borderColor: "primary.main",
                },
                "&:hover .feature-icon": {
                  transform: "scale(1.08)",
                },
              }}
            >
              <Box
                className="feature-icon"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: "rgba(217, 119, 6, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  transition: "transform 0.25s ease",
                }}
              >
                <RecordVoiceOverIcon sx={{ fontSize: 26, color: "#d97706" }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", fontSize: "1rem", mb: 1 }}>
                Live Expert Mentorship
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                Interactive sessions on problem-solving approaches, interview etiquette, and technical readiness, led by practitioners in your domain.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                borderColor: "divider",
                transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.06)",
                  borderColor: "primary.main",
                },
                "&:hover .feature-icon": {
                  transform: "scale(1.08)",
                },
              }}
            >
              <Box
                className="feature-icon"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: "rgba(2, 132, 199, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  transition: "transform 0.25s ease",
                }}
              >
                <ShareIcon sx={{ fontSize: 26, color: "#0284c7" }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", fontSize: "1rem", mb: 1 }}>
                Direct HR &amp; Agency Referrals
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                Your mock scores, performance trends, and curated resume are routed by our team to 450+ fast-hiring partner networks on an active, rolling basis.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
