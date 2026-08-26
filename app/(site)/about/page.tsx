import type { Metadata } from "next";
import { Award, MapPinned, Handshake, Target } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SplitHeading from "@/components/ui/SplitHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RevealImage from "@/components/ui/RevealImage";
import CTASection from "@/components/home/CTASection";
import WhyChooseUsPinned from "@/components/about/WhyChooseUsPinned";
import { getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story and mission behind DPI, a real estate channel partner helping families find their next home.",
};

// Icons are rendered here (Server Component) into JSX before being passed
// to <WhyChooseUsPinned>, a Client Component — component *references* like
// `MapPinned` can't cross the server/client boundary as props, only
// already-rendered elements can.
const WHY_CHOOSE_US = [
  {
    icon: <MapPinned className="text-terracotta" size={26} />,
    title: "Multi-Region Presence",
    description: "Active project partnerships across Greater Noida, Ghaziabad, Aligarh, and Uttarakhand.",
  },
  {
    icon: <Handshake className="text-terracotta" size={26} />,
    title: "Transparent Process",
    description: "Clear pricing, honest timelines, and a dedicated relationship manager from enquiry to handover.",
  },
  {
    icon: <Award className="text-terracotta" size={26} />,
    title: "Careful Vetting",
    description: "Every partner project is checked for quality and credibility before we recommend it to you.",
  },
  {
    icon: <Target className="text-terracotta" size={26} />,
    title: "Customer-First Approach",
    description: "Post-sale support that outlasts the transaction — we stay reachable after handover.",
  },
];

export default async function AboutPage() {
  // Admin-editable via /admin/settings ("About Page — Story Image") —
  // falls back to the local placeholder SVG itself if unset, so no
  // further fallback is needed here. Not force-dynamic (this is a plain
  // async Server Component, same as Projects/Blog/Careers/Home after
  // their own force-dynamic removal) — updateSiteSettings's own
  // revalidatePath("/about") call (lib/mutations.ts) keeps this fresh
  // after an edit without paying a live Supabase round-trip on every visit.
  const { aboutStoryImageUrl } = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="About DPI"
        title="Guided by trust. Delivered with care."
        description="DPI (Divya Padma Infosystem LLP) is a real estate channel partner — for 4+ years, we've helped families find and secure the right home across Greater Noida West, Noida Extension, the Jewar Airport corridor, Aligarh, Ghaziabad, and Uttarakhand."
      />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
        <div className="relative h-[260px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-[420px]">
          <RevealImage
            src={aboutStoryImageUrl ?? "/images/placeholder-project.svg"}
            alt="DPI story"
            fill
            wrapperClassName="h-full w-full"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 border border-terracotta/20" />
        </div>
        <ScrollReveal delay={0.15}>
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-terracotta sm:text-xs">Our Story</p>
          <SplitHeading
            as="h2"
            text="A trusted guide, not a builder."
            splitType="words"
            className="font-display text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl"
          />
          <p className="mt-4 text-sm leading-relaxed text-taupe sm:mt-5 sm:text-base">
            DPI is a real estate channel partner, not a developer — we don&apos;t build or construct. Founded in
            2021, we work alongside trusted developers to market and sell their projects, giving buyers a single,
            transparent point of contact across every stage of the journey.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-taupe sm:text-base">
            Every project we represent is approached with the same discipline: careful vetting, honest pricing and
            timelines, and a relentless focus on the experience of the families we serve.
          </p>
        </ScrollReveal>
      </section>

      <WhyChooseUsPinned items={WHY_CHOOSE_US} />

      <CTASection />
    </>
  );
}
