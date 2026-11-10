"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import Chip from "@mui/material/Chip";

export function MuiFaq() {
  const [expanded, setExpanded] = useState<string | false>("panel0");

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      q: "How does the team use my mock marks and resume?",
      a: "Our internal team reviews your weekly mock test scores and analyzes your performance trends. We then update and optimize your resume to highlight your strengths, packaging both into a verified candidate dossier that we refer directly to fast-hiring HR teams and agencies.",
    },
    {
      q: "What does the ₹5,000 subscription fee cover?",
      a: "The fee covers full access to our weekly mock test portal, live mentorship sessions, expert resume curation, performance tracking, and active candidate dossier management. Direct HR and agency referral coordination is included as a complimentary value-added service.",
    },
    {
      q: "How fast are the partner companies hiring?",
      a: "Our fast-hiring partner network consists of 450+ HR agencies and corporate enterprises with active, ongoing recruitment cycles across tech, operations, and general management roles.",
    },
    {
      q: "Are job placements guaranteed?",
      a: "No platform can legally guarantee a job offer. The subscription guarantees the full delivery of our preparation services, mock testing, resume optimization, and active employer referrals. Final hiring decisions and selections are made entirely by the corporate recruiters based on interview performance.",
    },
  ];

  return (
    <Box
      id="faq"
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Chip
            icon={<HelpOutlineIcon style={{ fontSize: 16, color: "#405FE2" }} />}
            label="Got Questions?"
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
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Everything you need to know about weekly mocks, mentorship, and our referral network.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {faqs.map((faq, idx) => {
            const panelId = `panel${idx}`;
            return (
              <Accordion
                key={idx}
                expanded={expanded === panelId}
                onChange={handleChange(panelId)}
                variant="outlined"
                sx={{
                  bgcolor: "background.paper",
                  borderColor: "divider",
                  borderRadius: 2,
                  "&:before": { display: "none" },
                  "&.Mui-expanded": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "text.secondary" }} />}
                  sx={{ px: 3, py: 1 }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
