"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slow cinematic Ken Burns zoom on the background
      gsap.fromTo(
        bgRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 8, ease: "power1.out" }
      );

      // Staggered reveal of hero copy
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      )
        .fromTo(
          ".hero-word",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  const headline = ["Building", "Landmarks,", "Delivering", "Trust."];

  return (
    <section className="relative flex h-[92vh] min-h-[640px] w-full items-center overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />

      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <p className="hero-eyebrow mb-5 text-xs uppercase tracking-[0.35em] text-gold">
          DPI Real Estate &mdash; Multi-City Developer
        </p>
        <h1 className="font-display max-w-4xl text-5xl leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
          {headline.map((word) => (
            <span key={word} className="hero-word mr-4 inline-block last:text-gold-gradient">
              {word}
            </span>
          ))}
        </h1>
        <p className="hero-sub mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
          Landmark residences across India&apos;s fastest-growing cities &mdash; crafted with uncompromising
          quality and delivered on trust.
        </p>
        <div className="hero-cta mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/projects" variant="primary">
            Explore Projects
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Talk to Us
          </ButtonLink>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-gold/70">
        <ChevronDown size={26} />
      </div>
    </section>
  );
}
