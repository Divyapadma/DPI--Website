import type { Metadata } from "next";
import Image from "next/image";
import { Award, Building2, Handshake, Target } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story, mission, and people behind DPI's landmark real estate developments.",
};

const WHY_CHOOSE_US = [
  {
    icon: Building2,
    title: "Multi-City Presence",
    description: "Active developments across major growth corridors, backed by deep local market expertise.",
  },
  {
    icon: Handshake,
    title: "Transparent Process",
    description: "Clear pricing, honest timelines, and a dedicated relationship manager from booking to handover.",
  },
  {
    icon: Award,
    title: "Uncompromising Quality",
    description: "In-house design and execution standards applied consistently across every project.",
  },
  {
    icon: Target,
    title: "Customer-First Approach",
    description: "Post-handover support and community management that outlasts the sale.",
  },
];

// TODO: replace with real founder/leadership bios and photos.
const TEAM = [
  { name: "Founder & Managing Director", role: "Leadership" },
  { name: "Head of Construction", role: "Leadership" },
  { name: "Head of Sales & Marketing", role: "Leadership" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About DPI"
        title="Built on quality. Delivered on trust."
        description="For two decades, DPI has translated ambitious visions into landmark residential addresses across India's fastest-growing cities."
      />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:px-10">
        <ScrollReveal>
          <div className="relative h-[420px] overflow-hidden rounded-2xl">
            <Image src="/images/placeholder-project.svg" alt="DPI story" fill className="object-cover" />
            <div className="absolute inset-0 border border-gold/20" />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Our Story</p>
          <h2 className="font-display text-3xl leading-tight text-ivory sm:text-4xl">
            From a single project to a multi-city portfolio.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mist">
            {/* TODO: replace with real company history / founder narrative. */}
            DPI began with a simple conviction: that a home should be delivered exactly as promised. That
            principle has guided every project since — from our first residential tower to today&apos;s portfolio
            spanning multiple cities and thousands of families.
          </p>
          <p className="mt-4 text-base leading-relaxed text-mist">
            Every development is approached with the same discipline: rigorous site selection, in-house design and
            execution, and a relentless focus on the experience of the people who will eventually call it home.
          </p>
        </ScrollReveal>
      </section>

      <section className="border-y border-line bg-surface/60">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <ScrollReveal>
            <SectionHeading eyebrow="Why Choose Us" title="What Sets DPI Apart" />
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map(({ icon: Icon, title, description }, i) => (
              <ScrollReveal key={title} delay={i * 0.1}>
                <div className="glass-card h-full rounded-2xl p-7">
                  <Icon className="text-gold" size={26} />
                  <h3 className="font-display mt-5 text-lg text-ivory">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <ScrollReveal>
          <SectionHeading eyebrow="Leadership" title="The People Behind DPI" />
        </ScrollReveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 0.1}>
              <div className="glass-card overflow-hidden rounded-2xl">
                <div className="relative h-72 w-full bg-surface-2">
                  {/* TODO: replace with real headshots */}
                </div>
                <div className="p-6">
                  <p className="font-display text-lg text-ivory">{member.name}</p>
                  <p className="mt-1 text-sm text-gold">{member.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
