import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin, PlayCircle } from "lucide-react";
import { projects } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import ScrollReveal from "@/components/ui/ScrollReveal";
import LeadForm from "@/components/forms/LeadForm";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <Image src={project.heroImage} alt={project.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-12 lg:px-10">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">
            {project.location.area}, {project.location.city}
          </p>
          <h1 className="font-display max-w-3xl text-4xl text-ivory sm:text-5xl lg:text-6xl">{project.title}</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-3 lg:px-10">
        <div className="space-y-14 lg:col-span-2">
          <ScrollReveal>
            <h2 className="font-display text-2xl text-ivory">Overview</h2>
            <p className="mt-4 text-base leading-relaxed text-mist">{project.description}</p>
          </ScrollReveal>

          {project.videoUrl && (
            <ScrollReveal>
              <h2 className="font-display text-2xl text-ivory">Walkthrough</h2>
              <div className="glass-card mt-4 flex aspect-video items-center justify-center rounded-2xl">
                <PlayCircle className="text-gold" size={48} />
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal>
            <h2 className="font-display text-2xl text-ivory">Gallery</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.gallery.map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={img} alt={`${project.title} gallery ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="font-display text-2xl text-ivory">Amenities</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {project.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm text-ivory/90">
                  <CheckCircle2 size={16} className="shrink-0 text-gold" />
                  {a}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="font-display text-2xl text-ivory">Location</h2>
            <div className="glass-card mt-4 flex h-72 items-center justify-center rounded-2xl">
              {/* TODO: embed real Google Maps iframe via project.location.mapEmbedUrl */}
              <p className="flex items-center gap-2 text-sm text-mist">
                <MapPin size={16} className="text-gold" />
                Map for {project.location.area}, {project.location.city}
              </p>
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card sticky top-28 rounded-2xl p-7">
            <p className="text-xs uppercase tracking-[0.25em] text-mist">Starting From</p>
            <p className="font-display mt-1 text-3xl text-gold">
              {formatINR(project.priceFromLakhs)}
              {project.priceToLakhs ? ` – ${formatINR(project.priceToLakhs)}` : "+"}
            </p>
            <div className="divider-gold my-5 opacity-30" />
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-mist">Configuration</dt>
                <dd className="text-ivory">{project.configuration}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mist">Status</dt>
                <dd className="text-ivory capitalize">{project.status.replace(/-/g, " ")}</dd>
              </div>
              {project.reraNumber && (
                <div className="flex justify-between">
                  <dt className="text-mist">RERA No.</dt>
                  <dd className="text-ivory">{project.reraNumber}</dd>
                </div>
              )}
            </dl>

            <div className="divider-gold my-6 opacity-30" />
            <p className="font-display mb-4 text-lg text-ivory">Request Price Sheet</p>
            <LeadForm
              formType="project-enquiry"
              projectSlug={project.slug}
              messagePlaceholder="Any specific requirements? (floor, view, budget...)"
              submitLabel="Send Enquiry"
            />
          </div>
        </div>
      </section>
    </>
  );
}
