import ScrollReveal from "@/components/ui/ScrollReveal";
import { ButtonLink } from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <ScrollReveal>
          <div className="glass-card relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-16 sm:py-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/20 blur-[100px]" />
            <p className="relative mb-3 text-[11px] uppercase tracking-[0.25em] text-gold sm:text-xs sm:tracking-[0.3em]">
              Find Your Address
            </p>
            <h2 className="font-display relative text-[clamp(1.5rem,5vw,3rem)] leading-tight text-ivory break-words">
              Let&apos;s find the home that fits your life.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm text-mist sm:text-base">
              Speak with our team for a personalised walkthrough of our current and upcoming projects.
            </p>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
              <ButtonLink href="/contact" variant="primary" className="w-full sm:w-auto">
                Schedule a Visit
              </ButtonLink>
              <ButtonLink href="/projects" variant="outline" className="w-full sm:w-auto">
                Browse Projects
              </ButtonLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
