"use client";

import React, { useState, useRef, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VideocamIcon from "@mui/icons-material/Videocam";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { registerCandidateDossier, normalizePhone, CandidateRegistrationInput } from "@/lib/candidateService";
import { detectFaces, FaceDetectionResult } from "@/lib/faceDetectionService";

export interface CandidateOnboardingData extends Partial<CandidateRegistrationInput> {
  fullName: string;
  email: string;
  phone: string;
  domain: string;
  experience: string;
  city: string;
  candidateId: string;
  photo?: string | null;
  resumeName?: string;
  [key: string]: unknown;
}

interface MuiOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSignup: (candidateData: CandidateOnboardingData) => void;
  onCompleteAndStartTest: (candidateData: CandidateOnboardingData) => void;
}

const steps = ["Candidate Info", "Live Photo ID", "Program & Consent", "Account Ready"];

export function MuiOnboardingModal({
  isOpen,
  onClose,
  onCompleteSignup,
  onCompleteAndStartTest,
}: MuiOnboardingModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    domain: "",
    experience: "",
    city: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Camera State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [faceResult, setFaceResult] = useState<FaceDetectionResult | null>(null);

  // Program & Consent State
  const [selectedPlan, setSelectedPlan] = useState<"starter_practice" | "pro_all_access" | "mentorship_1on1">("pro_all_access");
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [step2Submitted, setStep2Submitted] = useState(false);

  // Resume State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [candidateId, setCandidateId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Start/Stop Camera when entering or leaving Step 1
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (isOpen && activeStep === 1 && !capturedPhoto) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { width: 640, height: 480 } })
          .then((mediaStream) => {
            activeStream = mediaStream;
            setCameraError(null);
            setStream(mediaStream);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
              videoRef.current.play().catch((e) => console.debug("Video play err:", e));
            }
          })
          .catch((err: unknown) => {
            console.warn("Camera access error:", err);
            setCameraError(
              "Camera permission was denied or no camera device found. You may use a simulated verification snapshot for testing."
            );
          });
      } else {
        setTimeout(() => {
          setCameraError("Webcam access not supported in this browser environment.");
        }, 0);
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      setStream((prev) => {
        if (prev) {
          prev.getTracks().forEach((track) => track.stop());
        }
        return null;
      });
      setFaceResult(null);
    };
  }, [isOpen, activeStep, capturedPhoto]);

  // Real-time Face Tracking during Onboarding Photo verification
  useEffect(() => {
    if (!isOpen || activeStep !== 1 || !stream || capturedPhoto) {
      return;
    }

    const interval = setInterval(async () => {
      if (videoRef.current) {
        try {
          const res = await detectFaces(videoRef.current);
          setFaceResult(res);
        } catch (e) {
          console.debug("Onboarding face tracking error:", e);
        }
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen, activeStep, stream, capturedPhoto]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch((e) => console.debug("Video play err:", e));
        }
      }
    } catch (err: unknown) {
      console.warn("Camera restart error:", err);
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Run face detection on the captured canvas frame before accepting
        const detectRes = await detectFaces(canvas);
        setFaceResult(detectRes);

        if (detectRes.status === "no_face" || detectRes.status === "camera_blocked") {
          setCameraError("Cannot capture: No face detected. Please position your face directly in front of the camera.");
          return;
        }

        if (detectRes.status === "multiple_faces") {
          setCameraError("Cannot capture: Multiple persons detected. Only one candidate is allowed in the verified photo ID.");
          return;
        }

        if (detectRes.status === "misaligned") {
          setCameraError(`Cannot capture: ${detectRes.message}. Please center your face inside the green guide.`);
          return;
        }

        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedPhoto(dataUrl);
        setCameraError(null);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  // Step 1 validation
  const handleValidateStep0 = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required (as per matriculation marksheet)";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errors.email = "Valid email address is required";
    if (!formData.password || formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (!/^\d{10}$/.test(formData.phone))
      errors.phone = "Enter a valid 10-digit mobile number";
    if (!formData.city.trim()) errors.city = "Current city/location is required";
    if (!formData.domain.trim()) errors.domain = "Educational qualification is required";
    if (!formData.experience.trim()) errors.experience = "Passing / experience status is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setActiveStep(1);
  };

  // Step 2 validation
  const handleValidateStep1 = () => {
    if (!capturedPhoto) {
      setCameraError("Live photo ID verification is compulsory before proceeding.");
      return;
    }
    setActiveStep(2);
  };

  // Step 3 validation (Resume) -> Register in Supabase
  const handleValidateStep2 = async () => {
    setStep2Submitted(true);
    if (!resumeFile) {
      setSaveError("Uploading your resume (PDF/DOCX) is compulsory to proceed.");
      return;
    }
    if (!consentAgreed) {
      setSaveError("You must accept the DPDP data processing & terms consent to proceed.");
      return;
    }

    const newId = `CL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setCandidateId(newId);

    setIsSaving(true);
    setSaveError(null);
    try {
      await registerCandidateDossier({
        ...formData,
        candidateId: newId,
        photoBase64: capturedPhoto,
        resumeFile: resumeFile,
        selectedPlan,
      });
      setActiveStep(3);
    } catch (err: unknown) {
      console.error("Failed to register candidate to Supabase:", err);
      const msg = err instanceof Error ? err.message : "Saved locally; database sync failed.";
      setSaveError(msg);
      setActiveStep(3);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinishAndGoToProfile = () => {
    const finalData = {
      ...formData,
      candidateId,
      photo: capturedPhoto,
      resumeName: resumeFile ? resumeFile.name : "Resume.pdf",
      partner_route:
        selectedPlan === "pro_all_access"
          ? "CareerLoop Pro (₹4,999)"
          : selectedPlan === "mentorship_1on1"
          ? "1-on-1 Mentorship (₹8,999)"
          : "Starter Practice (₹1,999)",
      selected_plan: selectedPlan,
    };
    onCompleteSignup(finalData);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            borderRadius: 3,
            p: 1,
          },
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{ m: 0, p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Candidate Onboarding
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Step {activeStep + 1} of 4 • Free Baseline or CareerLoop Pro
          </Typography>
        </Box>
        <IconButton aria-label="close" onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Stepper Indicator */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                slotProps={{
                  stepIcon: {
                    sx: {
                      "&.Mui-active": { color: "primary.main" },
                      "&.Mui-completed": { color: "#10b981" },
                    },
                  },
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Dialog Content */}
      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* STEP 0: CANDIDATE INFO */}
        {activeStep === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Alert severity="info" variant="outlined" sx={{ mb: 1, py: 0.5 }}>
              Please ensure that your information here matches exactly with your matriculation (10th) marksheet.
            </Alert>

            <TextField
              label="Full Name"
              size="small"
              fullWidth
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={Boolean(formErrors.fullName)}
              helperText={formErrors.fullName}
              placeholder="e.g. Rahul Sharma"
              required
            />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField
                label="Email Address"
                size="small"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                placeholder="rahul@example.com"
                required
              />
              <TextField
                label="Password"
                size="small"
                fullWidth
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password || "Minimum 6 characters"}
                placeholder="Create secure password"
                required
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField
                label="WhatsApp / Mobile Number"
                size="small"
                fullWidth
                value={formData.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  const next = digits.length > 10 ? normalizePhone(digits) : digits;
                  setFormData({ ...formData, phone: next.slice(0, 10) });
                }}
                error={Boolean(formErrors.phone)}
                helperText={formErrors.phone || "10 digits, digits only"}
                placeholder="10-digit number"
                slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 10, autoComplete: "tel" } }}
                required
              />
              <TextField
                label="Current Location / City"
                size="small"
                fullWidth
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                error={Boolean(formErrors.city)}
                helperText={formErrors.city}
                placeholder="e.g. Bengaluru, Pune, Delhi NCR"
                required
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField
                select
                label="Educational Qualification"
                size="small"
                fullWidth
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                error={Boolean(formErrors.domain)}
                helperText={formErrors.domain}
                required
              >
                <MenuItem value="Diploma (Mechanical / Automobile / Tech)">Diploma (Mechanical / Automobile / Tech)</MenuItem>
                <MenuItem value="Diploma (Electrical / Electronics)">Diploma (Electrical / Electronics)</MenuItem>
                <MenuItem value="ITI (Fitter / Turner / Machinist / CNC)">ITI (Fitter / Turner / Machinist / CNC)</MenuItem>
                <MenuItem value="B.E. / B.Tech (Mechanical / Automobile)">B.E. / B.Tech (Mechanical / Automobile)</MenuItem>
                <MenuItem value="B.E. / B.Tech (Electrical / Electronics / CS)">B.E. / B.Tech (Electrical / Electronics / CS)</MenuItem>
                <MenuItem value="General Graduate (BA / B.Com / B.Sc)">General Graduate (BA / B.Com / B.Sc)</MenuItem>
              </TextField>

              <TextField
                select
                label="Passing / Experience Status"
                size="small"
                fullWidth
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                error={Boolean(formErrors.experience)}
                helperText={formErrors.experience}
                required
              >
                <MenuItem value="Fresher / Apprentice Cohort">Fresher / Apprentice Cohort</MenuItem>
                <MenuItem value="1 Year Technical Experience">1 Year Technical Experience</MenuItem>
                <MenuItem value="2-3 Years Industrial Experience">2-3 Years Industrial Experience</MenuItem>
                <MenuItem value="3+ Years Senior Technician">3+ Years Senior Technician</MenuItem>
              </TextField>
            </Box>
          </Box>
        )}

        {/* STEP 1: LIVE WEBCAM PHOTO ID */}
        {activeStep === 1 && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
              Live Identity Snapshot
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Our proctored testing engine matches your face during the assessment to verify test integrity.
            </Typography>

            {cameraError && (
              <Alert severity="warning" variant="outlined" sx={{ mb: 2, textAlign: "left" }}>
                {cameraError}
              </Alert>
            )}

            <Box
              sx={{
                width: "100%",
                maxWidth: 420,
                height: 280,
                mx: "auto",
                borderRadius: 2,
                overflow: "hidden",
                border: "2px dashed",
                borderColor: capturedPhoto ? "#15803d" : "primary.main",
                bgcolor: "#172b38",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!capturedPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Chip
                    icon={<VideocamIcon style={{ fontSize: 14, color: "#ef4444" }} />}
                    label="Live Preview"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      bgcolor: "rgba(0,0,0,0.7)",
                      color: "white",
                      fontSize: "0.7rem",
                    }}
                  />

                  {/* Face Alignment Oval Guide */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "55%",
                      height: "75%",
                      border: "3px solid",
                      borderColor:
                        faceResult?.status === "verified"
                          ? "#10b981"
                          : faceResult?.status === "multiple_faces"
                          ? "#ef4444"
                          : "#f59e0b",
                      borderRadius: "50%",
                      pointerEvents: "none",
                      boxShadow:
                        faceResult?.status === "verified"
                          ? "0 0 24px rgba(16, 185, 129, 0.6), inset 0 0 16px rgba(16, 185, 129, 0.2)"
                          : "0 0 12px rgba(245, 158, 11, 0.3)",
                      transition: "all 0.25s ease",
                    }}
                  />

                  {/* Live Face Detection Status Chip */}
                  <Chip
                    icon={
                      faceResult?.status === "verified" ? (
                        <CheckCircleIcon style={{ fontSize: 14, color: "#ffffff" }} />
                      ) : (
                        <WarningAmberIcon style={{ fontSize: 14, color: "#ffffff" }} />
                      )
                    }
                    label={
                      faceResult?.status === "verified"
                        ? "Face Perfectly Aligned & Verified"
                        : faceResult?.status === "multiple_faces"
                        ? `Alert: ${faceResult.faceCount} Faces Detected`
                        : faceResult?.status === "misaligned"
                        ? (faceResult.message || "Align Face Inside Green Circle")
                        : faceResult?.status === "camera_blocked"
                        ? "Camera Obstructed / Too Dark"
                        : "Align Face Inside Green Circle"
                    }
                    size="small"
                    color={
                      faceResult?.status === "verified"
                        ? "success"
                        : faceResult?.status === "multiple_faces"
                        ? "error"
                        : "warning"
                    }
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      fontWeight: 700,
                      fontSize: "0.74rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                    }}
                  />
                </>
              ) : (
                <Box
                  component="img"
                  src={capturedPhoto}
                  alt="Captured Photo"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </Box>
            <canvas ref={canvasRef} style={{ display: "none" }} />

            <Box sx={{ mt: 2.5, display: "flex", justifyContent: "center", gap: 2 }}>
              {!capturedPhoto ? (
                <Button
                  variant="contained"
                  color={faceResult?.status === "verified" ? "success" : "primary"}
                  startIcon={<PhotoCameraIcon />}
                  onClick={capturePhoto}
                  disabled={faceResult?.status !== "verified"}
                  sx={{
                    px: 3.5,
                    py: 1,
                    fontWeight: 700,
                    boxShadow: faceResult?.status === "verified" ? "0 4px 14px rgba(16, 185, 129, 0.4)" : "none",
                  }}
                >
                  {faceResult?.status === "verified" ? "Capture Verified Photo" : "Align Face to Capture"}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<RefreshIcon />}
                  onClick={retakePhoto}
                >
                  Retake Photo
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* STEP 2: PROGRAM SELECTION & RESUME */}
        {activeStep === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ textAlign: "center", mb: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
                Select Program &amp; Upload Resume
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Choose your participation tier and attach your resume for your candidate dossier.
              </Typography>
            </Box>

            {/* Plan Selector */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 1.5 }}>
              <Paper
                variant="outlined"
                onClick={() => setSelectedPlan("starter_practice")}
                sx={{
                  p: 1.8,
                  borderRadius: 2,
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: selectedPlan === "starter_practice" ? "primary.main" : "divider",
                  bgcolor: selectedPlan === "starter_practice" ? "rgba(37, 99, 235, 0.05)" : "background.paper",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                      Starter Pass
                    </Typography>
                    <Chip label="₹1,999" size="small" color="default" sx={{ fontWeight: 700, fontSize: "0.68rem" }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "0.72rem", lineHeight: 1.35 }}>
                    Weekly mock tests &amp; standard resume check.
                  </Typography>
                </div>
              </Paper>

              <Paper
                variant="outlined"
                onClick={() => setSelectedPlan("pro_all_access")}
                sx={{
                  p: 1.8,
                  borderRadius: 2,
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: selectedPlan === "pro_all_access" ? "#10b981" : "divider",
                  bgcolor: selectedPlan === "pro_all_access" ? "rgba(16, 185, 129, 0.05)" : "background.paper",
                  transition: "all 0.2s",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#047857" }}>
                      Pro All-Access
                    </Typography>
                    <Chip label="₹4,999" size="small" color="success" sx={{ fontWeight: 700, fontSize: "0.68rem" }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "0.72rem", lineHeight: 1.35 }}>
                    Weekly mocks, live mentorship &amp; direct 450+ HR referrals.
                  </Typography>
                </div>
              </Paper>

              <Paper
                variant="outlined"
                onClick={() => setSelectedPlan("mentorship_1on1")}
                sx={{
                  p: 1.8,
                  borderRadius: 2,
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: selectedPlan === "mentorship_1on1" ? "#d97706" : "divider",
                  bgcolor: selectedPlan === "mentorship_1on1" ? "rgba(217, 119, 6, 0.05)" : "background.paper",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#b45309" }}>
                      1-on-1 Intensive
                    </Typography>
                    <Chip label="₹8,999" size="small" color="warning" sx={{ fontWeight: 700, fontSize: "0.68rem" }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "0.72rem", lineHeight: 1.35 }}>
                    Dedicated senior industry mocks &amp; custom company targeting.
                  </Typography>
                </div>
              </Paper>
            </Box>

            {/* Resume Upload Box */}
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                border: "2px dashed",
                borderColor: resumeFile ? "#15803d" : step2Submitted && !resumeFile ? "#ef4444" : "divider",
                borderRadius: 2,
                bgcolor: resumeFile ? "rgba(21, 128, 61, 0.05)" : step2Submitted && !resumeFile ? "rgba(239, 68, 68, 0.05)" : "background.paper",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
                "&:hover": { borderColor: resumeFile ? "#15803d" : "primary.main" },
              }}
              component="label"
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setResumeFile(e.target.files[0]);
                    if (saveError) setSaveError(null);
                  }
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    bgcolor: resumeFile ? "rgba(16, 185, 129, 0.1)" : "rgba(37, 99, 235, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: resumeFile ? "#10b981" : "primary.main",
                  }}
                >
                  {resumeFile ? <CheckCircleIcon fontSize="small" /> : <UploadFileIcon fontSize="small" />}
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  {resumeFile ? (
                    <>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#34d399", fontSize: "0.85rem" }}>
                        {resumeFile.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.85rem" }}>
                        Attach Resume (PDF / DOCX) *
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Compulsory for verified candidate dossier registration
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* DPDP Consent */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: step2Submitted && !consentAgreed ? "rgba(239, 68, 68, 0.05)" : "#f8fafc",
                border: "1px solid",
                borderColor: step2Submitted && !consentAgreed ? "#ef4444" : "divider",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                transition: "all 0.2s",
              }}
            >
              <input
                type="checkbox"
                id="dpdp-consent"
                checked={consentAgreed}
                onChange={(e) => {
                  setConsentAgreed(e.target.checked);
                  if (saveError) setSaveError(null);
                }}
                style={{ marginTop: 3, cursor: "pointer" }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.4 }} component="label" htmlFor="dpdp-consent">
                <strong>Data Processing &amp; Terms Consent:</strong> I agree to the processing of my proctoring data and assessment scores in full compliance with the Digital Personal Data Protection (DPDP) Act 2023. I understand that the program fee covers weekly mock tests, live mentorship, and resume curation, with complimentary direct referrals to fast-hiring HR partner networks.
              </Typography>
            </Box>

            {saveError && (
              <Alert severity="error" variant="outlined" sx={{ py: 0.5, fontSize: "0.82rem" }}>
                {saveError}
              </Alert>
            )}
          </Box>
        )}

        {/* STEP 3: ACCOUNT CREATED READY */}
        {activeStep === 3 && (
          <Box sx={{ textAlign: "center", py: 1 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                mx: "auto",
                mb: 2,
                borderRadius: "50%",
                bgcolor: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 36 }} />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
              Candidate Profile Ready!
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Your verified identity has been registered with our partner recruiting engine.
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 2.5,
                textAlign: "left",
                bgcolor: "#f4f7fe",
                borderRadius: 2,
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  CANDIDATE ID
                </Typography>
                <Chip label={candidateId} size="small" color="primary" sx={{ fontWeight: 700, fontSize: "0.75rem" }} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  CANDIDATE NAME
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {formData.fullName}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  TARGET DOMAIN
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {formData.domain}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  PROCTORING CLEARANCE
                </Typography>
                <Typography variant="caption" sx={{ color: "#34d399", fontWeight: 700 }}>
                  Photo Verified & Ready
                </Typography>
              </Box>
            </Paper>

            {saveError && (
              <Alert severity="warning" variant="outlined" sx={{ textAlign: "left", fontSize: "0.8rem", mb: 1.5 }}>
                {saveError}
              </Alert>
            )}

            <Alert severity="success" variant="outlined" sx={{ textAlign: "left", fontSize: "0.8rem", mb: 1.5 }}>
              <strong>Registration Completed:</strong> Your candidate profile and credentials have been securely stored. You can now view your profile dashboard or proceed to the assessment whenever you choose.
            </Alert>
          </Box>
        )}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, justifyContent: "space-between" }}>
        {activeStep > 0 && activeStep < 3 ? (
          <Button
            onClick={() => setActiveStep((prev) => prev - 1)}
            variant="text"
            color="inherit"
          >
            Back
          </Button>
        ) : (
          <Box />
        )}

        {activeStep === 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleValidateStep0}
            endIcon={<ArrowForwardIcon />}
          >
            Next: Verify Photo ID
          </Button>
        )}

        {activeStep === 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleValidateStep1}
            disabled={!capturedPhoto}
            endIcon={<ArrowForwardIcon />}
          >
            Next: Program &amp; Consent
          </Button>
        )}

        {activeStep === 2 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleValidateStep2}
            disabled={isSaving}
            sx={{
              bgcolor: "#405FE2",
              color: "#ffffff",
              fontWeight: 700,
              px: 3,
              "&:hover": { bgcolor: "#2843be" },
            }}
            endIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
          >
            {isSaving
              ? "Saving to Database..."
              : selectedPlan === "pro_all_access"
              ? "Enroll in Pro All-Access (₹4,999)"
              : selectedPlan === "mentorship_1on1"
              ? "Enroll in 1-on-1 Mentorship (₹8,999)"
              : "Enroll in Starter Pass (₹1,999)"}
          </Button>
        )}

        {activeStep === 3 && (
          <Box sx={{ width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleFinishAndGoToProfile}
              startIcon={<PersonIcon />}
              sx={{ py: 1.3, fontWeight: 700 }}
            >
              Open My Profile &amp; Dashboard
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}
