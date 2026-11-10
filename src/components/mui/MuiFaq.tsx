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
      q: "How does CareerLoop connect me with employers?",
      a: "Unlike static job boards, our team actively coordinates with candidates via phone calls, direct messaging, LinkedIn outreach, and WhatsApp to match verified dossiers directly with our 450+ partner HR agencies.",
    },
    {
      q: "What is included in the ₹5,000 CareerLoop Pro package?",
      a: "The fee covers unlimited structured mock tests, skill preparation modules, multiple proctored final test attempts (with best-score selection), and certified dossier generation. Interview routing and placement support are complimentary.",
    },
    {
      q: "Can I test my profile before enrolling?",
      a: "Yes, you can register and complete a free initial baseline screening to evaluate your starting readiness before choosing to upgrade to the CareerLoop Pro preparation program.",
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
            Everything you need to know about mock tests, multi-attempt certification, and partner interview routing.
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
