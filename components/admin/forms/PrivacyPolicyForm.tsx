"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Save, ShieldCheck } from "lucide-react";
import { updateSiteSettings } from "@/lib/mutations";
import type { SiteSettings } from "@/lib/types";

// Same field, not the shared inputClass — a policy document needs real
// height and a monospace-adjacent feel is unnecessary, but the generous
// row count (and resize-y) matters far more here than for a one-line field.
const textareaClass =
  "focus-glow w-full rounded-xl border border-line bg-ivory px-4 py-3 text-sm leading-relaxed text-charcoal outline-none transition-colors placeholder:text-taupe/60";

export default function PrivacyPolicyForm({ settings }: { settings: SiteSettings }) {
  const [content, setContent] = useState(settings.privacyPolicy);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    // Everything except privacyPolicy is sent back unchanged (from this
    // same settings prop, fetched fresh on page load) — this form only
    // edits privacyPolicy, but updateSiteSettings writes the whole
    // singleton row, so omitting the rest would blank out the Site
    // Settings page's data.
    const result = await updateSiteSettings({
      heroVideoUrl: settings.heroVideoUrl,
      heroFallbackImageUrl: settings.heroFallbackImageUrl,
      stats: settings.stats,
      privacyPolicy: content,
      aboutStoryImageUrl: settings.aboutStoryImageUrl,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-4 rounded-2xl p-6 sm:p-7">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-terracotta" />
        <h2 className="font-display text-lg text-charcoal">Privacy Policy</h2>
      </div>
      <p className="text-xs text-taupe">
        Shown at <span className="italic">/privacy-policy</span>. Leave a blank line between paragraphs. Start a
        line with <span className="italic">## </span> to make it a section heading (e.g.{" "}
        <span className="italic">## Cookies &amp; Analytics</span>).
      </p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={22}
        className={textareaClass}
      />

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:bg-terracotta-soft disabled:opacity-60"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Privacy Policy
        </button>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {success && <p className="mt-3 text-sm text-terracotta">Saved — changes are live on /privacy-policy.</p>}
      </div>
    </form>
  );
}
