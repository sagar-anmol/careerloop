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

    // Check if user already exists in auth
    const { data: usersData, error: listErr } = await adminSupabase.auth.admin.listUsers();
    if (listErr) {
      console.error("List users error:", listErr);
    }

    const existingUser = usersData?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    let authUser = existingUser;

    if (existingUser) {
      // Update existing user's password and auto-confirm email
      const { data: updated, error: updateErr } = await adminSupabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            phone,
            domain,
            candidate_id: candidateId,
          },
        }
      );
      if (updateErr) {
        console.error("Update user error:", updateErr);
      } else {
        authUser = updated.user;
      }
    } else {
      // Create new user with confirmed email
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
        console.error("Create user error:", createErr);
        return NextResponse.json({ error: createErr.message }, { status: 400 });
      }
      authUser = created.user;
    }

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
