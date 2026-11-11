import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize admin client with service role key to auto-confirm users and update passwords
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, phone, domain, candidateId } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Create the account directly. Never reset the password of an existing
    // email: that let anyone take over an account by "signing up" again.
    // createUser is atomic, so two concurrent signups cannot both win.
    const { data: created, error: createErr } = await adminSupabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone,
        domain,
        candidate_id: candidateId,
      },
    });

    if (createErr) {
      const alreadyRegistered =
        createErr.code === "email_exists" ||
        /already (been )?registered|already exists/i.test(createErr.message);
      if (alreadyRegistered) {
        return NextResponse.json(
          {
            error: "An account with this email already exists. Sign in instead.",
            code: "EMAIL_TAKEN",
          },
          { status: 409 }
        );
      }
      console.error("Create user error:", createErr);
      return NextResponse.json({ error: createErr.message }, { status: 400 });
    }

    const authUser = created.user;

    return NextResponse.json({
      success: true,
      user: {
        id: authUser?.id,
        email: authUser?.email,
      },
    });
  } catch (err: unknown) {
    console.error("Auth register API route error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
