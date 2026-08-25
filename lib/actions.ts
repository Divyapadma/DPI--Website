"use server";

import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { notifyTelegramLead } from "@/lib/telegram";
import type { LeadPayload } from "@/lib/types";

export interface SubmitLeadResult {
  ok: boolean;
  message: string;
}

/**
 * Writes a lead into this project's own Supabase `leads` table.
 * All website submissions are tagged `source: "website"` so leads can be
 * filtered by origin if more intake channels are added later.
 *
 * Until Supabase credentials are configured (see .env.local.example), this
 * fails soft with a friendly message instead of throwing, so forms remain
 * usable during early development.
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitLeadResult> {
  if (!isSupabaseConfigured) {
    console.warn("[submitLead] Supabase not configured — lead not persisted:", payload);
    return {
      ok: false,
      message: "Thanks! Our enquiry system is being finalised — please reach us directly by phone or email for now.",
    };
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      message: "Something went wrong on our end. Please try again shortly.",
    };
  }

  const { error } = await admin.from("leads").insert({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    message: payload.message ?? null,
    source: payload.source,
    form_type: payload.form_type,
    project_slug: payload.project_slug ?? null,
    career_slug: payload.career_slug ?? null,
  });

  if (error) {
    console.error("[submitLead] Supabase insert failed:", error.message);
    return { ok: false, message: "We couldn't submit your request. Please try again shortly." };
  }

  // Only after the lead is safely saved — and awaited so it actually runs
  // to completion before this serverless invocation ends, but its own
  // internal try/catch (see lib/telegram.ts) guarantees a Telegram outage
  // or bad config can never flip this successful result to a failure.
  await notifyTelegramLead(payload);

  return { ok: true, message: "Thank you! Our team will get back to you shortly." };
}
