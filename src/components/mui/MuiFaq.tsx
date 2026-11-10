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
      q: "What does the ₹5,000 CareerLoop Pro fee cover?",
      a: "The ₹5,000 fee is strictly for our CareerLoop Pro Program, which includes unlimited structured mock tests, multiple proctored final test attempts (with automatic best-score selection), skill preparation modules, and certified candidate dossier generation. Interview routing and placement assistance are provided as complimentary value-added benefits.",
    },
    {
      q: "Can I take the final test multiple times?",
      a: "Yes! CareerLoop Pro allows multiple proctored final test attempts. Our platform automatically records and selects your highest score to build your certified candidate dossier for employer review.",
    },
    {
      q: "Is there a free way to test my baseline skills first?",
      a: "Yes, you can register and take your initial baseline assessment for free to check your starting score before deciding to upgrade to the full CareerLoop Pro mock test and certification package.",
    },
    {
      q: "What bus transportation and canteen facilities are available?",
      a: "Many partner industrial and enterprise facilities provide designated bus commute routes and subsidized on-site canteen meals during shifts. Exact workplace amenities depend on the specific hiring organization and location.",
    },
    {
      q: "Are jobs guaranteed with the ₹5,000 program?",
      a: "No private platform can legally guarantee employment. The ₹5,000 fee guarantees the delivery of our mock test preparation, proctored testing, best-score certification, and active profile routing to our 450+ partner HR agencies. Final hiring selections and job offers are determined entirely by the hiring employers based on candidate performance during interviews.",
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
