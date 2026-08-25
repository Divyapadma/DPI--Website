import "server-only";
import type { LeadPayload } from "@/lib/types";

const FORM_TYPE_LABEL: Record<LeadPayload["form_type"], string> = {
  contact: "Contact Form Enquiry",
  "project-enquiry": "Project Enquiry",
  "career-application": "Career Application",
};

/**
 * Best-effort Telegram notification for a freshly-saved lead.
 *
 * Called from submitLead (lib/actions.ts) only *after* the Supabase insert
 * has already succeeded — the lead's safety never depends on this. Every
 * failure mode (missing env vars, network error, Telegram API rejecting
 * the request) is caught here and only logged, never thrown, so a
 * misconfigured or unreachable bot can never turn a successful form
 * submission into a failed one for the visitor.
 *
 * Plain text, not Markdown parse_mode — a user's own message/name is
 * free text that could contain `_`, `*`, `` ` ``, `[`, `]`, which legacy
 * Telegram Markdown treats as formatting and can break on (an unmatched
 * `_` swallows the rest of the message or the API rejects the request
 * outright). Not worth the escaping complexity for what's a plain
 * internal notification.
 */
export async function notifyTelegramLead(payload: LeadPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = [
    `New ${FORM_TYPE_LABEL[payload.form_type]}`,
    "",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
  ];

  if (payload.form_type === "project-enquiry" && payload.project_slug) {
    lines.push(`Project: ${payload.project_slug}`);
  }
  if (payload.form_type === "career-application" && payload.career_slug) {
    lines.push(`Role: ${payload.career_slug}`);
  }
  if (payload.message) {
    lines.push(`Message: ${payload.message}`);
  }

  lines.push(
    "",
    new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    })
  );

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[notifyTelegramLead] Telegram API rejected the request:", res.status, body);
    }
  } catch (err) {
    console.error("[notifyTelegramLead] Telegram request failed:", err);
  }
}
