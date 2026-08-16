import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Component / Server Action Supabase client, backed by request
 * cookies (via @supabase/ssr). Used for admin auth session checks.
 *
 * Returns `null` when Supabase env vars aren't configured yet — callers
 * (see middleware.ts, app/admin/layout.tsx) should treat that as
 * "auth not wired up yet" rather than throwing.
 */
export async function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component with no request context to
          // write to — safe to ignore if middleware also refreshes sessions.
        }
      },
    },
  });
}
