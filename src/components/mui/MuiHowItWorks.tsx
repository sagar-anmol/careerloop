"use client";

import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VideocamIcon from "@mui/icons-material/Videocam";
import BadgeIcon from "@mui/icons-material/Badge";
import HandshakeIcon from "@mui/icons-material/Handshake";

interface MuiHowItWorksProps {
  onStartVerification?: () => void;
}

export function MuiHowItWorks({ onStartVerification }: MuiHowItWorksProps) {
  const steps = [
    {
      step: "01",
      circleColor: "#b11f2c", // Crimson Red
      title: "Profile Onboarding & Audit",
      subtitle: "Resume & Skill Intake",
      description:
        "Submit your current resume and profile details. Our team performs an initial baseline audit to map your target industry tracks.",
      tag: "Intake & Audit",
      icon: <BadgeIcon sx={{ fontSize: 18, color: "#b11f2c" }} />,
    },
    {
      step: "02",
      circleColor: "#003c5e", // Dark Navy Blue
      title: "Weekly Mocks & Mentorship",
      subtitle: "Active Skill Training",
      description:
        "Participate in weekly mock tests and live mentorship sessions. Every test score is logged to measure progress and readiness.",
      tag: "Weekly Practice",
      icon: <VideocamIcon sx={{ fontSize: 18, color: "#003c5e" }} />,
    },
    {
      step: "03",
      circleColor: "#017aa9", // Ocean Teal Blue
      title: "Score & Resume Optimization",
      subtitle: "Internal Team Analysis",
      description:
        "Our team analyzes your peak mock marks, polishes your updated resume, and compiles your certified candidate scorecard dossier.",
      tag: "Dossier Curation",
      icon: <CheckCircleIcon sx={{ fontSize: 18, color: "#017aa9" }} />,
    },
    {
      step: "04",
      circleColor: "#ebaa1c", // Golden Amber
      title: "Fast-Hiring Agency Dispatch",
      subtitle: "Direct Corporate Referrals",
      description:
        "We push your optimized dossier directly to our network of fast-hiring HR managers, agencies, and recruiters for interview scheduling.",
      tag: "Direct Referrals",
      icon: <HandshakeIcon sx={{ fontSize: 18, color: "#ebaa1c" }} />,
    },
  ];

  return (
    <Box
      id="roadmap"
      component="section"
      sx={{
        py: { xs: 8, md: 11 },
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Chip
            icon={<TimelineIcon sx={{ fontSize: 16, color: "#405FE2" }} />}
            label="Execution Workflow"
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
              fontSize: { xs: "2rem", sm: "2.75rem" },
              fontWeight: 800,
              mb: 1.5,
              color: "text.primary",
              letterSpacing: "-0.02em",
            }}
          >
            How Our Team Handles Your <span style={{ color: "#405FE2" }}>Placement Journey</span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 680,
              mx: "auto",
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              lineHeight: 1.6,
            }}
          >
            A structured 4-step pipeline from subscription activation to enterprise interview dispatch.
          </Typography>
        </Box>

        {/* =========================================================================
            DESKTOP / TABLET: EXACT REPLICA OF THE REFERENCE WINDING ROAD DIAGRAM
           ========================================================================= */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "100%",
            maxWidth: 1240,
            mx: "auto",
            position: "relative",
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 1302 734"
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
              userSelect: "none",
              overflow: "visible",
            }}
          >
            {/* Filter for subtle circle dropshadow */}
            <defs>
              <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.18" floodColor="#0f172a" />
              </filter>
            </defs>

            {/* Asphalt Highway Track */}
            <path
              d="M 237 399.1 L 257.85 399.1 A 97.65 97.65 0 0 1 453.15 399.1 A 97.65 97.65 0 0 0 648.45 399.1 A 97.65 97.65 0 0 1 843.65 399.1 A 97.65 97.65 0 0 0 1039.05 399.1 C 1039.05 356.8, 1073.2 322.5, 1116 322.5"
              stroke="#3e3e3e"
              strokeWidth="42"
              fill="none"
              strokeLinecap="square"
              strokeLinejoin="round"
            />

            {/* White Dashed Center Highway Line */}
            <path
              d="M 240 399.1 L 257.85 399.1 A 97.65 97.65 0 0 1 453.15 399.1 A 97.65 97.65 0 0 0 648.45 399.1 A 97.65 97.65 0 0 1 843.65 399.1 A 97.65 97.65 0 0 0 1039.05 399.1 C 1039.05 356.8, 1073.2 322.5, 1114 322.5"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeDasharray="11 11"
              fill="none"
              strokeLinejoin="round"
            />

            {/* Large Integrated Road Arrowhead at right */}
            <polygon points="1116,283 1155,322.5 1116,362" fill="#3e3e3e" />

            {/* =========================================================
                MILESTONE 01 (Crimson Red) & Text Below
               ========================================================= */}
            <g
              onClick={onStartVerification}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              className="roadmap-node"
            >
              <circle
                cx="355.5"
                cy="399.1"
                r="60.5"
                fill="#b11f2c"
                filter="url(#nodeShadow)"
              />
              <text
                x="355.5"
                y="410"
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="32"
                fontWeight="700"
                fill="#ffffff"
              >
                01
              </text>
            </g>

            {/* Step 01 Text (Positioned BELOW circle 1) */}
            <g textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
              <text
                x="355.5"
                y="508"
                fontSize="12"
                fontWeight="700"
                fill="#b11f2c"
                letterSpacing="0.05em"
              >
                ⏱️ 5 MINUTES • ZERO FLUFF
              </text>
              <text
                x="355.5"
                y="534"
                fontSize="20"
                fontWeight="800"
                fill="#0f172a"
              >
                Complete Verified Profile
              </text>
              <text
                x="355.5"
                y="558"
                fontSize="14"
                fontWeight="600"
                fill="#b11f2c"
              >
                Info, Live Webcam Photo &amp; Resume
              </text>
              <text
                x="355.5"
                y="582"
                fontSize="13"
                fill="#555555"
              >
                Mandatory webcam snapshot &amp; background verification
              </text>
              <text
                x="355.5"
                y="602"
                fontSize="13"
                fill="#777777"
              >
                Takes 5 minutes • Zero paper bureaucracy
              </text>
            </g>

            {/* =========================================================
                MILESTONE 02 (Dark Navy) & Text Above
               ========================================================= */}
            <g
              onClick={onStartVerification}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              className="roadmap-node"
            >
              <circle
                cx="550.8"
                cy="399.1"
                r="60.0"
                fill="#003c5e"
                filter="url(#nodeShadow)"
              />
              <text
                x="550.8"
                y="410"
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="32"
                fontWeight="700"
                fill="#ffffff"
              >
                02
              </text>
            </g>

            {/* Step 02 Text (Positioned ABOVE circle 2) */}
            <g textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
              <text
                x="550.8"
                y="196"
                fontSize="12"
                fontWeight="700"
                fill="#003c5e"
                letterSpacing="0.05em"
              >
                📹 LIVE CAMERA ON • TAB LOCKED
              </text>
              <text
                x="550.8"
                y="222"
                fontSize="20"
                fontWeight="800"
                fill="#0f172a"
              >
                Strict Proctored Assessment
              </text>
              <text
                x="550.8"
                y="246"
                fontSize="14"
                fontWeight="600"
                fill="#003c5e"
              >
                Anti-Cheating &amp; Webcam Integrity
              </text>
              <text
                x="550.8"
                y="270"
                fontSize="13"
                fill="#555555"
              >
                Timed technical test with active camera proctoring
              </text>
              <text
                x="550.8"
                y="290"
                fontSize="13"
                fill="#777777"
              >
                Browser lock, tab monitoring &amp; anti-cheating protection
              </text>
            </g>

            {/* =========================================================
                MILESTONE 03 (Ocean Teal) & Text Below
               ========================================================= */}
            <g
              onClick={onStartVerification}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              className="roadmap-node"
            >
              <circle
                cx="746.0"
                cy="399.1"
                r="60.0"
                fill="#017aa9"
                filter="url(#nodeShadow)"
              />
              <text
                x="746.0"
                y="410"
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="32"
                fontWeight="700"
                fill="#ffffff"
              >
                03
              </text>
            </g>

            {/* Step 03 Text (Positioned BELOW circle 3) */}
            <g textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
              <text
                x="746.0"
                y="508"
                fontSize="12"
                fontWeight="700"
                fill="#017aa9"
                letterSpacing="0.05em"
              >
                ⚡ INSTANT EVALUATION SCORE
              </text>
              <text
                x="746.0"
                y="534"
                fontSize="20"
                fontWeight="800"
                fill="#0f172a"
              >
                Skill Verification &amp; Dossier
              </text>
              <text
                x="746.0"
                y="558"
                fontSize="14"
                fontWeight="600"
                fill="#017aa9"
              >
                Practical Evaluation Scorecard
              </text>
              <text
                x="746.0"
                y="582"
                fontSize="13"
                fill="#555555"
              >
                Automated benchmarking of technical competency
              </text>
              <text
                x="746.0"
                y="602"
                fontSize="13"
                fill="#777777"
              >
                Certified candidate profile generated immediately
              </text>
            </g>

            {/* =========================================================
                MILESTONE 04 (Golden Amber) & Text Above
               ========================================================= */}
            <g
              onClick={onStartVerification}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              className="roadmap-node"
            >
              <circle
                cx="941.4"
                cy="399.1"
                r="60.5"
                fill="#ebaa1c"
                filter="url(#nodeShadow)"
              />
              <text
                x="941.4"
                y="410"
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="32"
                fontWeight="700"
                fill="#ffffff"
              >
                04
              </text>
            </g>

            {/* Step 04 Text (Positioned ABOVE circle 4) */}
            <g textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
              <text
                x="941.4"
                y="196"
                fontSize="12"
                fontWeight="700"
                fill="#b45309"
                letterSpacing="0.05em"
              >
                🤝 NOMINAL FEE ONLY ON INTERVIEW / OFFER
              </text>
              <text
                x="941.4"
                y="222"
                fontSize="20"
                fontWeight="800"
                fill="#0f172a"
              >
                Direct Agency Interviews
              </text>
              <text
                x="941.4"
                y="246"
                fontSize="14"
                fontWeight="600"
                fill="#b45309"
              >
                450+ Partner HR Agencies
              </text>
              <text
                x="941.4"
                y="270"
                fontSize="13"
                fill="#555555"
              >
                Backend routes verified scorecard directly to recruiters
              </text>
              <text
                x="941.4"
                y="290"
                fontSize="13"
                fill="#777777"
              >
                Nominal fee for assessment &amp; review is payable only once you receive an interview call or offer letter
              </text>
            </g>
          </Box>
        </Box>

        {/* =========================================================================
            MOBILE VIEW (< 900px): CLEAN VERTICAL STEPPER WITH MATCHING MILESTONE NODES
           ========================================================================= */}
        <Box sx={{ display: { xs: "block", md: "none" }, mt: 3 }}>
          <Stack spacing={3}>
            {steps.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  gap: 2.5,
                  alignItems: "flex-start",
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "1px solid",
                  borderColor: "rgba(64, 95, 226, 0.16)",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
                  position: "relative",
                }}
              >
                {/* Circular Badge matching color */}
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    bgcolor: item.circleColor,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1.35rem",
                    flexShrink: 0,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                  }}
                >
                  {item.step}
                </Box>

                {/* Content */}
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                    <Chip
                      label={item.tag}
                      size="small"
                      sx={{
                        bgcolor: `${item.circleColor}15`,
                        color: item.circleColor,
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        height: 22,
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.1rem", mb: 0.25 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: item.circleColor, mb: 0.75 }}>
                    {item.subtitle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
