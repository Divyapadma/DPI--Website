"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { gsap, SplitText } from "@/lib/gsap";

// Falls back to the image below if unset. Video files aren't run through
// the ImageKit image loader (that's images-only), so this is just the raw
// ImageKit video URL, set in .env.local.
const HERO_VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // useLayoutEffect, not useEffect: SplitText restructures headlineRef's
  // DOM children into wrapper spans, behind React's back. Cleanup has to
  // undo that before React's own unmount removeChild runs, which only
  // useLayoutEffect's synchronous-before-commit cleanup guarantees — see
  // SplitHeading.tsx for the full explanation.
  useLayoutEffect(() => {
    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      // Slow cinematic Ken Burns zoom on the background - kept subtle
      // (1.06, not 1.15) since it's layered on top of object-cover's own
      // crop; a bigger start scale compounds with that crop and reads as
      // "too zoomed in" rather than a gentle drift.
      gsap.fromTo(bgRef.current, { scale: 1.06 }, { scale: 1, duration: 8, ease: "power1.out" });

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
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section className="relative flex w-full items-center overflow-hidden py-24 sm:py-28 lg:min-h-[84vh] lg:py-32">
      <div ref={bgRef} className="absolute inset-0">
        {HERO_VIDEO_URL ? (
          // autoPlay requires muted in every browser that allows it at all.
          // `loop` plays the full video through once and restarts it from
          // the beginning automatically - correct for a full-length feature
          // video, not just a short clip. `poster` shows the (real, no
          // dev-placeholder-text) fallback image until enough of the video
          // has buffered to paint a frame - this is a large (~58MB) file,
          // so that gap is the whole point of having a poster at all.
          // `preload="auto"` hints the browser to start fetching
          // immediately rather than waiting for user interaction, since
          // autoplay already means it's going to need the data right away.
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/placeholder-hero.svg"
            // Tailwind's own base preflight sets `video { height: auto }`
            // to preserve intrinsic aspect ratio by default. Confirmed via
            // computed-style inspection that this rule wins over the
            // h-full utility class in this project's cascade (regardless
            // of `absolute inset-0` also being applied) - the video's own
            // box was rendering taller than its container (810px vs. the
            // container's 702px at a typical viewport), silently clipped
            // by this section's overflow-hidden, cutting off part of the
            // frame. A plain inline style is the one thing guaranteed by
            // the CSS cascade to beat a non-!important stylesheet rule
            // regardless of specificity or layer order, so it's used here
            // instead of trying to out-specificity a Tailwind internal.
            className="absolute inset-0 object-cover"
            style={{ width: "100%", height: "100%" }}
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/placeholder-hero.svg"
            alt="DPI cinematic hero background"
            fill
            priority
            className="object-cover"
          />
        )}
      </div>
      {/* Cream wash for text legibility over the real video (a moving,
          fairly bright aerial shot needs meaningfully more contrast than
          the flat placeholder illustration this was originally tuned
          against), terracotta/sage tint at the edges for atmosphere. */}
      <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/88 to-cream/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-terracotta/10 via-transparent to-sage/10" />

      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
        <p className="hero-eyebrow mb-4 text-[11px] uppercase tracking-[0.3em] text-terracotta sm:mb-5 sm:text-xs sm:tracking-[0.35em]">
          DPI Real Estate &mdash; Multi-City Developer
        </p>
        <h1 className="font-display max-w-full text-[clamp(2.25rem,6vw,5.25rem)] leading-[1.05] text-charcoal break-words">
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
