import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import RevealImage from "@/components/ui/RevealImage";

export default function BlogCard({ post, imageHeight = "h-56" }: { post: BlogPost; imageHeight?: string }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`} className="glass-card group flex h-full flex-col overflow-hidden rounded-2xl">
      <RevealImage
        src={post.coverImage}
        alt={post.title}
        fill
        wrapperClassName={`${imageHeight} w-full`}
        className="object-cover transition-transform duration-700 group-hover:scale-110 group-active:scale-110"
      />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-terracotta">
          {post.tags[0]} &middot; {date}
        </p>
        <h3 className="font-display mt-3 text-lg text-charcoal sm:text-xl">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-taupe">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm text-terracotta">
          Read More <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}
