/**
 * URL + public API key for browser and server-side anon traffic.
 *
 * Use **either**:
 * - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (newer dashboard “publishable” key), **or**
 * - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy `eyJ…` anon JWT from Supabase → Project Settings → API).
 *
 * **Precedence:** if both publishable and anon JWT are set, the **anon** key wins so local
 * debugging with `NEXT_PUBLIC_SUPABASE_ANON_KEY` is not overridden by publishable.
 */
export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  );
}
