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

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <div className="space-y-5">
          {careerListings.map((job, i) => (
            <ScrollReveal key={job.id} delay={i * 0.08}>
              <Link
                href={`/careers/${job.slug}`}
                className="glass-card group flex flex-col gap-4 rounded-2xl p-7 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-display text-xl text-ivory">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-mist">
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={14} className="text-gold" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gold" />
                      {job.location}
                    </span>
                    <span className="capitalize">{job.employmentType.replace("-", " ")}</span>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-sm text-gold opacity-0 transition-opacity group-hover:opacity-100">
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
