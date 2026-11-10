"use client";

import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CloseIcon from "@mui/icons-material/Close";
import ShieldIcon from "@mui/icons-material/Shield";
import DescriptionIcon from "@mui/icons-material/Description";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LogoutIcon from "@mui/icons-material/Logout";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HistoryIcon from "@mui/icons-material/History";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";

import {
  fetchCandidateAssessmentHistory,
  TestAttempt,
  signOutCandidate,
} from "@/lib/candidateService";

export interface CandidateProfileData {
  id?: string;
  candidate_id?: string;
  candidateId?: string;
  full_name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  domain?: string;
  experience?: string;
  photo_url?: string;
  photo?: string | null;
  resume_url?: string;
  resume_name?: string;
  resumeName?: string;
  assessment_score?: number | null;
  score?: number | null;
  integrity_flags?: number;
  partner_route?: string;
  plan_tier?: string;
  selected_plan?: string;
  updated_at?: string;
  [key: string]: unknown;
}

interface MuiProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateProfile: CandidateProfileData | null;
  onRetakeTest: (candidateData: CandidateProfileData | null) => void;
  onSignOut: () => void;
}

export function MuiProfileModal({
  isOpen,
  onClose,
  candidateProfile,
  onRetakeTest,
  onSignOut,
}: MuiProfileModalProps) {
  const [history, setHistory] = useState<TestAttempt[]>([]);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [totalTests, setTotalTests] = useState<number>(0);
  const [passRate, setPassRate] = useState<number>(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  const candidateId = candidateProfile?.candidate_id || candidateProfile?.candidateId || "CL-2026-CANDIDATE";
  const fullName = candidateProfile?.full_name || candidateProfile?.fullName || "Candidate";
  const email = candidateProfile?.email || "candidate@example.com";
  const phone = candidateProfile?.phone || "N/A";
  const city = candidateProfile?.city || "India";
  const domain = candidateProfile?.domain || "Technical Engineering / Diploma";
  const photoUrl = candidateProfile?.photo_url || candidateProfile?.photo;
  const resumeUrl = candidateProfile?.resume_url;
  const resumeName = candidateProfile?.resume_name || "Resume.pdf";
  const currentScore = candidateProfile?.assessment_score ?? candidateProfile?.score ?? null;

  useEffect(() => {
    if (!isOpen || !candidateId) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        const result = await fetchCandidateAssessmentHistory(candidateId);
        if (!isMounted) return;

        if (result.history.length > 0) {
          setHistory(result.history);
          setAverageScore(result.averageScore);
          setTotalTests(result.totalTests);
          setPassRate(result.passRate);
        } else if (currentScore !== null) {
          const baselineAttempt: TestAttempt = {
            id: "baseline-1",
            candidate_id: candidateId,
            test_title: "Technical & Industrial Safety Assessment",
            score: currentScore,
            total_score: 100,
            status: currentScore >= 60 ? "PASSED (Qualified)" : "Under Review",
            integrity_flags: candidateProfile?.integrity_flags ?? 0,
            partner_route: candidateProfile?.partner_route || "ApexHire • TalentPulse • BlueChip",
            duration_seconds: 340,
            completed_at: candidateProfile?.updated_at || new Date().toISOString(),
          };
          setHistory([baselineAttempt]);
          setAverageScore(currentScore);
          setTotalTests(1);
          setPassRate(currentScore >= 60 ? 100 : 0);
        } else {
          setHistory([]);
          setAverageScore(0);
          setTotalTests(0);
          setPassRate(0);
        }
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, candidateId, currentScore, candidateProfile]);

  const handleLaunchTest = () => {
    if (totalTests >= 2) return;
    onClose();
    onRetakeTest(candidateProfile);
  };

  const handleSignOutClick = async () => {
    await signOutCandidate();
    onClose();
    onSignOut();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: "background.paper",
            p: 1,
            overflow: "hidden",
          },
        },
      }}
    >
      {/* Header bar */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, px: 3, pt: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <VerifiedUserIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Candidate Profile &amp; Test Performance
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* Candidate Identity Overview Card */}
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2.5,
            bgcolor: "#f8faff",
            borderColor: "rgba(64, 95, 226, 0.2)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 2.5,
          }}
        >
          {/* Photo / Avatar */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={photoUrl || undefined}
              alt={fullName}
              sx={{
                width: 90,
                height: 90,
                borderRadius: 2.5,
                bgcolor: "primary.main",
                fontSize: "2rem",
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(64, 95, 226, 0.25)",
                border: "2px solid #ffffff",
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </Avatar>
            <Chip
              label="Verified"
              size="small"
              color="success"
              sx={{
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%)",
                height: 18,
                fontSize: "0.65rem",
                fontWeight: 800,
              }}
            />
          </Box>

          {/* Details */}
          <Box sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" } }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, justifyContent: { xs: "center", sm: "flex-start" }, mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {fullName}
              </Typography>
              <Chip
                label={candidateId}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, fontSize: "0.75rem", height: 22 }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", justifyContent: { xs: "center", sm: "flex-start" }, mb: 1.5 }}>
              <SchoolIcon sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {domain}
              </Typography>
            </Box>

            {/* Quick Contact & Location Badges */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, fontSize: "0.82rem", color: "text.secondary", justifyContent: { xs: "center", sm: "flex-start" } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <EmailIcon sx={{ fontSize: 15 }} />
                <span>{email}</span>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 15 }} />
                <span>{phone}</span>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 15 }} />
                <span>{city}</span>
              </Box>
            </Box>
          </Box>

          {/* Action: Resume or Sign Out */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 150 }}>
            {resumeUrl ? (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<DescriptionIcon />}
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.78rem" }}
              >
                View Resume
              </Button>
            ) : (
              <Chip
                icon={<DescriptionIcon />}
                label={resumeName}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.72rem" }}
              />
            )}

            <Button
              variant="text"
              color="inherit"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleSignOutClick}
              sx={{ textTransform: "none", color: "text.secondary", fontSize: "0.78rem" }}
            >
              Sign Out
            </Button>
          </Box>
        </Paper>

        {/* PERFORMANCE KPI METRICS ROW */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1.5 }}>
          Assessment Performance &amp; Average Score
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
          {/* Card 1: Average Score */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              textAlign: "center",
              bgcolor: averageScore >= 60 ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)",
              borderColor: averageScore >= 60 ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
              AVERAGE SCORE
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: averageScore >= 60 ? "#15803d" : averageScore > 0 ? "#d97706" : "text.secondary",
                my: 0.5,
              }}
            >
              {totalTests > 0 ? `${averageScore}%` : "—"}
            </Typography>
            <Chip
              label={averageScore >= 60 ? "PASSED (Qualified)" : averageScore > 0 ? "Under Review" : "No Tests"}
              size="small"
              color={averageScore >= 60 ? "success" : "default"}
              sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20 }}
            />
          </Paper>

          {/* Card 2: Tests Taken */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
              TESTS ATTEMPTED
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary", my: 0.5 }}>
              {totalTests}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Total Proctored Exams
            </Typography>
          </Paper>

          {/* Card 3: Pass Rate */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
              PASSING RATE
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#405FE2", my: 0.5 }}>
              {totalTests > 0 ? `${passRate}%` : "—"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Min. 60% Qualifying Mark
            </Typography>
          </Paper>

          {/* Card 4: Proctoring Integrity */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
              INTEGRITY RATING
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#10b981", my: 0.5 }}>
              100%
            </Typography>
            <Typography variant="caption" sx={{ color: "#15803d", fontWeight: 600 }}>
              Verified WebCam Session
            </Typography>
          </Paper>
        </Box>

        {/* PREVIOUS TESTS HISTORY TABLE */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HistoryIcon sx={{ color: "primary.main", fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              All Previous Tests &amp; Attempt Logs
            </Typography>
            <Chip
              label={`${Math.min(totalTests, 2)} / 2 Attempts Used`}
              size="small"
              color={totalTests >= 2 ? "error" : "primary"}
              sx={{ fontWeight: 700, fontSize: "0.72rem", height: 22 }}
            />
          </Box>

          <Button
            variant="contained"
            color={totalTests >= 2 ? "inherit" : "primary"}
            size="small"
            startIcon={<PlayArrowIcon />}
            onClick={handleLaunchTest}
            disabled={totalTests >= 2}
            sx={{ fontWeight: 700, textTransform: "none" }}
          >
            {totalTests >= 2 ? "Attempt Limit Reached (Max 2)" : totalTests === 1 ? "Retake Assessment (Final Attempt)" : "Take Assessment"}
          </Button>
        </Box>

        {totalTests >= 2 && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: "rgba(239, 68, 68, 0.05)",
              borderColor: "rgba(239, 68, 68, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <ShieldIcon sx={{ color: "#ef4444" }} />
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              <strong>Maximum Attempts Reached:</strong> Each candidate is permitted a maximum of <strong>2 proctored attempts</strong>. Your highest score has been sealed and dispatched to partner employers.
            </Typography>
          </Paper>
        )}

        {isLoadingHistory ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : history.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
              No assessment attempts recorded yet
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Take the free proctored technical test to generate your verified competency passport.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleLaunchTest} startIcon={<PlayArrowIcon />}>
              Start Proctored Test Now
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Date &amp; Time</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Assessment Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Score</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Integrity Check</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((test, index) => {
                  const dateStr = test.completed_at
                    ? new Date(test.completed_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently";

                  return (
                    <TableRow key={test.id || index} hover>
                      <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                        {dateStr}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                        {test.test_title}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${test.score} / ${test.total_score || 100}`}
                          size="small"
                          color={test.score >= 60 ? "success" : "warning"}
                          sx={{ fontWeight: 800, fontSize: "0.75rem", height: 22 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: test.score >= 60 ? "#15803d" : "#d97706",
                          }}
                        >
                          {test.score >= 60 ? "PASSED (Qualified)" : "Under Review"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<ShieldIcon sx={{ fontSize: "14px !important" }} />}
                          label={`${test.integrity_flags || 0} Flags`}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 20,
                            fontSize: "0.68rem",
                            color: (test.integrity_flags || 0) === 0 ? "#15803d" : "#d97706",
                            borderColor: (test.integrity_flags || 0) === 0 ? "rgba(21, 128, 61, 0.3)" : "rgba(217, 119, 6, 0.3)",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}
