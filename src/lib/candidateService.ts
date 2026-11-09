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
 * Register candidate account with Supabase Auth and save profile + files into Postgres / Storage
 */
export async function registerCandidateDossier(input: CandidateRegistrationInput) {
  let authUserId: string | null = null;

  // 1. If password provided, sign up via Supabase Auth
  if (input.password && input.password.length >= 6) {
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          phone: input.phone,
          candidate_id: input.candidateId,
          domain: input.domain,
        },
      },
    });

    if (authErr) {
      // If user already exists, attempt to sign in to link session
      if (authErr.message.includes("User already registered") || authErr.message.includes("already exists")) {
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email: input.email.trim(),
          password: input.password,
        });
        if (!signInErr && signInData.user) {
          authUserId = signInData.user.id;
        }
      } else {
        console.warn("Auth signup warning:", authErr.message);
      }
    } else if (authData.user) {
      authUserId = authData.user.id;
    }
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

  // 4. Check if candidate with this email already exists to update existing record rather than duplicating
  const normalizedEmail = input.email.trim().toLowerCase();
  const { data: existingCandidate } = await supabase
    .from("candidates")
    .select("id, candidate_id")
    .eq("email", normalizedEmail)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const activeCandidateId = existingCandidate?.candidate_id || input.candidateId;

  const payload = {
    auth_user_id: authUserId,
    candidate_id: activeCandidateId,
    full_name: input.fullName,
    email: normalizedEmail,
    phone: input.phone,
    domain: input.domain,
    experience: input.experience,
    city: input.city,
    photo_url: photoUrl,
    resume_url: resumeUrl,
    resume_name: resumeName,
    updated_at: new Date().toISOString(),
  };

  let candidateDataResult;
  if (existingCandidate?.id) {
    const { data: updated, error: updateErr } = await supabase
      .from("candidates")
      .update(payload)
      .eq("id", existingCandidate.id)
      .select()
      .single();
    if (updateErr) throw new Error(updateErr.message);
    candidateDataResult = updated;
  } else {
    const { data: inserted, error: insertErr } = await supabase
      .from("candidates")
      .insert(payload)
      .select()
      .single();
    if (insertErr) throw new Error(insertErr.message);
    candidateDataResult = inserted;
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
 * Fetch candidate profile by auth user ID, candidate ID, or email
 */
export async function fetchCandidateProfile(authUserId?: string, candidateId?: string, email?: string) {
  let query = supabase.from("candidates").select("*").order("created_at", { ascending: false }).limit(1);
  if (authUserId) {
    query = query.eq("auth_user_id", authUserId);
  } else if (candidateId) {
    query = query.eq("candidate_id", candidateId);
  } else if (email) {
    query = query.eq("email", email.trim().toLowerCase());
  } else {
    return null;
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    // If lookup fails or returns error, try looking up directly by email
    if (email) {
      const { data: emailData } = await supabase
        .from("candidates")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (emailData) return emailData;
    }
    console.error("Error fetching candidate profile:", error);
    return null;
  }

  // If data is null and email exists, check by email
  if (!data && email) {
    const { data: emailData } = await supabase
      .from("candidates")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (emailData) return emailData;
  }

  return data;
}
