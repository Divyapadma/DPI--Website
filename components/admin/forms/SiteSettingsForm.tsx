"use client";

import { useState, type FormEvent } from "react";
import { Clapperboard, Loader2, Save } from "lucide-react";
import { updateSiteSettings } from "@/lib/mutations";
import type { SiteSettings, StatItem } from "@/lib/types";

const inputClass =
  "focus-glow w-full min-h-[44px] rounded-xl border border-line bg-ivory px-4 py-3 text-base text-charcoal outline-none transition-colors placeholder:text-taupe/60";
const labelClass = "mb-1.5 block text-xs uppercase tracking-[0.1em] text-taupe";

// Always exactly 4 cards — matches the fixed 4-column grid StatsBar
// renders on the homepage. If stats ever come back empty (misconfigured
// Supabase), start from 4 blank rows rather than 0 so the admin isn't
// stuck with no fields to fill in.
function withFourSlots(stats: StatItem[]): StatItem[] {
  const filled = [...stats];
  while (filled.length < 4) filled.push({ value: "", label: "" });
  return filled.slice(0, 4);
}

export default function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [heroVideoUrl, setHeroVideoUrl] = useState(settings.heroVideoUrl ?? "");
  const [stats, setStats] = useState<StatItem[]>(() => withFourSlots(settings.stats));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function updateStat(index: number, key: keyof StatItem, val: string) {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: val } : s)));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    const result = await updateSiteSettings({
      heroVideoUrl: heroVideoUrl.trim() || undefined,
      stats: stats.map((s) => ({ value: s.value.trim(), label: s.label.trim() })),
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-6 rounded-2xl p-6 sm:p-7">
      <div className="flex items-center gap-2">
        <Clapperboard size={18} className="text-terracotta" />
        <h2 className="font-display text-lg text-charcoal">Site Settings</h2>
      </div>

      <div>
        <h3 className="text-sm font-medium text-charcoal">Hero Video</h3>
        <p className="mt-1 text-xs text-taupe">
          Paste a full ImageKit video URL to update the homepage hero background. Leave blank to show the fallback
          image instead.
        </p>
        <input
          placeholder="https://ik.imagekit.io/.../hero.mp4"
          value={heroVideoUrl}
          onChange={(e) => setHeroVideoUrl(e.target.value)}
          className={`${inputClass} mt-3`}
        />
      </div>

      <div className="border-t border-line pt-6">
        <h3 className="text-sm font-medium text-charcoal">Homepage Stats</h3>
        <p className="mt-1 text-xs text-taupe">
          The four counter cards shown just below the hero — e.g. Number: <span className="italic">6+</span>, Label:{" "}
          <span className="italic">Cities</span>.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-xl border border-line p-4">
              <label className={labelClass}>Number</label>
              <input
                placeholder="6+"
                value={stat.value}
                onChange={(e) => updateStat(i, "value", e.target.value)}
                className={inputClass}
              />
              <label className={`${labelClass} mt-3`}>Label</label>
              <input
                placeholder="Cities"
                value={stat.label}
                onChange={(e) => updateStat(i, "label", e.target.value)}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:bg-terracotta-soft disabled:opacity-60"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Site Settings
        </button>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {success && <p className="mt-3 text-sm text-terracotta">Saved — changes are live on the homepage.</p>}
      </div>
    </form>
  );
}
