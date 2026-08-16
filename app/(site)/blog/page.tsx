import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BlogCard from "@/components/blog/BlogCard";
import TiltCard from "@/components/ui/TiltCard";
import { BentoGrid, BentoItem } from "@/components/ui/BentoGrid";
import { blogPosts } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Real estate insights and market updates from the DPI research desk.",
};

// First post gets a big footprint, the rest fill single cells.
const SPAN = (i: number) => (i === 0 ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-1 lg:row-span-1");

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="DPI Journal"
        title="Insights & Market Updates"
        description="Perspectives on real estate trends, buyer guides, and updates from across our projects."
      />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <BentoGrid>
          {blogPosts.map((post, i) => (
            <BentoItem key={post.id} span={SPAN(i)}>
              <ScrollReveal delay={i * 0.1} className="h-full">
                <TiltCard className="h-full">
                  <BlogCard post={post} imageHeight={i === 0 ? "h-72 lg:h-96" : "h-48"} />
                </TiltCard>
              </ScrollReveal>
            </BentoItem>
          ))}
        </BentoGrid>
      </section>
    </>
  );
}
