import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import IntroSection from "@/components/home/IntroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import { getSiteSettings } from "@/lib/queries";

// FeaturedProjects reads live, admin-managed Supabase data with no
// revalidate/cache directive, so without this the route gets prerendered
// once at build time and only refreshed by an explicit revalidatePath()
// call — and even then, the *client* router cache still serves a stale
// copy for up to 5 minutes on <Link> navigation (Next's default
// staleTimes.static). force-dynamic renders fresh on every request and
// disables that client-side staleness window entirely (staleTimes.dynamic
// defaults to 0s).
export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero videoUrl={settings.heroVideoUrl} />
      <StatsBar stats={settings.stats} />
      <IntroSection />
      <FeaturedProjects />
      <Testimonials />
      <CTASection />
    </>
  );
}
