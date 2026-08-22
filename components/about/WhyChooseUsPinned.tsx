"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { gsap } from "@/lib/gsap";

interface WhyItem {
  icon: ReactNode;
  title: string;
  description: string;
}

/**
 * GSAP ScrollTrigger pin: the section stays fixed in the viewport while
 * the user scrolls through it, and the four cards reveal one at a time
 * tied to that scroll — "stays fixed while inner content scrolls/changes".
 */
export default function WhyChooseUsPinned({ items }: { items: WhyItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect, not useEffect: pin: true makes ScrollTrigger wrap
  // `section` in a real .pin-spacer <div> it inserts into the DOM, behind
  // React's back. Reverting has to unwrap that (put `section` back under
  // its original parent) before React's own unmount removeChild runs —
  // see SplitHeading.tsx for the full explanation of why this needs the
  // synchronous-before-commit cleanup timing.
  //
  // gsap.matchMedia() below, not a single unconditional ScrollTrigger:
  // pin+scrub is a desktop-mouse-wheel interaction. On real mobile scroll
  // (verified via touch-equivalent scroll testing at 390px) the cards
  // stayed visibly stuck at low opacity well past where the section had
  // scrolled out of view — the address bar's dynamic show/hide resizes
  // the viewport mid-scroll, which throws off a pinned ScrollTrigger's
  // start/end math, and touch-scroll momentum doesn't map cleanly onto a
  // scrub tied to precise scroll position the way a mouse wheel does.
  // Below lg, this drops the pin/scrub entirely for a plain scroll-into-
  // view stagger — same entrance motion, never locks the user's scroll.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cardsWrap = cardsRef.current;
    if (!section || !cardsWrap) return;

    const cards = cardsWrap.querySelectorAll(".why-card");
    const mm = gsap.matchMedia();

    mm.add({ isDesktop: "(min-width: 1024px)", isMobile: "(max-width: 1023px)" }, (context) => {
      const { isDesktop } = context.conditions as { isDesktop: boolean };

      if (isDesktop) {
        gsap.set(cards, { opacity: 0.2, y: 48, scale: 0.96 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        tl.to(cards, { opacity: 1, y: 0, scale: 1, stagger: 0.5, ease: "power2.out" });
      } else {
        gsap.set(cards, { opacity: 0.2, y: 32, scale: 0.98 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsWrap,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    return () => mm.revert();
  }, [items.length]);

  return (
    <section ref={sectionRef} className="border-y border-line bg-ivory">
      {/* min-h-screen only on lg: that height exists to give the desktop
          pin interaction room to scrub through — below lg there's no pin,
          so forcing a full viewport height here just left dead empty
          space around four stacked cards. */}
      <div className="mx-auto flex max-w-7xl flex-col justify-center px-5 py-16 sm:px-6 sm:py-20 lg:min-h-screen lg:px-10 lg:py-24">
        <SectionHeading eyebrow="Why Choose Us" title="What Sets DPI Apart" />

        <div ref={cardsRef} className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {items.map(({ icon, title, description }) => (
            <div key={title} className="why-card glass-card h-full rounded-2xl p-6 sm:p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-terracotta/30 text-terracotta">
                {icon}
              </span>
              <h3 className="font-display mt-5 text-lg text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-taupe">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
