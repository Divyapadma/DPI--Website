import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/mock-data";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article>
      <section className="relative h-[42vh] min-h-[320px] w-full overflow-hidden sm:h-[50vh] sm:min-h-[360px]">
        <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-5 pb-8 sm:px-6 sm:pb-12">
          <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-gold sm:mb-3 sm:text-xs sm:tracking-[0.3em]">
            {post.tags.join(" · ")} &middot; {date}
          </p>
          <h1 className="font-display text-[clamp(1.5rem,5.5vw,3rem)] leading-tight text-ivory break-words">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-mist">By {post.author}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <p className="text-lg leading-relaxed text-ivory/90">{post.excerpt}</p>
        <div className="divider-gold my-8 opacity-30" />
        <p className="leading-relaxed text-mist">{post.content}</p>
      </div>
    </article>
  );
}
