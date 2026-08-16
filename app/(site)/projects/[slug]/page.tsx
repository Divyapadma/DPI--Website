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
      <section className="relative h-[56vh] min-h-[420px] w-full overflow-hidden sm:h-[64vh] lg:h-[70vh]">
        <Image src={project.heroImage} alt={project.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-8 sm:px-6 sm:pb-12 lg:px-10">
          <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-gold sm:mb-3 sm:text-xs sm:tracking-[0.3em]">
            {project.location.area}, {project.location.city}
          </p>
          <h1 className="font-display max-w-3xl text-[clamp(1.75rem,6vw,3.75rem)] leading-tight text-ivory break-words">
            {project.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:gap-14 sm:px-6 sm:py-16 lg:grid-cols-3 lg:px-10">
        <div className="space-y-10 sm:space-y-14 lg:col-span-2">
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
          {/* Sticky only from `lg` up, where it's a genuine sidebar with room
              to breathe. Below that it's a normal in-flow card after the
              gallery/amenities/location content — a mobile bottom bar
              (below) gives quick access without pinning a tall form over
              the content. */}
          <div id="price-sheet" className="glass-card scroll-mt-24 rounded-2xl p-6 sm:p-7 lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-[0.25em] text-mist">Starting From</p>
            <p className="font-display mt-1 text-3xl text-gold">
              {formatINR(project.priceFromLakhs)}
              {project.priceToLakhs ? ` – ${formatINR(project.priceToLakhs)}` : "+"}
            </p>
            <div className="divider-gold my-5 opacity-30" />
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-mist">Configuration</dt>
                <dd className="text-right text-ivory">{project.configuration}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-mist">Status</dt>
                <dd className="text-right text-ivory capitalize">{project.status.replace(/-/g, " ")}</dd>
              </div>
              {project.reraNumber && (
                <div className="flex justify-between gap-3">
                  <dt className="text-mist">RERA No.</dt>
                  <dd className="text-right text-ivory">{project.reraNumber}</dd>
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
