import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase-public-env";
import { createClient } from "@/utils/supabase/server";

/**
 * Route Handlers / anonymous writes (waitlist, contact): use the direct JS client.
 * Avoids cookie-session quirks in API routes for non-auth traffic.
 */
export function getSupabaseAnon() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  return createSupabaseJsClient(url, key);
}

/**
 * Server-only API routes. Uses the service_role key — bypasses RLS (Postgres role bypass).
 * Never use NEXT_PUBLIC_* or expose this key to the browser.
 */
export function getSupabaseServiceRole() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseJsClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

/** Server Components / auth flows: Supabase SSR client with cookies + refreshed session. */
export async function getSupabaseServer() {
  if (!getSupabaseUrl() || !getSupabaseAnonKey()) {
    return null;
  }
  const cookieStore = await cookies();
  return createClient(cookieStore);
}
