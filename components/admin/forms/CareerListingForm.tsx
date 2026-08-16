"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { createCareerListing, updateCareerListing } from "@/lib/mutations";
import type { CareerListingInput } from "@/lib/mappers";
import type { CareerListing } from "@/lib/types";
import { slugify } from "@/lib/utils";

const EMPLOYMENT_TYPES: CareerListing["employmentType"][] = ["full-time", "part-time", "contract", "internship"];

const inputClass =
  "focus-glow w-full min-h-[44px] rounded-xl border border-line bg-ivory px-4 py-2.5 text-base text-charcoal outline-none transition-colors placeholder:text-taupe/60";
const labelClass = "mb-1.5 block text-xs uppercase tracking-[0.1em] text-taupe";

export default function CareerListingForm({ listing }: { listing?: CareerListing }) {
  const router = useRouter();
  const isEdit = Boolean(listing);
  const [slug, setSlug] = useState(listing?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [employmentType, setEmploymentType] = useState<CareerListing["employmentType"]>(
    listing?.employmentType ?? "full-time"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const input: CareerListingInput = {
      slug,
      title: String(form.get("title") ?? ""),
      department: String(form.get("department") ?? ""),
      location: String(form.get("location") ?? ""),
      employmentType,
      description: String(form.get("description") ?? ""),
      postedAt: String(form.get("postedAt") ?? new Date().toISOString().slice(0, 10)),
    };

    const result = listing ? await updateCareerListing(listing.id, input) : await createCareerListing(input);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/admin/careers");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card space-y-4 rounded-2xl p-6 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Title</label>
            <input
              name="title"
              required
              defaultValue={listing?.title}
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
            <label className={labelClass}>Department</label>
            <input name="department" required defaultValue={listing?.department} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input name="location" required defaultValue={listing?.location} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Employment Type</label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as CareerListing["employmentType"])}
              className={inputClass}
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Posted Date</label>
            <input
              name="postedAt"
              type="date"
              required
              defaultValue={listing?.postedAt.slice(0, 10)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" required rows={4} defaultValue={listing?.description} className={inputClass} />
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
          {isEdit ? "Save Changes" : "Create Listing"}
        </button>
      </div>
    </form>
  );
}
