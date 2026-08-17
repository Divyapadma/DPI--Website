import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Briefcase, MapPin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TiltCard from "@/components/ui/TiltCard";
import { BentoGrid, BentoItem } from "@/components/ui/BentoGrid";
import { getCareerListings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open positions at DPI — join a team building landmark residential projects.",
};

// Renders fresh on every request — see app/(site)/page.tsx for why.
export const dynamic = "force-dynamic";

const SPAN = (i: number) => (i === 0 ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-1 lg:row-span-1");

export default async function CareersPage() {
  const careerListings = await getCareerListings();

  return (
    <>
      <PageHero
        eyebrow="Careers at DPI"
        title="Build Your Career With Us"
        description="We're always looking for people who care about craftsmanship, transparency, and getting the details right."
      />

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        {careerListings.length > 0 ? (
          <BentoGrid>
            {careerListings.map((job, i) => (
              <BentoItem key={job.id} span={SPAN(i)}>
                <ScrollReveal delay={i * 0.08} className="h-full">
                  <TiltCard className="h-full">
                    <Link
                      href={`/careers/${job.slug}`}
                      className="glass-card group flex h-full min-h-[44px] flex-col justify-between rounded-2xl p-6 sm:p-7"
                    >
                      <div>
                        <span className="inline-block rounded-full border border-sage/40 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-sage">
                          {job.department}
                        </span>
                        <h3
                          className={`font-display mt-4 text-charcoal ${
                            i === 0 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                          }`}
                        >
                          {job.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-taupe">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="shrink-0 text-terracotta" />
                            {job.location}
                          </span>
                          <span className="capitalize">{job.employmentType.replace("-", " ")}</span>
                        </div>
                        {i === 0 && <p className="mt-4 max-w-md text-sm leading-relaxed text-taupe">{job.description}</p>}
                      </div>

                      <span className="mt-6 flex shrink-0 items-center gap-1.5 text-sm text-terracotta">
                        Apply Now <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </TiltCard>
                </ScrollReveal>
              </BentoItem>
            ))}
          </BentoGrid>
        ) : (
          <p className="flex items-center gap-2 text-sm text-taupe">
            <Briefcase size={16} className="text-terracotta" />
            No open positions right now — check back soon.
          </p>
        )}
      </section>
    </>
  );
}
