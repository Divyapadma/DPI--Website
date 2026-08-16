import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Briefcase, MapPin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { careerListings } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open positions at DPI — join a team building landmark residential projects.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers at DPI"
        title="Build Your Career With Us"
        description="We're always looking for people who care about craftsmanship, transparency, and getting the details right."
      />

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="space-y-5">
          {careerListings.map((job, i) => (
            <ScrollReveal key={job.id} delay={i * 0.08}>
              <Link
                href={`/careers/${job.slug}`}
                className="glass-card group flex min-h-[44px] flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"
              >
                <div className="min-w-0">
                  <h3 className="font-display text-lg text-ivory sm:text-xl">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-mist">
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={14} className="shrink-0 text-gold" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="shrink-0 text-gold" />
                      {job.location}
                    </span>
                    <span className="capitalize">{job.employmentType.replace("-", " ")}</span>
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-sm text-gold sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                  Apply Now <ArrowUpRight size={14} />
                </span>
              </Link>
            </ScrollReveal>
          ))}

          {careerListings.length === 0 && (
            <p className="text-center text-sm text-mist">No open positions right now — check back soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
