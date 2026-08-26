import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import IntroSection from "@/components/home/IntroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import { getSiteSettings } from "@/lib/queries";

// Deliberately not force-dynamic (this page used to be) — that forced a
// live Supabase round-trip (getSiteSettings + FeaturedProjects'
// getFeaturedProjects) on every single navigation to "/", including via
// the navbar logo — which is what made navigating *to* Home measurably
// slower than every other page, confirmed via client-side navigation
// timing (see app/(site)/projects/page.tsx for the same fix applied
// there first, with the full measurement methodology). Every mutation
// that touches what this page reads already calls revalidatePath("/")
// (lib/mutations.ts: createProject/updateProject/deleteProject,
// updateSiteSettings) — Next's on-demand-ISR pattern, same as the other
// listing pages. One trade-off, same as those: Next's client-side router
// cache can still hand a visitor who already prefetched "/" a copy up to
// ~5 minutes stale after an edit, before a fresh server round-trip.
export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero
        videoUrl={settings.heroVideoUrl}
        fallbackImageUrl={settings.heroFallbackImageUrl ?? "/images/placeholder-hero.svg"}
      />
      <StatsBar stats={settings.stats} />
      <IntroSection />
      <FeaturedProjects />
      <Testimonials />
      <CTASection />
    </>
  );
}
