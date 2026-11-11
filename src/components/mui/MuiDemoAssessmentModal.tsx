"use client";

import React, { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import LinearProgress from "@mui/material/LinearProgress";
import VideocamIcon from "@mui/icons-material/Videocam";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShieldIcon from "@mui/icons-material/Shield";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SchoolIcon from "@mui/icons-material/School";

interface MuiDemoAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  candidateName?: string;
}

const DEMO_QUESTIONS = [
  {
    id: 1,
    title: "Question 1: Mechanical Metrology & Reading Calipers",
    question:
      "A standard vernier caliper has a least count of 0.02 mm. If the main scale reads 14 mm and the 12th vernier line aligns with a main scale mark, what is the measured dimension?",
    options: [
      { id: "A", text: "14.24 mm (14 mm + 12 × 0.02 mm)" },
      { id: "B", text: "14.12 mm" },
      { id: "C", text: "14.02 mm" },
      { id: "D", text: "14.48 mm" },
    ],
    correctAnswer: "A",
    tip: "Notice how options are selected using the radio buttons. In the real Mains Exam, your selection is saved automatically.",
  },
  {
    id: 2,
    title: "Question 2: Anti-Cheating & Integrity Protocol",
    question:
      "During the live proctored Mains Exam, which of the following candidate actions will trigger an automated integrity warning flag?",
    options: [
      { id: "A", text: "Switching browser tabs or minimizing the examination window" },
      { id: "B", text: "Reading the question carefully on the screen" },
      { id: "C", text: "Using the Next / Previous question navigation buttons" },
      { id: "D", text: "Submitting responses before the timer reaches 00:00" },
    ],
    correctAnswer: "A",
    tip: "Important: Navigating away from the window or hiding your face from the camera records an integrity violation. Keep your focus on the test window at all times.",
  },
  {
    id: 3,
    title: "Question 3: Candidate Scoring & Recruiter Routing",
    question:
      "You are permitted 2 proctored attempts for the Mains Exam. How does CareerLoop route your scores to 450+ hiring partners?",
    options: [
      { id: "A", text: "Your highest verified score is automatically certified and forwarded to hiring partners" },
      { id: "B", text: "Only your first attempt score is considered, even if your second score is higher" },
      { id: "C", text: "Both scores are averaged together" },
      { id: "D", text: "Scores are discarded and must be retaken weekly" },
    ],
    correctAnswer: "A",
    tip: "Your highest achieved score automatically populates your verified candidate dossier for employer dispatch.",
  },
];

export function MuiDemoAssessmentModal({
  isOpen,
  onClose,
  onComplete,
  candidateName = "Candidate",
}: MuiDemoAssessmentModalProps) {
  // Steps: 0 = Orientation Guide, 1 = Interactive Test Walkthrough, 2 = Certified & Unlocked
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [cameraActive, setCameraActive] = useState(false);
  const videoPipRef = useRef<HTMLVideoElement | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setPhase(0);
      setCurrentIdx(0);
      setSelectedAnswers({});
    }
  }, [isOpen]);

  // Handle webcam stream for demo phase
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen && phase === 1) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { width: 320, height: 240 } })
          .then((s) => {
            stream = s;
            setCameraActive(true);
            if (videoPipRef.current) {
              videoPipRef.current.srcObject = s;
              videoPipRef.current.play();
            }
          })
          .catch((err) => {
            console.warn("Demo webcam not accessible (continuing simulation):", err);
            setCameraActive(false);
          });
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, phase]);

  const handleNextQuestion = () => {
    if (currentIdx < DEMO_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Finished all demo questions
      setPhase(2);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const currentQ = DEMO_QUESTIONS[currentIdx];
  const progressPercent = ((currentIdx + 1) / DEMO_QUESTIONS.length) * 100;

  return (
    <Dialog
      open={isOpen}
      onClose={phase === 2 ? onComplete : onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: "#0f172a",
            color: "#f8fafc",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        },
      }}
    >
      {/* Top Header */}
      <DialogTitle
        sx={{
          p: 2.5,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          bgcolor: "#1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              bgcolor: "#facc15",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
              Mains Exam Demo &amp; System Orientation
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Mandatory candidate calibration prior to official proctored attempt
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<LockOpenIcon sx={{ fontSize: "14px !important", color: "#facc15 !important" }} />}
          label={phase === 2 ? "Certified & Unlocked" : "Prerequisite Orientation"}
          size="small"
          sx={{
            bgcolor: phase === 2 ? "rgba(34, 197, 94, 0.2)" : "rgba(250, 204, 21, 0.15)",
            color: phase === 2 ? "#4ade80" : "#facc15",
            border: `1px solid ${phase === 2 ? "#22c55e" : "#facc15"}`,
            fontWeight: 700,
            fontSize: "11px",
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* PHASE 0: ORIENTATION GUIDE */}
        {phase === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 1 }}>
            <Alert
              severity="info"
              sx={{
                bgcolor: "rgba(59, 130, 246, 0.12)",
                color: "#93c5fd",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                "& .MuiAlert-icon": { color: "#60a5fa" },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Welcome to your Examination Gateway, {candidateName}!
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "13px" }}>
                To ensure a fair evaluation for our 450+ enterprise hiring partners, the official Mains Exam is proctored with AI computer vision. This 3-minute interactive demo ensures your camera, browser, and navigation are calibrated so you do not lose any official attempts due to accidental infractions.
              </Typography>
            </Alert>

            <Typography variant="subtitle2" sx={{ color: "#facc15", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "12px" }}>
              4 Essential Examination Rules:
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Paper sx={{ p: 2, bgcolor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#60a5fa" }}>
                  <VideocamIcon fontSize="small" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                    1. AI Camera Tracking
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "12px" }}>
                  Your face must stay inside the live camera frame throughout a scored test. Looking away for prolonged periods or covering the camera triggers an integrity warning.
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#f87171" }}>
                  <WarningAmberIcon fontSize="small" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                    2. Strict Anti-Tab Switching
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "12px" }}>
                  Do not switch browser tabs, open other windows, or press browser refresh/back buttons. Exceeding 3 integrity flags submits your test for manual audit review.
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#facc15" }}>
                  <TimerIcon fontSize="small" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                    3. Timed Auto-Submission
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "12px" }}>
                  This demo has 3 orientation questions and is not scored. The official mains set is 30 questions in 40 minutes; if its clock reaches 00:00, all saved answers are submitted automatically.
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#34d399" }}>
                  <ShieldIcon fontSize="small" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                    4. Two Proctored Attempts
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "12px" }}>
                  You receive 2 full proctored attempts. Your highest verified score automatically populates your verified candidate dossier sent to recruiters.
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={() => setPhase(1)}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#facc15",
                  color: "#0f172a",
                  fontWeight: 800,
                  px: 3,
                  py: 1.2,
                  "&:hover": { bgcolor: "#eab308" },
                }}
              >
                Start Interactive Demo Set
              </Button>
            </Box>
          </Box>
        )}

        {/* PHASE 1: INTERACTIVE TEST SIMULATION */}
        {phase === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Coach Banner */}
            <Paper
              sx={{
                p: 2,
                bgcolor: "rgba(250, 204, 21, 0.08)",
                border: "1px solid rgba(250, 204, 21, 0.3)",
                borderRadius: 2,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  bgcolor: "#facc15",
                  color: "#000",
                  px: 1,
                  py: 0.2,
                  borderRadius: 1,
                  fontWeight: 900,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mt: 0.5,
                  shrink: 0,
                }}
              >
                Coach Guide
              </Box>
              <Typography variant="body2" sx={{ color: "#fef08a", fontSize: "12.5px", lineHeight: 1.4 }}>
                {currentQ.tip}
              </Typography>
            </Paper>

            {/* Simulated Test Bar: Live Timer, Question Counter, Live Camera PIP */}
            <Box
              sx={{
                p: 2,
                bgcolor: "#1e293b",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                    Demo Question
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#f8fafc" }}>
                    {currentIdx + 1} of {DEMO_QUESTIONS.length}
                  </Typography>
                </Box>
                <Box sx={{ width: 120 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": { bgcolor: "#facc15" },
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Simulated Timer */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#f87171",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                  }}
                >
                  <TimerIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: "monospace" }}>
                    05:42 (Demo Timer)
                  </Typography>
                </Box>

                {/* Camera PIP View */}
                <Box
                  sx={{
                    width: 70,
                    height: 52,
                    borderRadius: 1.5,
                    bgcolor: "#000",
                    border: "1.5px solid #22c55e",
                    overflow: "hidden",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <video
                    ref={videoPipRef}
                    playsInline
                    muted
                    autoPlay
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: cameraActive ? "block" : "none",
                    }}
                  />
                  {!cameraActive && (
                    <VideocamIcon sx={{ fontSize: 20, color: "#64748b" }} />
                  )}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#22c55e",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Question Card */}
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: "#1e293b",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography variant="caption" sx={{ color: "#facc15", fontWeight: 700, textTransform: "uppercase" }}>
                {currentQ.title}
              </Typography>

              <Typography variant="body1" sx={{ mt: 1, mb: 2.5, fontWeight: 600, color: "#f8fafc", lineHeight: 1.5 }}>
                {currentQ.question}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedAnswers[currentIdx] || ""}
                  onChange={(e) =>
                    setSelectedAnswers({
                      ...selectedAnswers,
                      [currentIdx]: e.target.value,
                    })
                  }
                >
                  {currentQ.options.map((option) => {
                    const isSelected = selectedAnswers[currentIdx] === option.id;
                    return (
                      <Paper
                        key={option.id}
                        elevation={0}
                        onClick={() =>
                          setSelectedAnswers({
                            ...selectedAnswers,
                            [currentIdx]: option.id,
                          })
                        }
                        sx={{
                          mb: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          cursor: "pointer",
                          bgcolor: isSelected ? "rgba(250, 204, 21, 0.12)" : "rgba(15, 23, 42, 0.6)",
                          border: `1.5px solid ${isSelected ? "#facc15" : "rgba(255,255,255,0.06)"}`,
                          transition: "all 0.15s ease-in-out",
                          "&:hover": {
                            bgcolor: isSelected ? "rgba(250, 204, 21, 0.18)" : "rgba(255,255,255,0.03)",
                            borderColor: isSelected ? "#facc15" : "rgba(255,255,255,0.15)",
                          },
                        }}
                      >
                        <FormControlLabel
                          value={option.id}
                          control={
                            <Radio
                              size="small"
                              sx={{
                                color: "#64748b",
                                "&.Mui-checked": { color: "#facc15" },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: isSelected ? "#ffffff" : "#cbd5e1", fontSize: "13px" }}>
                              <strong>{option.id}.</strong> {option.text}
                            </Typography>
                          }
                          sx={{ width: "100%", m: 0 }}
                        />
                      </Paper>
                    );
                  })}
                </RadioGroup>
              </FormControl>

              {/* Navigation buttons */}
              <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  onClick={handlePrevQuestion}
                  disabled={currentIdx === 0}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    color: "#94a3b8",
                    borderColor: "rgba(255,255,255,0.15)",
                    "&:hover": { borderColor: "#cbd5e1", color: "#fff" },
                  }}
                >
                  Previous
                </Button>

                <Button
                  variant="contained"
                  onClick={handleNextQuestion}
                  endIcon={currentIdx === DEMO_QUESTIONS.length - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />}
                  sx={{
                    bgcolor: currentIdx === DEMO_QUESTIONS.length - 1 ? "#22c55e" : "#facc15",
                    color: "#0f172a",
                    fontWeight: 800,
                    px: 3,
                    "&:hover": {
                      bgcolor: currentIdx === DEMO_QUESTIONS.length - 1 ? "#16a34a" : "#eab308",
                    },
                  }}
                >
                  {currentIdx === DEMO_QUESTIONS.length - 1 ? "Submit Demo Exam" : "Next Demo Question"}
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {/* PHASE 2: CERTIFIED & UNLOCKED */}
        {phase === 2 && (
          <Box sx={{ textAlign: "center", py: 4, px: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "rgba(34, 197, 94, 0.15)",
                border: "2px solid #22c55e",
                color: "#22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 40 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, color: "#ffffff", mb: 1 }}>
              Demo Completed — Mains Exam is Unlocked!
            </Typography>

            <Typography variant="body2" sx={{ color: "#94a3b8", maxWidth: 520, mb: 3, lineHeight: 1.6 }}>
              Congratulations! You have completed the proctoring calibration walkthrough. Your camera setup, response navigation, and integrity understanding have been verified.
            </Typography>

            <Paper
              sx={{
                p: 2,
                bgcolor: "#1e293b",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 2,
                maxWidth: 480,
                width: "100%",
                mb: 3.5,
                textAlign: "left",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 600, fontSize: "13px" }}>
                  AI Proctoring Calibration Verified
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 600, fontSize: "13px" }}>
                  Anti-Tamper Protocol Initialized
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 600, fontSize: "13px" }}>
                  2 Official Mains Examination Attempts Ready
                </Typography>
              </Box>
            </Paper>

            <Button
              variant="contained"
              size="large"
              onClick={onComplete}
              endIcon={<LockOpenIcon />}
              sx={{
                bgcolor: "#22c55e",
                color: "#0f172a",
                fontWeight: 800,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "14px",
                "&:hover": { bgcolor: "#16a34a" },
              }}
            >
              Enter Mains Examination Now
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
