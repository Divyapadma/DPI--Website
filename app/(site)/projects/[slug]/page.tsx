import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin } from "lucide-react";
import { getProjectBySlug } from "@/lib/queries";
import { extractMapEmbedSrc, formatINR } from "@/lib/utils";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FadeIn from "@/components/ui/FadeIn";
import RevealImage from "@/components/ui/RevealImage";
import SplitHeading from "@/components/ui/SplitHeading";
import SwipeGallery from "@/components/projects/SwipeGallery";
import WalkthroughVideo from "@/components/projects/WalkthroughVideo";
import LeadForm from "@/components/forms/LeadForm";

// No generateStaticParams — projects are managed live via /admin. Without
// force-dynamic, a param not listed at build time still gets rendered on
// its first request, but Next then caches *that* result indefinitely
// (default revalidate: false) the same as a build-time static page, so a
// later edit wouldn't show up without an explicit revalidatePath() call —
// and even then, the client router cache can still serve a stale copy for
// a few minutes. force-dynamic renders fresh every time.
export const dynamic = "force-dynamic";

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
              <WalkthroughVideo videoUrl={project.videoUrl} posterImage={project.heroImage} alt={project.title} />
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
            {/* Same iframe pattern as the Contact page's office map
                (app/(site)/contact/page.tsx) — glass-card + overflow-hidden
                so the rounded corners actually clip the iframe, since an
                iframe's own border-radius doesn't clip its content. Falls
                back to the old placeholder text when no URL has been set
                for this project yet. */}
            <div className="glass-card mt-4 overflow-hidden rounded-2xl">
              {project.location.mapEmbedUrl ? (
                <iframe
                  title={`Map for ${project.location.area}, ${project.location.city}`}
                  src={extractMapEmbedSrc(project.location.mapEmbedUrl)}
                  className="h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <p className="flex h-72 items-center justify-center gap-2 text-sm text-taupe">
                  <MapPin size={16} className="text-terracotta" />
                  Map for {project.location.area}, {project.location.city}
                </p>
              )}
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
              <p className="mt-1 text-3xl font-bold text-terracotta">
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
