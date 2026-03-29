import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase-public-env";

export const createClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseAnonKey();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and a public key (publishable or NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
