"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { submitLead } from "@/lib/actions";
import type { LeadPayload } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LeadFormProps {
  formType: LeadPayload["form_type"];
  projectSlug?: string;
  careerSlug?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  className?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function LeadForm({
  formType,
  projectSlug,
  careerSlug,
  messageLabel = "Message",
  messagePlaceholder = "Tell us a little about what you're looking for...",
  submitLabel = "Submit Enquiry",
  className,
}: LeadFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = new FormData(e.currentTarget);
    const payload: LeadPayload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
      source: "website",
      form_type: formType,
      project_slug: projectSlug,
      career_slug: careerSlug,
    };

    const result = await submitLead(payload);
    setStatus(result.ok ? "success" : "error");
    setFeedback(result.message);
    if (result.ok) e.currentTarget.reset();
  }

  // text-base (16px) — not text-sm — keeps iOS Safari from auto-zooming the
  // page when a field is focused; min-h-[44px] guarantees a touch target.
  const inputClass =
    "w-full min-h-[44px] rounded-xl border border-line bg-surface px-4 py-3 text-base text-ivory outline-none transition-colors placeholder:text-mist/60 focus:border-gold";

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full Name" className={inputClass} />
        <input name="phone" required type="tel" placeholder="Phone Number" className={inputClass} />
      </div>
      <input name="email" required type="email" placeholder="Email Address" className={inputClass} />
      <textarea
        name="message"
        rows={4}
        placeholder={messagePlaceholder}
        aria-label={messageLabel}
        className={inputClass}
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm uppercase tracking-[0.15em] text-ink transition-all hover:bg-gold-soft active:bg-gold-soft active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 sm:w-auto"
      >
        {status === "submitting" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {submitLabel}
      </button>

      {feedback && (
        <p className={cn("text-sm", status === "success" ? "text-gold" : "text-red-400")}>{feedback}</p>
      )}
    </form>
  );
}
