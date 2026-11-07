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
      q: "Is there really no upfront fee to take the test and get job opportunities?",
      a: "Yes, exactly ₹0 upfront. You never pay any advance charges to take the proctored test or create your verified candidate profile. Nominal fee for assessment & review is payable only once you receive an interview call or offer letter.",
    },
    {
      q: "How does the Government DBT (Direct Benefit Transfer) stipend work?",
      a: "Under the NAPS (for ITI) and NATS (for Diploma and Graduates) schemes, a substantial monthly portion of your stipend (₹1,500 to ₹6,150) is disbursed directly from the Central Government into your official Aadhaar-linked bank account, ensuring complete transparency.",
    },
    {
      q: "What bus transportation and canteen facilities are available?",
      a: "Partner enterprise facilities provide designated company bus commute routes connecting key city pickup points. All facilities also maintain subsidized on-site canteens serving nutritious breakfast, lunch, tea, and meal options during shifts.",
    },
    {
      q: "How are overtime hours and extra shifts compensated?",
      a: "Overtime is calculated on a fixed hourly basis (ranging from ₹125/hr to ₹142/hr) or double-overtime provisions depending on the specific enterprise. Overtime earnings are added directly to your monthly payout slip.",
    },
    {
      q: "What happens if I take the assessment but do not receive an interview or offer letter?",
      a: "You owe exactly ₹0. Nominal fee for assessment & review is payable only once you receive an interview call or offer letter. If you do not receive an interview call or offer letter, you have zero financial or legal liability.",
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
            Everything you need to know about the onboarding, proctored test, and recruitment process.
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
