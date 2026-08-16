"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { createBlogPost, updateBlogPost } from "@/lib/mutations";
import type { BlogPostInput } from "@/lib/mappers";
import type { BlogPost } from "@/lib/types";
import { slugify } from "@/lib/utils";

const inputClass =
  "focus-glow w-full min-h-[44px] rounded-xl border border-line bg-ivory px-4 py-2.5 text-base text-charcoal outline-none transition-colors placeholder:text-taupe/60";
const labelClass = "mb-1.5 block text-xs uppercase tracking-[0.1em] text-taupe";

export default function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const tags = String(form.get("tags") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const input: BlogPostInput = {
      slug,
      title: String(form.get("title") ?? ""),
      excerpt: String(form.get("excerpt") ?? ""),
      content: String(form.get("content") ?? ""),
      coverImage: String(form.get("coverImage") ?? ""),
      author: String(form.get("author") ?? ""),
      publishedAt: String(form.get("publishedAt") ?? new Date().toISOString().slice(0, 10)),
      tags,
    };

    const result = post ? await updateBlogPost(post.id, input) : await createBlogPost(input);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/admin/blog");
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
              defaultValue={post?.title}
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
            <label className={labelClass}>Author</label>
            <input name="author" required defaultValue={post?.author} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Published Date</label>
            <input
              name="publishedAt"
              type="date"
              required
              defaultValue={post?.publishedAt.slice(0, 10)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Tags (comma separated)</label>
          <input
            name="tags"
            placeholder="Market Insights, Buyer Guide"
            defaultValue={post?.tags.join(", ")}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cover Image URL</label>
          <p className="mb-1.5 text-xs text-taupe">Full ImageKit URL — images are hosted on ImageKit, not uploaded here.</p>
          <input
            name="coverImage"
            required
            placeholder="https://ik.imagekit.io/..."
            defaultValue={post?.coverImage}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Excerpt</label>
          <textarea name="excerpt" required rows={2} defaultValue={post?.excerpt} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Content</label>
          <textarea name="content" required rows={10} defaultValue={post?.content} className={inputClass} />
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
          {isEdit ? "Save Changes" : "Publish Post"}
        </button>
      </div>
    </form>
  );
}
