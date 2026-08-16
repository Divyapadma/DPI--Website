import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// -----------------------------------------------------------------------
// Supabase client setup.
//
// TODO(supabase-setup): once the Supabase project + DPI Dashboard V2 leads
// table are shared, set these in .env.local (see .env.local.example):
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
//   SUPABASE_SERVICE_ROLE_KEY   (server-only, admin panel writes/RLS bypass)
//
// Until then, both clients are `null` and callers should treat that as
// "not configured yet" — the mock data in lib/mock-data.ts fills the gap
// on the public pages, and forms should surface a friendly "coming soon"
// state rather than throwing.
// -----------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Browser / client-component safe client. Uses the public anon key. */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

/**
 * Server-only client with elevated privileges (service role key).
 * Never import this from a Client Component or expose it to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
