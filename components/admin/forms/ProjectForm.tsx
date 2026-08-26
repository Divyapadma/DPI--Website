"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { createProject, updateProject } from "@/lib/mutations";
import type { ProjectInput } from "@/lib/mappers";
import type { Project } from "@/lib/types";
import { formatProjectPrice, slugify } from "@/lib/utils";

const STATUS_OPTIONS: Project["status"][] = ["upcoming", "ongoing", "completed", "ready-to-move"];

const inputClass =
  "focus-glow w-full min-h-[44px] rounded-xl border border-line bg-ivory px-4 py-2.5 text-base text-charcoal outline-none transition-colors placeholder:text-taupe/60";
const labelClass = "mb-1.5 block text-xs uppercase tracking-[0.1em] text-taupe";

type PriceUnit = "L" | "Cr";

// Every price in this app is stored as a single "lakhs" number regardless
// of which unit the admin actually thinks in — these two functions are
// the only place that boundary is crossed, converting a stored lakhs
// value into an {amount, unit} pair a human can read/edit and back.
// Editing always redisplays in whichever unit formatINR (lib/utils.ts)
// would itself choose to *display* that value in (>=100L -> Cr) — not
// necessarily the unit originally typed in, since that's never stored
// (350 saved as "3.5 Cr" and 350 saved as "350 L" are the same number and
// intentionally indistinguishable later; picking the display-matching
// unit on reopen is the least surprising convention available).
function lakhsToAmountUnit(lakhs: number | undefined): { amount: string; unit: PriceUnit } {
  if (lakhs == null) return { amount: "", unit: "L" };
  if (lakhs >= 100) return { amount: trimFloat(lakhs / 100), unit: "Cr" };
  return { amount: trimFloat(lakhs), unit: "L" };
}

function amountUnitToLakhs(amount: string, unit: PriceUnit): number | undefined {
  const trimmed = amount.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  if (Number.isNaN(n)) return undefined;
  return unit === "Cr" ? n * 100 : n;
}

/** "3.4999999999999996" -> "3.5" — division introduces float noise a human editing the field shouldn't see. */
function trimFloat(n: number): string {
  return Number(n.toFixed(4)).toString();
}

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const [status, setStatus] = useState<Project["status"]>(project?.status ?? "upcoming");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const initialFrom = lakhsToAmountUnit(project?.priceFromLakhs);
  const initialTo = lakhsToAmountUnit(project?.priceToLakhs);
  const [priceFromAmount, setPriceFromAmount] = useState(initialFrom.amount);
  const [priceFromUnit, setPriceFromUnit] = useState<PriceUnit>(initialFrom.unit);
  const [priceToAmount, setPriceToAmount] = useState(initialTo.amount);
  const [priceToUnit, setPriceToUnit] = useState<PriceUnit>(initialTo.unit);
  const [priceDisplayOverride, setPriceDisplayOverride] = useState(project?.priceDisplayOverride ?? "");

  const priceFromLakhs = amountUnitToLakhs(priceFromAmount, priceFromUnit);
  const priceToLakhs = amountUnitToLakhs(priceToAmount, priceToUnit);
  const trimmedOverride = priceDisplayOverride.trim();
  const pricePreview = formatProjectPrice({
    priceFromLakhs,
    priceToLakhs,
    priceDisplayOverride: trimmedOverride || undefined,
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    // Every other field on this form is required by its own `required`
    // attribute, checked natively before this handler even runs — this
    // one's a cross-field rule (at least one of two independent controls)
    // native HTML validation can't express, so it's checked here instead.
    if (priceFromLakhs == null && !trimmedOverride) {
      setError('Set a starting price, or a custom price label like "Price on Request" — at least one is required.');
      return;
    }

    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const lines = (key: string) =>
      String(form.get(key) ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

    const input: ProjectInput = {
      slug,
      title: String(form.get("title") ?? ""),
      city: String(form.get("city") ?? ""),
      area: String(form.get("area") ?? ""),
      mapEmbedUrl: String(form.get("mapEmbedUrl") ?? "") || undefined,
      status,
      priceFromLakhs,
      priceToLakhs,
      priceDisplayOverride: trimmedOverride || undefined,
      configuration: String(form.get("configuration") ?? ""),
      description: String(form.get("description") ?? ""),
      heroImage: String(form.get("heroImage") ?? ""),
      gallery: lines("gallery"),
      videoUrl: String(form.get("videoUrl") ?? "") || undefined,
      amenities: lines("amenities"),
      reraNumber: String(form.get("reraNumber") ?? "") || undefined,
      featured,
    };

    const result = project ? await updateProject(project.id, input) : await createProject(input);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card space-y-4 rounded-2xl p-6 sm:p-7">
        <h2 className="font-display text-lg text-charcoal">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Title</label>
            <input
              name="title"
              required
              defaultValue={project?.title}
              onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input name="city" required defaultValue={project?.location.city} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Area</label>
            <input name="area" required defaultValue={project?.location.area} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Project["status"])}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/-/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Configuration</label>
            <input
              name="configuration"
              required
              placeholder="2 & 3 BHK"
              defaultValue={project?.configuration}
              className={inputClass}
            />
          </div>
          <div className="space-y-4 rounded-xl border border-line p-4 sm:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Starting Price</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="75"
                    value={priceFromAmount}
                    onChange={(e) => setPriceFromAmount(e.target.value)}
                    className={`${inputClass} flex-1`}
                  />
                  <select
                    value={priceFromUnit}
                    onChange={(e) => setPriceFromUnit(e.target.value as PriceUnit)}
                    className={`${inputClass} w-28 shrink-0`}
                  >
                    <option value="L">Lakh</option>
                    <option value="Cr">Crore</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Max Price (optional — for a range)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="1.2"
                    value={priceToAmount}
                    onChange={(e) => setPriceToAmount(e.target.value)}
                    className={`${inputClass} flex-1`}
                  />
                  <select
                    value={priceToUnit}
                    onChange={(e) => setPriceToUnit(e.target.value as PriceUnit)}
                    className={`${inputClass} w-28 shrink-0`}
                  >
                    <option value="L">Lakh</option>
                    <option value="Cr">Crore</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Custom Price Label (optional)</label>
              <p className="mb-1.5 text-xs text-taupe">
                Replaces the price shown everywhere with this exact text — e.g. &ldquo;Price on Request&rdquo;. A
                starting price above still works for the Projects page&apos;s budget filter either way, even with a
                label set.
              </p>
              <input
                placeholder="Price on Request"
                value={priceDisplayOverride}
                onChange={(e) => setPriceDisplayOverride(e.target.value)}
                className={inputClass}
              />
            </div>
            <p className="text-sm text-taupe">
              Preview: <span className="font-semibold text-terracotta">{pricePreview}</span>
            </p>
          </div>
          <div>
            <label className={labelClass}>RERA No. (optional)</label>
            <input name="reraNumber" defaultValue={project?.reraNumber} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Map Embed URL (optional)</label>
            <p className="mb-1.5 text-xs text-taupe">
              On Google Maps: Share &rarr; Embed a map &rarr; Copy HTML. Pasting the whole snippet is fine — only
              the link inside it is used.
            </p>
            <input
              name="mapEmbedUrl"
              placeholder='<iframe src="https://www.google.com/maps/embed?..."></iframe>'
              defaultValue={project?.location.mapEmbedUrl}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" required rows={4} defaultValue={project?.description} className={inputClass} />
        </div>
        <label className="flex w-fit items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-terracotta"
          />
          Feature on homepage
        </label>
      </div>

      <div className="glass-card space-y-4 rounded-2xl p-6 sm:p-7">
        <h2 className="font-display text-lg text-charcoal">Media &amp; Amenities</h2>
        <p className="text-xs text-taupe">
          Paste full ImageKit URLs — images are hosted on ImageKit, not uploaded here.
        </p>
        <div>
          <label className={labelClass}>Hero Image URL</label>
          <p className="mb-1.5 text-xs text-taupe">
            An image file (.jpg, .png, .webp) — not a video. Use the Walkthrough field below for video.
          </p>
          <input
            name="heroImage"
            required
            placeholder="https://ik.imagekit.io/.../photo.jpg"
            defaultValue={project?.heroImage}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Gallery Image URLs (one per line)</label>
          <p className="mb-1.5 text-xs text-taupe">Image files too — same rule as above.</p>
          <textarea
            name="gallery"
            rows={4}
            placeholder={"https://ik.imagekit.io/.../photo-1.jpg\nhttps://ik.imagekit.io/.../photo-2.jpg"}
            defaultValue={project?.gallery.join("\n")}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Walkthrough Video URL (optional)</label>
          <p className="mb-1.5 text-xs text-taupe">A video file (.mp4) — shown as a click-to-play player.</p>
          <input
            name="videoUrl"
            placeholder="https://ik.imagekit.io/.../walkthrough.mp4"
            defaultValue={project?.videoUrl}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Amenities (one per line)</label>
          <textarea
            name="amenities"
            rows={4}
            placeholder={"Infinity Pool\nClubhouse\n24x7 Security"}
            defaultValue={project?.amenities.join("\n")}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:bg-terracotta-soft disabled:opacity-60"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isEdit ? "Save Changes" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
