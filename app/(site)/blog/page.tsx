import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BlogCard from "@/components/blog/BlogCard";
import { blogPosts } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Real estate insights and market updates from the DPI research desk.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="DPI Journal"
        title="Insights & Market Updates"
        description="Perspectives on real estate trends, buyer guides, and updates from across our projects."
      />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 0.1}>
              <BlogCard post={post} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
