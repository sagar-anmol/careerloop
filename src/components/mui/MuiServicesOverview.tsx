"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export function MuiServicesOverview() {
  const services = [
    {
      title: "For Professionals & Job Seekers",
      subtitle: "Career Readiness & Direct Coordination",
      icon: <PersonSearchIcon sx={{ fontSize: 32, color: "primary.main" }} />,
      description:
        "Access structured mock tests, multi-attempt proctored certification, and direct interview coordination managed by our recruitment advisory team via phone, LinkedIn, and virtual channels.",
      highlights: [
        "Structured mock tests & domain readiness modules",
        "Multi-attempt proctored certification with best-score retention",
        "Direct recruiter outreach & scheduled corporate interviews",
      ],
    },
    {
      title: "For Enterprise Employers",
      subtitle: "Pre-Vetted Technical Sourcing",
      icon: <CorporateFareIcon sx={{ fontSize: 32, color: "#15803d" }} />,
      description:
        "Partner with us for rapid talent sourcing, pre-vetted technical assessments, and customized candidate pipelines tailored to your corporate hiring criteria.",
      highlights: [
        "Verified Candidate Dossiers with proctoring audit trails",
        "Pre-screened technical, diploma, and engineering talent",
        "Zero initial listing friction with tailored talent shortlists",
      ],
    },
  ];

  return (
    <Box
      id="services"
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
            label="Workforce & Recruitment Solutions"
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
            Our Workforce &amp; Recruitment Solutions
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Streamlining talent acquisition and career progression through professional standards.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {services.map((srv, idx) => (
            <Grid size={{ xs: 12, md: 6 }} key={idx}>
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 3.5, sm: 4 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  borderColor: idx === 0 ? "primary.main" : "divider",
                  borderWidth: idx === 0 ? 2 : 1,
                  boxShadow: idx === 0 ? "0 8px 24px rgba(64, 95, 226, 0.08)" : "none",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: idx === 0 ? "rgba(64, 95, 226, 0.08)" : "rgba(21, 128, 61, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {srv.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                      {srv.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                      {srv.subtitle}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.65 }}>
                  {srv.description}
                </Typography>

                <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                  {srv.highlights.map((item, hIdx) => (
                    <Box key={hIdx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: idx === 0 ? "primary.main" : "#15803d" }} />
                      <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 600 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
