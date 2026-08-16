"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { gsap, SplitText } from "@/lib/gsap";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      // Slow cinematic Ken Burns zoom on the background
      gsap.fromTo(bgRef.current, { scale: 1.15 }, { scale: 1, duration: 8, ease: "power1.out" });

      if (headlineRef.current) {
        // Split into words *and* chars — the word wrapper is what the
        // browser actually breaks lines on, so individual letters never
        // get orphaned mid-word onto their own line the way a chars-only
        // split can at this display-size type scale.
        split = new SplitText(headlineRef.current, {
          type: "words, chars",
          wordsClass: "hero-word",
          charsClass: "hero-char",
        });
        gsap.set(split.chars, { yPercent: 120, opacity: 0 });
      }

      // Staggered reveal of hero copy, headline splitting letter by letter
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(".hero-eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });

      if (split) {
        tl.to(
          split.chars,
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.02, ease: "power3.out" },
          "-=0.3"
        );
      }

      tl.fromTo(
        ".hero-accent",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.3"
      )
        .fromTo(".hero-sub", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .fromTo(".hero-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4");
    }, contentRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section className="relative flex w-full items-center overflow-hidden py-28 sm:py-32 lg:min-h-[90vh] lg:py-40">
      <div ref={bgRef} className="absolute inset-0">
        {/* Swap for a cinematic video background once footage is supplied:
            <video autoPlay muted loop playsInline className="h-full w-full object-cover" /> */}
        <Image
          src="/images/placeholder-hero.svg"
          alt="DPI cinematic hero background"
          fill
          priority
          className="object-cover"
        />
      </div>
      {/* Soft warm overlay: cream wash for text legibility, terracotta/sage
          tint at the edges for atmosphere — kept deliberately low-contrast. */}
      <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/70 to-cream/35" />
      <div className="absolute inset-0 bg-gradient-to-br from-terracotta/10 via-transparent to-sage/10" />

      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
        <p className="hero-eyebrow mb-4 text-[11px] uppercase tracking-[0.3em] text-terracotta sm:mb-5 sm:text-xs sm:tracking-[0.35em]">
          DPI Real Estate &mdash; Multi-City Developer
        </p>
        <h1 className="font-display max-w-full text-[clamp(2.75rem,11vw,8.5rem)] leading-[0.98] text-charcoal break-words">
          {/* Split separately from the accent line below: SplitText wraps
              each character in its own span, which breaks background-clip
              gradient text (the gradient has nothing of its own left to
              clip to once the glyphs move into child elements) — so the
              gradient phrase gets a simple fade/rise instead of a letter
              reveal. */}
          <span ref={headlineRef}>Building Landmarks,</span>{" "}
          <span className="hero-accent text-terracotta-gradient">Delivering Trust.</span>
        </h1>
        <p className="hero-sub mt-5 max-w-xl text-sm leading-relaxed text-taupe sm:mt-6 sm:text-base lg:text-lg">
          Landmark residences across India&apos;s fastest-growing cities &mdash; crafted with uncompromising
          quality and delivered on trust.
        </p>
        <div className="hero-cta mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
          <ButtonLink href="/projects" variant="primary" className="w-full sm:w-auto">
            Explore Projects
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline" className="w-full sm:w-auto">
            Talk to Us
          </ButtonLink>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce text-terracotta/70 sm:bottom-8">
        <ChevronDown size={24} />
      </div>
    </section>
  );
}
