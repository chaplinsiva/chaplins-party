import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ── Profile row type (mirrors public.profiles) ── */
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  district: string | null;
  state: string | null;
  instagram_handle: string | null;
  telegram_handle: string | null;
  favorite_book: string | null;
  why_join: string | null;
  age_range: string | null;
  mobile_number: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
