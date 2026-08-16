import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin, PlayCircle } from "lucide-react";
import { getProjectBySlug } from "@/lib/queries";
import { formatINR } from "@/lib/utils";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FadeIn from "@/components/ui/FadeIn";
import RevealImage from "@/components/ui/RevealImage";
import SplitHeading from "@/components/ui/SplitHeading";
import SwipeGallery from "@/components/projects/SwipeGallery";
import LeadForm from "@/components/forms/LeadForm";

// No generateStaticParams — projects are managed live via /admin, so this
// route renders dynamically per request instead of being pre-built from a
// fixed list at build time.

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <section className="relative h-[56vh] min-h-[420px] w-full overflow-hidden sm:h-[64vh] lg:h-[70vh]">
        <RevealImage
          src={project.heroImage}
          alt={project.title}
          fill
          priority
          wrapperClassName="h-full w-full"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream via-cream/50 to-cream/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-8 sm:px-6 sm:pb-12 lg:px-10">
          <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-terracotta sm:mb-3 sm:text-xs sm:tracking-[0.3em]">
            {project.location.area}, {project.location.city}
          </p>
          <SplitHeading
            as="h1"
            text={project.title}
            splitType="words"
            trigger="mount"
            className="font-display max-w-3xl text-[clamp(1.75rem,6vw,3.75rem)] leading-tight text-charcoal break-words"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:gap-14 sm:px-6 sm:py-16 lg:grid-cols-3 lg:px-10">
        <div className="space-y-10 sm:space-y-14 lg:col-span-2">
          <ScrollReveal>
            <h2 className="font-display text-2xl text-charcoal">Overview</h2>
            <p className="mt-4 text-base leading-relaxed text-taupe">{project.description}</p>
          </ScrollReveal>

          {project.videoUrl && (
            <ScrollReveal>
              <h2 className="font-display text-2xl text-charcoal">Walkthrough</h2>
              <div className="glass-card mt-4 flex aspect-video items-center justify-center rounded-2xl">
                <PlayCircle className="text-terracotta" size={48} />
              </div>
            </ScrollReveal>
          )}

          {project.gallery.length > 0 && (
            <ScrollReveal>
              <h2 className="font-display text-2xl text-charcoal">Gallery</h2>
              <SwipeGallery images={project.gallery} alt={project.title} />
            </ScrollReveal>
          )}

          {project.amenities.length > 0 && (
            <ScrollReveal>
              <h2 className="font-display text-2xl text-charcoal">Amenities</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {project.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-charcoal/90">
                    <CheckCircle2 size={16} className="shrink-0 text-terracotta" />
                    {a}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          )}

          <ScrollReveal>
            <h2 className="font-display text-2xl text-charcoal">Location</h2>
            <div className="glass-card mt-4 flex h-72 items-center justify-center rounded-2xl">
              {/* TODO: embed real Google Maps iframe via project.location.mapEmbedUrl */}
              <p className="flex items-center gap-2 text-sm text-taupe">
                <MapPin size={16} className="text-terracotta" />
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
              the content. Entrance animation is opacity-only (no
              transform) so it never fights the sticky positioning below. */}
          <FadeIn className="lg:sticky lg:top-28">
            <div id="price-sheet" className="glass-card scroll-mt-24 rounded-2xl p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.25em] text-taupe">Starting From</p>
              <p className="font-display mt-1 text-3xl text-terracotta">
                {formatINR(project.priceFromLakhs)}
                {project.priceToLakhs ? ` – ${formatINR(project.priceToLakhs)}` : "+"}
              </p>
              <div className="divider-terracotta my-5 opacity-30" />
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-taupe">Configuration</dt>
                  <dd className="text-right text-charcoal">{project.configuration}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-taupe">Status</dt>
                  <dd className="text-right text-charcoal capitalize">{project.status.replace(/-/g, " ")}</dd>
                </div>
                {project.reraNumber && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-taupe">RERA No.</dt>
                    <dd className="text-right text-charcoal">{project.reraNumber}</dd>
                  </div>
                )}
              </dl>

              <div className="divider-terracotta my-6 opacity-30" />
              <p className="font-display mb-4 text-lg text-charcoal">Request Price Sheet</p>
              <LeadForm
                formType="project-enquiry"
                projectSlug={project.slug}
                messagePlaceholder="Any specific requirements? (floor, view, budget...)"
                submitLabel="Send Enquiry"
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
