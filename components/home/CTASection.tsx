import ScrollReveal from "@/components/ui/ScrollReveal";
import { ButtonLink } from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <ScrollReveal>
          <div className="glass-card relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/20 blur-[100px]" />
            <p className="relative mb-3 text-xs uppercase tracking-[0.3em] text-gold">Find Your Address</p>
            <h2 className="font-display relative text-3xl leading-tight text-ivory sm:text-4xl lg:text-5xl">
              Let&apos;s find the home that fits your life.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base text-mist">
              Speak with our team for a personalised walkthrough of our current and upcoming projects.
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/contact" variant="primary">
                Schedule a Visit
              </ButtonLink>
              <ButtonLink href="/projects" variant="outline">
                Browse Projects
              </ButtonLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
