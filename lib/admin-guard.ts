import "server-only";
import { createServerSupabaseClient } from "./supabase-server";
import { isSupabaseConfigured } from "./supabase";

/**
 * Re-verifies the admin session inside each mutation, not just the layout.
 * The admin dashboard layout already redirects unauthenticated visitors
 * away from the UI, but a Server Action is a real network endpoint that
 * can be POSTed to directly, so it needs its own check too.
 */
export async function requireAdminSession(): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Supabase isn't configured yet — see .env.local.example." };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  if (!user) {
    return { ok: false, message: "You must be signed in as an admin to do that." };
  }

  return { ok: true };
}
