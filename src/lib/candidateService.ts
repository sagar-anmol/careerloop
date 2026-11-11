import { supabase } from "./supabaseClient";

export interface CandidateRegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  domain: string;
  experience: string;
  city: string;
  candidateId: string;
  photoBase64?: string | null;
  resumeFile?: File | null;
  selectedPlan?: string;
}

export interface AssessmentResultInput {
  candidateId: string;
  score: number;
  status: string;
  flags: number;
  partnerRoute: string;
  testTitle?: string;
  durationSeconds?: number;
}

export interface TestAttempt {
  id: string;
  candidate_id: string;
  test_title: string;
  domain?: string;
  score: number;
  total_score: number;
  status: string;
  integrity_flags: number;
  partner_route: string;
  duration_seconds: number;
  completed_at: string;
}

/**
 * Normalise an Indian mobile number to 10 digits.
 * Accepts pasted formats like "+91 98765 43210", "098765-43210", "9876543210".
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

/**
 * Register candidate account with Supabase Auth and save profile + files into Postgres / Storage
 */
export async function registerCandidateDossier(input: CandidateRegistrationInput) {
  const normalizedPhone = normalizePhone(input.phone);
  if (!/^\d{10}$/.test(normalizedPhone)) {
    throw new Error("Enter a valid 10-digit mobile number.");
  }

  let authUserId: string | null = null;

  // 1. If a password was provided, create the account through the API route
  // (auto-confirmed) and then sign in with the credentials the user typed.
  if (input.password && input.password.length >= 6) {
    let apiError: string | null = null;
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: input.email.trim(),
          password: input.password,
          fullName: input.fullName,
          phone: input.phone,
          domain: input.domain,
          candidateId: input.candidateId,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.user?.id) {
          authUserId = json.user.id;
        }
      } else {
        const json = await res.json().catch(() => null);
        apiError =
          typeof json?.error === "string"
            ? json.error
            : res.status === 409
            ? "An account with this email already exists. Sign in instead."
            : "Could not create your account.";
      }
    } catch (e) {
      console.warn("API registration failed:", e);
      apiError = "Could not reach the signup service. Check your connection and try again.";
    }

    // For a new account this establishes the session. For an existing email it
    // only succeeds with the correct password — the API never resets one.
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email: input.email.trim(),
      password: input.password,
    });

    if (signInData?.user) {
      authUserId = signInData.user.id;
    } else if (apiError) {
      throw new Error(apiError);
    }
  }

  // 1b. Fall back to the existing session (profile edit / onboarding retry).
  if (!authUserId) {
    const { data: sessionData } = await supabase.auth.getUser();
    if (sessionData?.user) authUserId = sessionData.user.id;
  }

  if (!authUserId) {
    throw new Error("Sign in first so your profile can be linked to your account.");
  }

  // 2. Upload Photo to Supabase Storage if available
  let photoUrl: string | null = null;
  if (input.photoBase64 && input.photoBase64.startsWith("data:image")) {
    try {
      const base64Data = input.photoBase64.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      const photoPath = `photos/${input.candidateId}_${Date.now()}.jpg`;

      const { error: uploadErr } = await supabase.storage
        .from("candidate-assets")
        .upload(photoPath, blob, { contentType: "image/jpeg", upsert: true });

      if (!uploadErr) {
        const { data: publicUrlData } = supabase.storage
          .from("candidate-assets")
          .getPublicUrl(photoPath);
        photoUrl = publicUrlData.publicUrl;
      } else {
        // Fallback: keep base64 or null
        photoUrl = input.photoBase64;
      }
    } catch (e) {
      console.warn("Error uploading photo:", e);
      photoUrl = input.photoBase64;
    }
  }

  // 3. Upload Resume if available
  let resumeUrl: string | null = null;
  const resumeName: string = input.resumeFile ? input.resumeFile.name : "Resume.pdf";

  if (input.resumeFile) {
    try {
      const resumePath = `resumes/${input.candidateId}_${input.resumeFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: resumeUploadErr } = await supabase.storage
        .from("candidate-assets")
        .upload(resumePath, input.resumeFile, { upsert: true });

      if (!resumeUploadErr) {
        const { data: publicUrlData } = supabase.storage
          .from("candidate-assets")
          .getPublicUrl(resumePath);
        resumeUrl = publicUrlData.publicUrl;
      }
    } catch (e) {
      console.warn("Error uploading resume:", e);
    }
  }

  // 4. One profile per account: look up our own row, then upsert on
  // auth_user_id. The unique index makes a duplicate impossible even if two
  // tabs submit at the same moment.
  const normalizedEmail = input.email.trim().toLowerCase();
  const { data: existingCandidate } = await supabase
    .from("candidates")
    .select("candidate_id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  const payload = {
    auth_user_id: authUserId,
    candidate_id: existingCandidate?.candidate_id || input.candidateId,
    full_name: input.fullName,
    email: normalizedEmail,
    phone: normalizedPhone,
    domain: input.domain,
    experience: input.experience,
    city: input.city,
    photo_url: photoUrl,
    resume_url: resumeUrl,
    resume_name: resumeName,
    partner_route:
      input.selectedPlan === "mentorship_1on1"
        ? "1-on-1 Mentorship (₹8,999)"
        : input.selectedPlan === "pro_all_access"
        ? "CareerLoop Pro (₹4,999)"
        : "Starter Practice (₹1,999)",
    updated_at: new Date().toISOString(),
  };

  const { data: candidateDataResult, error: saveErr } = await supabase
    .from("candidates")
    .upsert(payload, { onConflict: "auth_user_id" })
    .select()
    .single();

  if (saveErr) {
    const detail = `${saveErr.message} ${saveErr.details ?? ""} ${saveErr.code ?? ""}`;
    const isDuplicate = /duplicate key|23505|already exists/i.test(detail);
    if (isDuplicate && /phone/i.test(detail)) {
      throw new Error("This mobile number is already registered with another account.");
    }
    if (isDuplicate && /email/i.test(detail)) {
      throw new Error("This email is already registered with another account.");
    }
    if (/23514|candidates_phone_10_digits/i.test(detail)) {
      throw new Error("Enter a valid 10-digit mobile number.");
    }
    throw new Error(saveErr.message);
  }

  // Cache in localStorage for immediate profile navigation
  if (typeof window !== "undefined") {
    localStorage.setItem("cl_candidate", JSON.stringify(candidateDataResult));
  }

  return candidateDataResult;
}

/**
 * Record proctored assessment score and history attempt
 */
export async function recordAssessmentResult(input: AssessmentResultInput) {
  // 1. Insert into candidate_assessments history table
  try {
    await supabase.from("candidate_assessments").insert({
      candidate_id: input.candidateId,
      test_title: input.testTitle || "Comprehensive Technical & Safety Assessment",
      score: input.score,
      total_score: 100,
      status: input.status,
      integrity_flags: input.flags,
      partner_route: input.partnerRoute,
      duration_seconds: input.durationSeconds || 320,
      completed_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Failed to insert attempt history:", err);
  }

  // 2. Update current score and status on candidate profile
  const { data, error } = await supabase
    .from("candidates")
    .update({
      assessment_score: input.score,
      assessment_status: input.status,
      integrity_flags: input.flags,
      partner_route: input.partnerRoute,
      updated_at: new Date().toISOString(),
    })
    .eq("candidate_id", input.candidateId)
    .select();

  if (error) {
    console.error("Failed to update assessment score:", error);
  }

  return data;
}

/**
 * Fetch candidate assessment history, calculating average score & pass rate
 */
export async function fetchCandidateAssessmentHistory(candidateId: string) {
  const { data, error } = await supabase
    .from("candidate_assessments")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("completed_at", { ascending: false });

  if (error) {
    console.error("Error fetching assessment history:", error);
    return {
      history: [] as TestAttempt[],
      averageScore: 0,
      totalTests: 0,
      passRate: 0,
    };
  }

  const history = (data || []) as TestAttempt[];
  const totalTests = history.length;
  if (totalTests === 0) {
    return {
      history: [],
      averageScore: 0,
      totalTests: 0,
      passRate: 0,
    };
  }

  const sumScores = history.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const averageScore = Math.round(sumScores / totalTests);
  const passedCount = history.filter((h) => h.score >= 60).length;
  const passRate = Math.round((passedCount / totalTests) * 100);

  return {
    history,
    averageScore,
    totalTests,
    passRate,
  };
}

/**
 * Sign in candidate with email and password
 */
export async function signInCandidate(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Sign out
 */
export async function signOutCandidate() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Fetch the signed-in candidate's profile.
 *
 * Always scoped to a specific identity. There is deliberately no "newest row"
 * fallback: that used to hand the dashboard whichever profile was created
 * last, which is how one account ended up displaying another account's email.
 */
export async function fetchCandidateProfile(authUserId?: string, candidateId?: string, email?: string) {
  if (authUserId) {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    if (error) console.error("Error fetching candidate profile by auth user:", error);
    if (data) return data;
  }

  if (candidateId) {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("candidate_id", candidateId)
      .maybeSingle();
    if (error) console.error("Error fetching candidate profile by candidate id:", error);
    if (data) return data;
  }

  if (email) {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();
    if (error) console.error("Error fetching candidate profile by email:", error);
    if (data) return data;
  }

  return null;
}
