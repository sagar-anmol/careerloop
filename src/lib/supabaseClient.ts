import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vyjpliikvzcbicpskhrn.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5anBsaWlrdnpjYmljcHNraHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjQ3NzksImV4cCI6MjEwOTY0MDc3OX0.lIffYcc7XGLZ7etqrCQ-39ZFoam0GFH0FjR9FjGvw-U";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
