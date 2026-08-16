import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Briefcase, MapPin } from "lucide-react";
import { careerListings } from "@/lib/mock-data";
import LeadForm from "@/components/forms/LeadForm";

export async function generateStaticParams() {
  return careerListings.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = careerListings.find((c) => c.slug === slug);
  if (!job) return {};
  return { title: job.title, description: job.description };
}

export default async function CareerDetailPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const job = careerListings.find((c) => c.slug === slug);
  if (!job) notFound();

  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:gap-14 sm:px-6 sm:py-16 lg:grid-cols-3 lg:px-10 lg:py-20">
      <div className="lg:col-span-2">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold sm:text-xs">{job.department}</p>
        <h1 className="font-display text-[clamp(1.5rem,4.5vw,2.5rem)] leading-tight text-ivory break-words">
          {job.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-mist">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="shrink-0 text-gold" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase size={14} className="shrink-0 text-gold" />
            <span className="capitalize">{job.employmentType.replace("-", " ")}</span>
          </span>
        </div>
        <div className="divider-gold my-8 opacity-30" />
        <p className="leading-relaxed text-ivory/90">{job.description}</p>
      </div>

      <div className="lg:col-span-1">
        <div className="glass-card rounded-2xl p-5 sm:p-7 lg:sticky lg:top-28">
          <p className="font-display mb-4 text-lg text-ivory">Apply for this role</p>
          <LeadForm
            formType="career-application"
            careerSlug={job.slug}
            messageLabel="Cover Note"
            messagePlaceholder="Tell us why you're a great fit for this role..."
            submitLabel="Submit Application"
          />
        </div>
      </div>
    </section>
  );
}
