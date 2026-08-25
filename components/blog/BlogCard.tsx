import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import RevealImage from "@/components/ui/RevealImage";

export default function BlogCard({
  post,
  imageHeight = "h-56",
  // Matches the BentoGrid (components/ui/BentoGrid.tsx) this card
  // actually renders in on /blog: 1 col below sm, 2 at sm, 3 at lg+, with
  // the first post spanning 2 columns. Without this, next/image assumes
  // up to full viewport width and always fetches the largest
  // ImageKit-transformed candidate regardless of the card's real size.
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  post: BlogPost;
  imageHeight?: string;
  sizes?: string;
}) {
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
        sizes={sizes}
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
