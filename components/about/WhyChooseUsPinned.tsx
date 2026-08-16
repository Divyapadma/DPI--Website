"use client";

import { useEffect, useRef, type ReactNode } from "react";
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

  useEffect(() => {
    const section = sectionRef.current;
    const cardsWrap = cardsRef.current;
    if (!section || !cardsWrap) return;

    const cards = cardsWrap.querySelectorAll(".why-card");

    const ctx = gsap.context(() => {
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

      tl.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.5,
        ease: "power2.out",
      });
    }, section);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <section ref={sectionRef} className="border-y border-line bg-ivory/60">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <SectionHeading eyebrow="Why Choose Us" title="What Sets DPI Apart" />

        <div ref={cardsRef} className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {items.map(({ icon, title, description }) => (
            <div key={title} className="why-card glass-card h-full rounded-2xl p-6 sm:p-7">
              {icon}
              <h3 className="font-display mt-5 text-lg text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-taupe">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
