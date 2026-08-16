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
    <section className="mx-auto grid max-w-5xl gap-14 px-6 py-20 lg:grid-cols-3 lg:px-10">
      <div className="lg:col-span-2">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">{job.department}</p>
        <h1 className="font-display text-3xl text-ivory sm:text-4xl">{job.title}</h1>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-mist">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gold" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase size={14} className="text-gold" />
            <span className="capitalize">{job.employmentType.replace("-", " ")}</span>
          </span>
        </div>
        <div className="divider-gold my-8 opacity-30" />
        <p className="leading-relaxed text-ivory/90">{job.description}</p>
      </div>

      <div className="lg:col-span-1">
        <div className="glass-card sticky top-28 rounded-2xl p-7">
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
