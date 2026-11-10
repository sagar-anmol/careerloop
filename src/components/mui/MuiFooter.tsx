"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

export function MuiFooter() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        bgcolor: "#dbe2f1",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Brand Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <BusinessCenterIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                Career<span style={{ color: "#405FE2" }}>Loop</span>
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, lineHeight: 1.6 }}>
              CareerLoop Pro — Comprehensive weekly mocks, expert mentorship, resume optimization, and direct HR referral pipeline connecting talent with fast-hiring enterprises.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }} gutterBottom>
              CANDIDATES
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#features" underline="hover" color="text.secondary" variant="body2">
                Program Features
              </Link>
              <Link href="#pricing" underline="hover" color="text.secondary" variant="body2">
                Pricing Pass
              </Link>
              <Link href="#faq" underline="hover" color="text.secondary" variant="body2">
                Candidate FAQ
              </Link>
              <Typography variant="caption" color="text.secondary" sx={{ cursor: "pointer" }}>
                Terms &amp; Conditions
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ cursor: "pointer" }}>
                Refund Policy
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ cursor: "pointer" }}>
                Privacy Policy
              </Typography>
            </Box>
          </Grid>

          {/* Hiring Tracks */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }} gutterBottom>
              QUALIFICATIONS
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">Technical &amp; Skilled Trades</Typography>
              <Typography variant="body2" color="text.secondary">Engineering Associates</Typography>
              <Typography variant="body2" color="text.secondary">Graduates &amp; Trainees</Typography>
              <Typography variant="body2" color="text.secondary">Enterprise Skill Verification</Typography>
            </Box>
          </Grid>

          {/* Legal / Contact */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }} gutterBottom>
              SUPPORT & TRUST
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Strict proctored integrity standards. DPDP Act 2023 compliant data privacy.
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              Email: support@careerloop.co.in
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              Operating in: Bengaluru • Pune • Hyderabad • Gurgaon • Chennai
            </Typography>
          </Grid>
        </Grid>

        {/* Legal Disclaimer Box */}
        <Box sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", lineHeight: 1.6, fontSize: "0.72rem" }}>
            <strong>Disclaimer:</strong> CareerLoop (<code>careerloop.co.in</code>) is an independent career acceleration and skill preparation platform, not a government agency or guaranteed employment provider. The subscription fee covers mock testing, mentorship, resume curation, and dossier management services. Employer referrals and interview scheduling are complimentary assistance benefits. Final hiring selections and compensation packages rest solely with respective corporate employers.
          </Typography>
        </Box>

        <Box
          sx={{
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2026 CareerLoop. All rights reserved. CareerLoop Pro Subscription Model.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            DPDP Act Compliant • Proctored Assessment Integrity
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
