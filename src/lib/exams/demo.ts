import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Demo-set completion is the unlock gate for every scored test.
 *
 * The record lives in `public.demo_completions`, which has RLS on and zero
 * policies, so only the service role (server routes) can read or write it.
 * A browser cannot fake completion the way it could with localStorage.
 */
export async function hasCompletedDemo(userId: string): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from("demo_completions")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return false;
  return Boolean(data?.user_id);
}

export async function markDemoCompleted(userId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("demo_completions")
    .upsert({ user_id: userId, completed_at: new Date().toISOString() }, { onConflict: "user_id" });

  if (error) throw new Error(error.message);
}
