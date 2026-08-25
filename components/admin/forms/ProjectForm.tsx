"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { createProject, updateProject } from "@/lib/mutations";
import type { ProjectInput } from "@/lib/mappers";
import type { Project } from "@/lib/types";
import { slugify } from "@/lib/utils";

const STATUS_OPTIONS: Project["status"][] = ["upcoming", "ongoing", "completed", "ready-to-move"];

const inputClass =
  "focus-glow w-full min-h-[44px] rounded-xl border border-line bg-ivory px-4 py-2.5 text-base text-charcoal outline-none transition-colors placeholder:text-taupe/60";
const labelClass = "mb-1.5 block text-xs uppercase tracking-[0.1em] text-taupe";

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const [status, setStatus] = useState<Project["status"]>(project?.status ?? "upcoming");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const num = (key: string) => {
      const v = form.get(key);
      return v ? Number(v) : undefined;
    };
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
      priceFromLakhs: num("priceFromLakhs") ?? 0,
      priceToLakhs: num("priceToLakhs"),
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
          <div>
            <label className={labelClass}>Price From (Lakhs)</label>
            <input
              name="priceFromLakhs"
              type="number"
              required
              min={0}
              step="0.01"
              defaultValue={project?.priceFromLakhs}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Price To (Lakhs, optional)</label>
            <input
              name="priceToLakhs"
              type="number"
              min={0}
              step="0.01"
              defaultValue={project?.priceToLakhs}
              className={inputClass}
            />
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
