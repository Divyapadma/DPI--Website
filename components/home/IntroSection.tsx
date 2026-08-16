import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ButtonLink } from "@/components/ui/Button";

const POINTS = [
  "Multi-city portfolio spanning residential landmarks",
  "Transparent pricing and construction timelines",
  "In-house design, execution, and after-sales care",
];

export default function IntroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
      <ScrollReveal>
        <div className="relative h-[260px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-[420px]">
          <Image src="/images/placeholder-project.svg" alt="DPI developments" fill className="object-cover" />
          <div className="absolute inset-0 border border-gold/20" />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold sm:text-xs">Who We Are</p>
        <h2 className="font-display text-2xl leading-tight text-ivory sm:text-3xl lg:text-5xl">
          Two decades of building homes people are proud of.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-mist sm:mt-5 sm:text-base">
          DPI is a multi-city real estate developer known for landmark residential projects built on quality,
          transparency, and lasting trust. From site selection to handover, every project reflects a commitment to
          craftsmanship and the families who call it home.
        </p>

        <ul className="mt-7 space-y-3">
          {POINTS.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-ivory/90">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-gold" />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-9">
          <ButtonLink href="/about" variant="outline">
            More About DPI
          </ButtonLink>
        </div>
      </ScrollReveal>
    </section>
  );
}
