import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizePhone } from "@/lib/candidateService";

export const dynamic = "force-dynamic";

/**
 * Early duplicate check for the signup wizard — runs on Step 0 "Continue",
 * BEFORE the candidate invests time in the photo / payment steps. Returns
 * booleans only (no user data) so a wrong guess leaks nothing beyond what the
 * final signup error would reveal anyway.
 *
 * This is a convenience pre-check, not the gate: /api/auth/register still
 * re-verifies everything authoritatively (pre-checks + unique indexes) at
 * submit time.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const rawPhone = typeof body?.phone === "string" ? body.phone : "";
    const normalizedPhone = rawPhone ? normalizePhone(rawPhone) : "";

    const result: { emailTaken: boolean; phoneTaken: boolean } = {
      emailTaken: false,
      phoneTaken: false,
    };

    const admin = getSupabaseAdmin();

    if (email) {
      const { data } = await admin
        .from("candidates")
        .select("candidate_id")
        .eq("email", email)
        .limit(1)
        .maybeSingle();
      result.emailTaken = Boolean(data);
    }

    if (/^\d{10}$/.test(normalizedPhone)) {
      const { data } = await admin
        .from("candidates")
        .select("candidate_id")
        .eq("phone", normalizedPhone)
        .limit(1)
        .maybeSingle();
      result.phoneTaken = Boolean(data);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("check-availability error:", err);
    // Fail open: a broken pre-check must not block the wizard — the final
    // register call still refuses duplicates.
    return NextResponse.json(
      { success: true, emailTaken: false, phoneTaken: false, degraded: true },
      { status: 200 }
    );
  }
}
