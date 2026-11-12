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
export interface StartPayuCheckoutInput {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  domain: string;
  experience?: string;
  city?: string;
  candidateId: string;
  photoBase64?: string | null;
  resumeFile?: File | null;
  selectedPlan: string;
}

/** ~2.2 MB raw resume cap; base64 of that is ~3 MB, inside the request limit. */
const MAX_RESUME_BYTES = 2_300_000;

/**
 * Pay-first signup: posts the dossier to /api/payment/initiate, then replaces
 * the page with PayU's hosted checkout (full-page form POST). Control never
 * returns to this function (the browser navigates); it only ever returns by
 * throwing, with a human-readable message already mapped from the server code.
 */
export async function startPayuCheckout(input: StartPayuCheckoutInput): Promise<void> {
  const normalizedPhone = normalizePhone(input.phone);
  if (!/^\d{10}$/.test(normalizedPhone)) {
    throw new Error("Enter a valid 10-digit mobile number.");
  }

  let resumeBase64: string | null = null;
  let resumeName: string | null = null;
  if (input.resumeFile) {
    if (input.resumeFile.size > MAX_RESUME_BYTES) {
      throw new Error("Your resume is larger than ~2.2 MB. Compress the PDF and try again — everything else you entered is kept.");
    }
    resumeName = input.resumeFile.name;
    resumeBase64 = await readFileAsBase64(input.resumeFile);
  }

  const response = await postToInitiate({
    plan: input.selectedPlan,
    signup: {
      fullName: input.fullName,
      email: input.email.trim(),
      password: input.password,
      phone: input.phone,
      domain: input.domain,
      experience: input.experience,
      city: input.city,
      candidateId: input.candidateId,
      photoBase64: input.photoBase64 ?? null,
      resumeBase64,
      resumeName,
    },
  });
  if (!response.ok) {
    const json = response.json as { code?: string; error?: string };
    const code = json?.code ?? "";
    const friendly =
      code === "EMAIL_TAKEN"
        ? "An account with this email already exists. Sign in instead."
        : code === "PHONE_TAKEN"
        ? "This mobile number is already registered with another account."
        : code === "EMAIL_NOT_VERIFIED"
        ? "Verify your email with the 6-digit code before creating the account."
        : code === "WEAK_PASSWORD"
        ? "Password must be at least 6 characters."
        : code === "INVALID_PHONE"
        ? "Enter a valid 10-digit mobile number."
        : code === "INVALID_EMAIL"
        ? "Enter a valid email address."
        : code === "UNKNOWN_PLAN"
        ? "The selected plan is not available. Pick another plan."
        : code === "PHOTO_TOO_LARGE" || code === "RESUME_TOO_LARGE"
        ? json?.error ?? "A file you attached is too large. Retake/compress it and try again."
        : json?.error || "Could not start payment. Check your connection and try again.";
    throw new Error(friendly);
  }
  postFormToPayu(response.action, response.fields);
}

/** Paid-upgrade checkout for signed-in users (e.g. lapsed Starter Trial). */
export async function startPayuUpgradeCheckout(plan: string): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sign in again to upgrade.");

  const response = await postToInitiate({ plan }, token);
  if (!response.ok) {
    throw new Error(response.json?.error || "Could not start payment. Check your connection and try again.");
  }
  postFormToPayu(response.action, response.fields);
}

async function postToInitiate(
  body: unknown,
  bearer?: string
): Promise<
  | { ok: true; action: string; fields: Record<string, string> }
  | { ok: false; json: { code?: string; error?: string } }
> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (bearer) headers.Authorization = `Bearer ${bearer}`;
  try {
    const res = await fetch("/api/payment/initiate", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as {
      action?: string;
      fields?: Record<string, string>;
      code?: string;
      error?: string;
    };
    if (!res.ok || !json.action || !json.fields) return { ok: false, json };
    return { ok: true, action: json.action, fields: json.fields };
  } catch {
    return { ok: false, json: { error: "Could not reach the payment service. Check your connection and try again." } };
  }
}

function postFormToPayu(action: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  form.style.display = "none";
  for (const [name, value] of Object.entries(fields)) {
    const el = document.createElement("input");
    el.type = "hidden";
    el.name = name;
    el.value = value;
    form.appendChild(el);
  }
  document.body.appendChild(form);
  form.submit();
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Could not read the resume file."));
    reader.readAsDataURL(file);
  });
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
