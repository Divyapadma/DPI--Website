import { CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ButtonLink } from "@/components/ui/Button";
import RevealImage from "@/components/ui/RevealImage";
import SplitHeading from "@/components/ui/SplitHeading";

const POINTS = [
  "Active project partnerships across Greater Noida, Ghaziabad, Aligarh, and Uttarakhand",
  "Transparent pricing and honest project timelines",
  "Dedicated guidance from site visit to handover",
];

export default function IntroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
      {/* Full-bleed within its own column — sharp edges, no rounded-corner
          "framed photo" treatment, confident enough to run edge-to-edge.
          A floating credential card overlaps its corner instead, the way
          depth is meant to come from here on: real layering, not a
          decorative gradient. */}
      <div className="relative">
        <div className="relative h-[280px] shadow-[0_24px_60px_-24px_rgba(46,42,38,0.35)] sm:h-[380px] lg:h-[460px]">
          <RevealImage
            src="https://ik.imagekit.io/divyapadma07/city-sunset.jpg"
            alt="DPI project partnerships"
            fill
            // This section is single-column (full container width) below
            // lg, and one of two lg:grid-cols-2 columns above it — without
            // this, next/image assumes the image could need the full
            // viewport at any width and always fetches the largest
            // ImageKit-transformed candidate, even at the 50vw it actually
            // renders at on desktop.
            sizes="(min-width: 1024px) 50vw, 100vw"
            wrapperClassName="h-full w-full"
            className="object-cover"
          />
        </div>
        {/* Positioning lives on this outer element, styling on the inner
            one — .glass-card sets its own `position: relative`, which
            fights the `absolute` utility when both land on the same
            element (same class of bug as Tailwind's own base preflight
            overriding a utility elsewhere in this codebase: whichever
            rule is later in the compiled stylesheet wins, not whichever
            reads more specific in the className string).

            Below sm, this stays in normal flow (mt-4, stacked under the
            image) instead of floating — at a ~330px-wide mobile column
            the same absolute offset that reads as "elegant corner accent"
            on a wider image instead covered nearly half of it (verified
            via screenshot). The floating overlap only switches on at sm,
            where there's enough image width for the card to sit mostly
            outside it rather than on top of it. */}
        <div className="mt-4 sm:absolute sm:-bottom-8 sm:-right-6 sm:mt-0">
          <div className="glass-card flex items-center gap-4 rounded-xl px-5 py-4 sm:px-6 sm:py-5">
            <p className="font-display text-3xl leading-none text-terracotta sm:text-4xl">4+</p>
            <p className="max-w-[9rem] text-xs leading-snug text-taupe sm:text-sm">
              Years of trusted guidance across every region we serve
            </p>
          </div>
        </div>
      </div>

      <ScrollReveal delay={0.15}>
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-terracotta sm:text-xs">Who We Are</p>
        <SplitHeading
          as="h2"
          text="4+ years of helping families find homes they're proud of."
          splitType="words"
          className="font-display text-2xl leading-tight text-charcoal sm:text-3xl lg:text-5xl"
        />
        <p className="mt-4 text-sm leading-relaxed text-taupe sm:mt-5 sm:text-base">
          DPI (Divya Padma Infosystem LLP) is a real estate channel partner — we don&apos;t build, we help you find
          and secure the right home from trusted developers across Greater Noida West, Noida Extension, the Jewar
          Airport corridor, Aligarh, Ghaziabad, and Uttarakhand.
        </p>

        <ul className="mt-7 space-y-3">
          {POINTS.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-charcoal/90">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-terracotta" />
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
