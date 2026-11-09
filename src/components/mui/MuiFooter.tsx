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
              Direct technical evaluation &amp; recruitment partner placement network. Zero advance charges — nominal evaluation fee is payable only once you receive an interview call or offer letter.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }} gutterBottom>
              CANDIDATES
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#how-it-works" underline="hover" color="text.secondary" variant="body2">
                Candidate Roadmap
              </Link>
              <Link href="#placement-terms" underline="hover" color="text.secondary" variant="body2">
                Compensation &amp; Terms
              </Link>
              <Link href="#faq" underline="hover" color="text.secondary" variant="body2">
                Candidate FAQ
              </Link>
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
              <Typography variant="body2" color="text.secondary">Direct Enterprise Hiring</Typography>
            </Box>
          </Grid>

          {/* Legal / Contact */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }} gutterBottom>
              SUPPORT & TRUST
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Strict proctored integrity standards. ISO-aligned data privacy.
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              Email: placement@careerloop.in
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              Operating in: Bengaluru • Pune • Hyderabad • Gurgaon • Dubai
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{
            pt: 4,
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
            © 2026 careerloop Network Technologies. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pay-After-Placement Agreement • Privacy Policy • Anti-Cheating Terms
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
