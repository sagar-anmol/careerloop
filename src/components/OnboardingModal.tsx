"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  ArrowRight, 
  RefreshCw,
  AlertCircle,
  Sparkles,
  Lock
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteAndStartTest: (candidateData: any) => void;
}

export function OnboardingModal({
  isOpen,
  onClose,
  onCompleteAndStartTest,
}: OnboardingModalProps) {
  // Step 1: Info -> Step 2: Live Camera Photo -> Step 3: Resume Upload -> Step 4: Account Done
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form info
  const [candidateInfo, setCandidateInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "B.Tech / BCA / MCA / Graduate",
    experience: "Fresher / 0-1 Year",
    domain: "Full-Stack Development (Next.js)",
    city: "",
  });

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Candidate ID
  const [candidateId, setCandidateId] = useState("");

  // Start webcam when entering Step 2
  useEffect(() => {
    if (isOpen && step === 2 && !capturedPhoto) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, step, capturedPhoto]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      } else {
        setCameraError("Camera device not accessible in this browser.");
      }
    } catch (err: any) {
      console.warn("Camera access denied or unavailable:", err);
      setCameraError("Camera permission denied. Click below to use a simulated verification snapshot for testing.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const useFallbackPhoto = () => {
    // Generate a fallback avatar snapshot if camera isn't available
    setCapturedPhoto("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  // Step 1: Info Submit
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateInfo.fullName || !candidateInfo.email || !candidateInfo.phone) return;
    setStep(2);
  };

  // Step 2: Camera Submit
  const handleCameraProceed = () => {
    if (!capturedPhoto) return;
    setStep(3);
  };

  // Step 3: Resume upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleResumeSubmit = () => {
    if (!resumeFile) return;
    const generatedId = `JH-${Math.floor(100000 + Math.random() * 900000)}`;
    setCandidateId(generatedId);
    setStep(4);
  };

  // Step 4: Final launch test
  const handleLaunchAssessment = () => {
    onClose();
    onCompleteAndStartTest({
      ...candidateInfo,
      candidateId,
      capturedPhoto,
      resumeName: resumeFile?.name || "Candidate_Resume.pdf",
    });
  };

  const resetAll = () => {
    setStep(1);
    setCapturedPhoto(null);
    setResumeFile(null);
    stopCamera();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAll()}>
      <DialogContent className="max-w-xl p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto bg-[#0f172a] text-white border-slate-800">
        
        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pb-4 border-b border-border mb-4">
          <span className={step === 1 ? "text-blue-600 font-bold" : ""}>1. Candidate Info</span>
          <span>&rarr;</span>
          <span className={step === 2 ? "text-blue-600 font-bold" : ""}>2. Live Photo</span>
          <span>&rarr;</span>
          <span className={step === 3 ? "text-blue-600 font-bold" : ""}>3. Resume Upload</span>
          <span>&rarr;</span>
          <span className={step === 4 ? "text-blue-600 font-bold" : ""}>4. Completed</span>
        </div>

        {/* STEP 1: WHOLE CANDIDATE INFO */}
        {step === 1 && (
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <DialogHeader className="space-y-1">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 self-start">
                Step 1 of 3 &bull; Profile Creation
              </Badge>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                Candidate Account Onboarding
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enter your details to create your placement account before taking the proctored assessment.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Full Legal Name *</Label>
                <Input
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={candidateInfo.fullName}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, fullName: e.target.value })}
                  className="h-9.5 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Email Address *</Label>
                <Input
                  type="email"
                  required
                  placeholder="rahul@domain.com"
                  value={candidateInfo.email}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
                  className="h-9.5 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">WhatsApp / Phone *</Label>
                <Input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={candidateInfo.phone}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, phone: e.target.value })}
                  className="h-9.5 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">City / Location *</Label>
                <Input
                  required
                  placeholder="e.g. Bangalore / Delhi / Remote"
                  value={candidateInfo.city}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, city: e.target.value })}
                  className="h-9.5 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Highest Qualification</Label>
                <select
                  value={candidateInfo.qualification}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, qualification: e.target.value })}
                  className="w-full h-9.5 px-3 rounded-xl border border-border bg-card text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="B.Tech / B.E. (Computer Science / IT)">B.Tech / B.E. (CSE / IT)</option>
                  <option value="B.Tech / B.E. (Other Branches)">B.Tech / B.E. (Other Engineering)</option>
                  <option value="BCA / MCA / B.Sc Computer Science">BCA / MCA / B.Sc CS</option>
                  <option value="Non-Tech Degree / Graduate">Non-Tech Degree (B.Com, BBA, BA)</option>
                  <option value="Diploma / Working Professional">Diploma / Working Professional</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Target Domain</Label>
                <select
                  value={candidateInfo.domain}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, domain: e.target.value })}
                  className="w-full h-9.5 px-3 rounded-xl border border-border bg-card text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Full-Stack Development (Next.js)">Full-Stack Next.js 15 &amp; Cloud</option>
                  <option value="AI & LLM Data Engineering">AI, LLMs &amp; Data Engineering</option>
                  <option value="Cloud Architecture & DevOps">Cloud DevOps &amp; Kubernetes</option>
                  <option value="Product UI/UX Design">Product UI/UX Design</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full h-10 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white mt-2">
              Next: Live Camera Photo Verification &rarr;
            </Button>
          </form>
        )}

        {/* STEP 2: LIVE CAMERA PHOTO */}
        {step === 2 && (
          <div className="space-y-4">
            <DialogHeader className="space-y-1">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 self-start">
                Step 2 of 3 &bull; Face Verification
              </Badge>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                Capture Live Webcam Photo
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Our proctored testing engine matches your face during the assessment to maintain strict identity integrity.
              </DialogDescription>
            </DialogHeader>

            {/* Video preview / Snapshot container */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-border shadow-inner">
              {!capturedPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Visual Face Frame Overlay */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-blue-400/60 rounded-2xl m-6 flex items-center justify-center">
                    <span className="text-[11px] text-white/80 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      Align Face Within Frame
                    </span>
                  </div>
                </>
              ) : (
                <img
                  src={capturedPhoto}
                  alt="Captured Candidate Photo"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {cameraError && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{cameraError}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={useFallbackPhoto}
                  className="text-xs h-7 bg-white dark:bg-amber-900 text-amber-900 dark:text-amber-100"
                >
                  Use Verified ID Snapshot &rarr;
                </Button>
              </div>
            )}

            {/* Camera Actions */}
            <div className="flex gap-2">
              {!capturedPhoto ? (
                <Button
                  onClick={captureSnapshot}
                  className="flex-1 h-10 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo Now
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={retakePhoto}
                    className="flex-1 h-10 text-xs font-semibold rounded-xl"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Retake Photo
                  </Button>
                  <Button
                    onClick={handleCameraProceed}
                    className="flex-1 h-10 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Confirm &amp; Proceed &rarr;
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: RESUME UPLOAD */}
        {step === 3 && (
          <div className="space-y-4">
            <DialogHeader className="space-y-1">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 self-start">
                Step 3 of 3 &bull; Document Verification
              </Badge>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                Upload Your Resume
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Upload your latest PDF/Word resume. Our backend HR agencies review this alongside your assessment scorecard.
              </DialogDescription>
            </DialogHeader>

            {/* Drag & drop upload box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/60 hover:bg-blue-50/40 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                {resumeFile ? resumeFile.name : "Click to select or drag & drop resume"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Supported formats: PDF, DOCX (Max 10MB)
              </p>
            </div>

            {resumeFile && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">{resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)</span>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px]">Verified</Badge>
              </div>
            )}

            <Button
              disabled={!resumeFile}
              onClick={handleResumeSubmit}
              className="w-full h-10 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white mt-2 disabled:opacity-50"
            >
              Complete Account Creation &rarr;
            </Button>
          </div>
        )}

        {/* STEP 4: ACCOUNT CREATED & READY FOR STRICT PROCTORED TEST */}
        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold mb-1.5">
                Account Successfully Created
              </Badge>
              <h3 className="text-2xl font-bold text-foreground">
                Welcome, {candidateInfo.fullName}!
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your Candidate Placement ID: <strong className="text-blue-600 font-mono">{candidateId}</strong>
              </p>
            </div>

            {/* Strict testing criteria notice */}
            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-left text-xs space-y-2 text-blue-950">
              <div className="font-bold flex items-center gap-1.5 text-blue-900">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Strict Proctored Assessment Criteria:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-blue-900/90 pl-1 list-disc list-inside">
                <li><strong>Laptop Webcam MUST remain ON</strong> with continuous face tracking.</li>
                <li><strong>No Backspace &amp; No Browser Back button</strong> allowed (navigation is locked).</li>
                <li><strong>Strict Tab Locking:</strong> Switching windows or tabs flags an automatic integrity warning.</li>
                <li><strong>Incognito Mode Recommended:</strong> Disables third-party extensions.</li>
              </ul>
            </div>

            <Button
              onClick={handleLaunchAssessment}
              className="w-full h-11 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
            >
              Launch Strict Proctored Assessment Now &rarr;
            </Button>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
