import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/queries";
import RevealImage from "@/components/ui/RevealImage";
import SplitHeading from "@/components/ui/SplitHeading";

// No generateStaticParams — posts are managed live via /admin.
// Deliberately not force-dynamic — see
// app/(site)/projects/[slug]/page.tsx for the full reasoning.

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article>
      <section className="relative h-[42vh] min-h-[320px] w-full overflow-hidden sm:h-[50vh] sm:min-h-[360px]">
        <RevealImage
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          wrapperClassName="h-full w-full"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream via-cream/60 to-cream/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-5 pb-8 sm:px-6 sm:pb-12">
          <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-terracotta sm:mb-3 sm:text-xs sm:tracking-[0.3em]">
            {post.tags.join(" · ")} &middot; {date}
          </p>
          <SplitHeading
            as="h1"
            text={post.title}
            splitType="words"
            trigger="mount"
            className="font-display text-[clamp(1.5rem,5.5vw,3rem)] leading-tight text-charcoal break-words"
          />
          <p className="mt-3 text-sm text-taupe">By {post.author}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <p className="text-lg leading-relaxed text-charcoal/90">{post.excerpt}</p>
        <div className="divider-terracotta my-8 opacity-30" />
        <p className="leading-relaxed text-taupe">{post.content}</p>
      </div>
    </article>
  );
}
