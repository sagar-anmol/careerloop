"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import BusinessIcon from "@mui/icons-material/Business";
import VerifiedIcon from "@mui/icons-material/Verified";

export function MuiTestimonials() {
  const partners = [
    {
      agency: "ApexHire Global",
      focus: "AI & Cloud Roles",
      placedCount: "480+ Placed",
      candidateName: "Aditya Nair",
      role: "Cloud Infrastructure Engineer",
      ctc: "₹18.5 LPA",
      quote:
        "The proctored test was strict—live camera on and no tab switching. Once my score was validated, ApexHire reached out within 48 hours for round 1.",
      avatar: "AN",
      initialsBg: "#405FE2",
    },
    {
      agency: "TalentPulse Staffing",
      focus: "Full-Stack Tech",
      placedCount: "860+ Placed",
      candidateName: "Pooja Sharma",
      role: "Senior Full-Stack Engineer",
      ctc: "₹16.0 LPA",
      quote:
        "Loved the pay-after-placement model. I paid zero upfront, took the assessment, and got interviewed by a high-growth fintech through TalentPulse.",
      avatar: "PS",
      initialsBg: "#2843be",
    },
    {
      agency: "BlueChip Search",
      focus: "Enterprise DevOps",
      placedCount: "310+ Placed",
      candidateName: "Rohan Deshmukh",
      role: "DevOps & SRE Specialist",
      ctc: "₹19.2 LPA",
      quote:
        "BlueChip directly matched my proctored scorecard with an enterprise banking client. Received an offer in 3 weeks, and the nominal post-placement fee was very reasonable.",
      avatar: "RD",
      initialsBg: "#405FE2",
    },
    {
      agency: "Horizon Talent",
      focus: "Product & UI/UX",
      placedCount: "290+ Placed",
      candidateName: "Sneha Kapadia",
      role: "Lead Product Designer",
      ctc: "₹14.5 LPA",
      quote:
        "Horizon reviewed my evaluated dossier and scheduled 2 rounds with an overseas SaaS company. Smooth, genuine, and no upfront cost pressure.",
      avatar: "SK",
      initialsBg: "#2843be",
    },
    {
      agency: "NextGen Staffing",
      focus: "Cyber & Security",
      placedCount: "420+ Placed",
      candidateName: "Vikram Sengupta",
      role: "Application Security Analyst",
      ctc: "₹17.0 LPA",
      quote:
        "The strict proctoring gave hiring managers 100% confidence in my test result. NextGen fast-tracked me straight to the hiring manager round.",
      avatar: "VS",
      initialsBg: "#405FE2",
    },
    {
      agency: "Vanguard HR",
      focus: "Global Relocation",
      placedCount: "510+ Placed",
      candidateName: "Arjun Verma",
      role: "Systems Architect (Dubai)",
      ctc: "₹24.0 LPA",
      quote:
        "Placed for a Dubai tech firm via Vanguard HR. The zero-upfront policy made it totally risk-free. I only paid the nominal fee after signing my employment contract.",
      avatar: "AV",
      initialsBg: "#2843be",
    },
  ];

  return (
    <Box
      id="agencies"
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Chip
            icon={<BusinessIcon style={{ fontSize: 16, color: "#405FE2" }} />}
            label="Recruitment Partner Network"
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
              fontWeight: 700,
              mb: 1.5,
            }}
          >
            Backed by 450+ Partner HR Agencies
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Our backend routes your verified capstone portfolio directly to these recruitment partners to schedule your interview calls.
          </Typography>
        </Box>

        {/* Agency + Alumni Testimonial Cards */}
        <Grid container spacing={3}>
          {partners.map((item, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "background.paper",
                  borderRadius: 3,
                  borderColor: "divider",
                  transition: "border-color 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  {/* Agency Header Banner */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                      pb: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {item.agency}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {item.focus}
                      </Typography>
                    </Box>
                    <Chip
                      label={item.placedCount}
                      size="small"
                      sx={{
                        bgcolor: "rgba(21, 128, 61, 0.1)",
                        color: "#15803d",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>

                  {/* Rating Stars */}
                  <Box sx={{ mb: 1.5 }}>
                    <Rating value={5} readOnly size="small" sx={{ color: "#d97706" }} />
                  </Box>

                  {/* Testimonial Quote */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      fontStyle: "italic",
                      flexGrow: 1,
                      mb: 3,
                    }}
                  >
                    "{item.quote}"
                  </Typography>

                  {/* Placed Candidate Details */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: "auto" }}>
                    <Avatar
                      sx={{
                        bgcolor: item.initialsBg,
                        width: 40,
                        height: 40,
                        fontSize: "0.875rem",
                        fontWeight: 700,
                      }}
                    >
                      {item.avatar}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                          {item.candidateName}
                        </Typography>
                        <VerifiedIcon sx={{ fontSize: 15, color: "#15803d" }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                        {item.role}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                        CTC
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#15803d" }}>
                        {item.ctc}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
