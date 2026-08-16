import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`} className="glass-card group block overflow-hidden rounded-2xl">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 group-active:scale-110"
        />
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">
          {post.tags[0]} &middot; {date}
        </p>
        <h3 className="font-display mt-3 text-lg text-ivory sm:text-xl">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold">
          Read More <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}
