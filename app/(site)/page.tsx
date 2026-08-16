import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import IntroSection from "@/components/home/IntroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <IntroSection />
      <FeaturedProjects />
      <Testimonials />
      <CTASection />
    </>
  );
}
