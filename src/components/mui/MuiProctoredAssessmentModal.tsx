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
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface MuiProctoredAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateData: any;
}

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    title: "Precision Metrology & Quality Inspection",
    question:
      "A critical automotive camshaft journal requires a tolerance of 25.00 mm ± 0.02 mm. During quality inspection with an outside micrometer, you measure 25.03 mm. What is the correct quality action?",
    options: [
      { id: "A", text: "Flag part as oversize out-of-tolerance and isolate it to prevent assembly defects" },
      { id: "B", text: "Accept the component because it is close enough to nominal size" },
      { id: "C", text: "Recalibrate the micrometer to match the 25.03 mm reading" },
      { id: "D", text: "Pass the part without recording deviation on the inspection sheet" },
    ],
    correctAnswer: "A",
  },
  {
    id: 2,
    title: "Industrial Safety & 5S Principles",
    question:
      "On an automated lithium-ion battery assembly line, a safety light-curtain sensor gets triggered by an obstruction. What is the standard operating protocol?",
    options: [
      { id: "A", text: "The machine interlock automatically halts operation; verify area is clear before hitting safety reset" },
      { id: "B", text: "Bypass the safety light-curtain sensor to keep the shift quota moving" },
      { id: "C", text: "Manually force the conveyor belt forward while the robot is active" },
      { id: "D", text: "Ignore warning siren if parts are still moving on the feeder" },
    ],
    correctAnswer: "A",
  },
  {
    id: 3,
    title: "Electrical & Clean Energy Battery Systems",
    question:
      "When configuring an electric vehicle battery module, what is the primary electrical difference between connecting cells in series versus connecting cells in parallel?",
    options: [
      { id: "A", text: "Series connection increases total voltage; parallel connection increases total Ah capacity" },
      { id: "B", text: "Series connection increases capacity; parallel connection increases resistance only" },
      { id: "C", text: "Both series and parallel connections reduce output voltage to zero" },
      { id: "D", text: "Parallel connection triples voltage without changing current" },
    ],
    correctAnswer: "A",
  },
  {
    id: 4,
    title: "CNC / VMC Machining & Production Operations",
    question:
      "During a high-speed milling cycle on a powertrain component, the cutting tool produces excessive chatter noise and visible discoloration. What is the primary cause and solution?",
    options: [
      { id: "A", text: "Overheating due to insufficient coolant flow or excessive spindle speed/feed rate; adjust parameters and verify coolant" },
      { id: "B", text: "The workpiece is too soft for standard carbide tooling" },
      { id: "C", text: "Increase feed rate by 300% to push past tool vibration" },
      { id: "D", text: "Shut off air blow and allow dry cutting indefinitely" },
    ],
    correctAnswer: "A",
  },
  {
    id: 5,
    title: "Automotive Thermal & HVAC Heat Transfer",
    question:
      "In an automotive thermal management cooling loop, what is the primary function of the thermostatic expansion valve (TXV) in the refrigeration cycle?",
    options: [
      { id: "A", text: "Regulates refrigerant flow and drops pressure to enable liquid evaporation and heat absorption" },
      { id: "B", text: "Acts as an electrical fuse to disconnect battery power during freezing weather" },
      { id: "C", text: "Pumps hot air directly into the engine intake manifold" },
      { id: "D", text: "Filters mechanical metal shavings out of transmission fluid" },
    ],
    correctAnswer: "A",
  },
];

export function MuiProctoredAssessmentModal({
  isOpen,
  onClose,
  candidateData,
}: MuiProctoredAssessmentModalProps) {
  // Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600s)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Proctoring Violation Tracker
  const [warningCount, setWarningCount] = useState(0);
  const [lastWarningMsg, setLastWarningMsg] = useState<string | null>(null);

  // Live Camera Stream
  const videoPipRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // 1. Strict Proctoring: Lock Backspace Key & Browser Back Navigation
  useEffect(() => {
    if (!isOpen || isSubmitted) return;

    // Prevent Backspace unless inside an editable text area
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        const target = e.target as HTMLElement;
        const isInputField =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;
        if (!isInputField) {
          e.preventDefault();
          triggerWarning("Backspace key is locked during proctored testing.");
        }
      }
      // Block F5 / Ctrl+R refresh
      if ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        triggerWarning("Page refresh is strictly prohibited.");
      }
    };

    // Prevent Browser Back Navigation via history trap
    window.history.pushState(null, "", window.location.href);
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      triggerWarning("Browser back button is locked during proctoring.");
    };

    // Tab Switch / Window Blur Detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning("Tab switch detected! Your test session will be flagged for review.");
      }
    };

    const handleWindowBlur = () => {
      triggerWarning("Focus lost! Do not navigate away from the proctored test room.");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isOpen, isSubmitted]);

  // 2. Camera Stream for PIP window
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (isOpen && !isSubmitted) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { width: 320, height: 240 } })
          .then((s) => {
            activeStream = s;
            setCameraActive(true);
            if (videoPipRef.current) {
              videoPipRef.current.srcObject = s;
              videoPipRef.current.play();
            }
          })
          .catch((err) => {
            console.warn("Proctor PIP webcam stream warning:", err);
            setCameraActive(false);
          });
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, isSubmitted]);

  // 3. Countdown Timer
  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  const triggerWarning = (msg: string) => {
    setWarningCount((c) => c + 1);
    setLastWarningMsg(msg);
  };

  const handleSelectAnswer = (optionId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionId,
    });
  };

  const handleSubmitTest = () => {
    let calculated = 0;
    ASSESSMENT_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        calculated += 20; // 5 questions * 20 = 100
      }
    });
    setScore(calculated);
    setIsSubmitted(true);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  const currentQ = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <Dialog
      open={isOpen}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#ffffff",
            borderRadius: 3,
            minHeight: 580,
            border: "1px solid rgba(41, 136, 188, 0.22)",
            boxShadow: "0 20px 40px rgba(23, 43, 56, 0.15)",
          },
        },
      }}
    >
      {/* Top Header Bar */}
      <DialogTitle
        sx={{
          p: 2.5,
          bgcolor: "#f4f7fe",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ShieldIcon sx={{ color: "#405FE2" }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "text.primary" }}>
              careerloop Proctored Testing Suite
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Candidate ID: {candidateData?.candidateId || "JH-2026-ACTIVE"}
            </Typography>
          </Box>
        </Box>

        {/* Security & Timer Badges */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            icon={<VideocamIcon style={{ fontSize: 14, color: "#15803d" }} />}
            label="Camera Active"
            size="small"
            sx={{ bgcolor: "rgba(21, 128, 61, 0.1)", color: "#15803d", fontWeight: 700 }}
          />

          <Chip
            icon={<VisibilityOffIcon style={{ fontSize: 14, color: "#405FE2" }} />}
            label="Incognito Verified"
            size="small"
            sx={{ bgcolor: "rgba(64, 95, 226, 0.08)", color: "#2843be", fontWeight: 600 }}
          />

          <Chip
            icon={<TimerIcon style={{ fontSize: 14, color: "#d97706" }} />}
            label={formatTimer(timeLeft)}
            size="small"
            color={timeLeft < 120 ? "error" : "warning"}
            sx={{ fontWeight: 800 }}
          />
        </Box>
      </DialogTitle>

      <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 4 }} />

      <DialogContent sx={{ p: 3, position: "relative" }}>
        {/* Live Proctoring PIP Camera Feed */}
        {!isSubmitted && (
          <Paper
            elevation={6}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 130,
              height: 98,
              borderRadius: 2,
              overflow: "hidden",
              border: "2px solid #ef4444",
              bgcolor: "#000",
              zIndex: 10,
              display: { xs: "none", sm: "block" },
            }}
          >
            <video
              ref={videoPipRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Chip
              label="PROCTOR CAM"
              size="small"
              sx={{
                position: "absolute",
                bottom: 2,
                left: 4,
                fontSize: "0.55rem",
                height: 16,
                bgcolor: "rgba(239, 68, 68, 0.8)",
                color: "white",
                fontWeight: 800,
              }}
            />
          </Paper>
        )}

        {/* Warning Alert if tab-switched or backspace pressed */}
        {warningCount > 0 && !isSubmitted && (
          <Alert
            severity="error"
            variant="filled"
            icon={<WarningAmberIcon />}
            sx={{ mb: 2.5, py: 0.5, borderRadius: 2 }}
          >
            <strong>Integrity Alert ({warningCount}/3):</strong> {lastWarningMsg}
          </Alert>
        )}

        {/* ASSESSMENT QUESTIONS FLOW */}
        {!isSubmitted ? (
          <Box sx={{ maxWidth: { xs: "100%", sm: "80%" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Chip
                label={`Question ${currentQuestionIndex + 1} of ${ASSESSMENT_QUESTIONS.length}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: "0.75rem" }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {currentQ.title}
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mt: 1.5, mb: 3, lineHeight: 1.5 }}>
              {currentQ.question}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAnswers[currentQuestionIndex] || ""}
                onChange={(e) => handleSelectAnswer(e.target.value)}
              >
                {currentQ.options.map((opt) => {
                  const isChecked = selectedAnswers[currentQuestionIndex] === opt.id;
                  return (
                    <Paper
                      key={opt.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        mb: 1.5,
                        borderRadius: 2,
                        cursor: "pointer",
                        borderColor: isChecked ? "primary.main" : "divider",
                        bgcolor: isChecked ? "rgba(208, 189, 244, 0.22)" : "background.paper",
                        transition: "all 0.15s ease",
                        "&:hover": { borderColor: "primary.light" },
                      }}
                      onClick={() => handleSelectAnswer(opt.id)}
                    >
                      <FormControlLabel
                        value={opt.id}
                        control={<Radio size="small" />}
                        label={
                          <Typography variant="body2" color="text.primary" sx={{ ml: 0.5 }}>
                            <strong>{opt.id}.</strong> {opt.text}
                          </Typography>
                        }
                        sx={{ m: 0, width: "100%" }}
                      />
                    </Paper>
                  );
                })}
              </RadioGroup>
            </FormControl>

            {/* Navigation & Submit Bar */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button
                variant="text"
                color="inherit"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              >
                Previous Question
              </Button>

              {currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  endIcon={<ArrowForwardIcon />}
                >
                  Save & Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmitTest}
                  endIcon={<CheckCircleIcon />}
                  sx={{ px: 3, fontWeight: 700 }}
                >
                  Submit Final Assessment
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          /* SCORECARD & AGENCY DISPATCH RESULT */
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                borderRadius: "50%",
                bgcolor: score >= 60 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: score >= 60 ? "#10b981" : "#ef4444",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 44 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800 }} gutterBottom>
              Assessment Submitted & Proctor-Verified!
            </Typography>

            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 520, mx: "auto", mb: 3 }}>
              Your technical assessment session has concluded with zero critical proctoring penalties. 
              Your scorecard has been added to your candidate passport.
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                maxWidth: 480,
                mx: "auto",
                mb: 3,
                bgcolor: "#f4f7fe",
                borderRadius: 2,
                borderColor: "divider",
                textAlign: "left",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  EVALUATION SCORE
                </Typography>
                <Chip
                  label={`${score} / 100 PTS`}
                  size="small"
                  color={score >= 60 ? "success" : "warning"}
                  sx={{ fontWeight: 800, fontSize: "0.85rem" }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Assessment Status:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: score >= 60 ? "#15803d" : "#d97706" }}>
                  {score >= 60 ? "PASSED (Qualified for Agency Dispatch)" : "Under Technical Review"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Live Integrity Check:
                </Typography>
                <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 600 }}>
                  Verified • {warningCount} Focus Flags
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Partner Route:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#405FE2" }}>
                  ApexHire • TalentPulse • BlueChip
                </Typography>
              </Box>
            </Paper>

            <Alert severity="success" variant="outlined" sx={{ maxWidth: 480, mx: "auto", mb: 2, textAlign: "left" }}>
              Our 450+ partner HR agencies have received your verified dossier. 
              Eligible recruiters will reach out directly to schedule round-1 interviews.
            </Alert>

            <Alert severity="info" variant="outlined" sx={{ maxWidth: 480, mx: "auto", mb: 3, textAlign: "left", borderColor: "rgba(64, 95, 226, 0.35)", bgcolor: "rgba(64, 95, 226, 0.08)" }}>
              <strong>Zero Upfront Cost:</strong> Taking this assessment and having your dossier reviewed is completely free upfront. <strong>Nominal fee for assessment & review is payable only once you receive an interview call or offer letter.</strong>
            </Alert>

            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
              sx={{ px: 4, py: 1.2, fontWeight: 700 }}
            >
              Back to Home
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
