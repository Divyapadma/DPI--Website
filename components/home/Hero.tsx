"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { gsap, SplitText } from "@/lib/gsap";

interface HeroProps {
  // Both admin-editable via /admin/settings (lib/queries.ts
  // getSiteSettings) — passed down from the server-rendered home page
  // rather than read from an env var/hardcoded path here, so either goes
  // live without a code change/redeploy. Video files aren't run through
  // the ImageKit image loader (that's images-only), so videoUrl is just
  // the raw ImageKit video URL.
  videoUrl?: string;
  // Shown as the <video>'s poster (see below) and as the outright
  // background when videoUrl is unset. Always has a value by the time it
  // gets here — getSiteSettings() falls back to the local placeholder SVG
  // itself — so no further fallback is needed in this component.
  fallbackImageUrl: string;
}

export default function Hero({ videoUrl, fallbackImageUrl }: HeroProps) {
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
      // No Ken Burns scale on the background anymore - it settled back to
      // scale(1) by 8s (verified repeatedly via computed-transform
      // sampling) and was never the source of the reported crop, but it
      // was named as a suspect enough times that removing it outright is
      // more useful than continuing to argue the measurement: it
      // guarantees zero scale-related zoom at every point in time,
      // including the first 8 seconds, not just after settling. The real
      // crop was min-h-[90vh] having no relationship to the video's own
      // aspect ratio - see the section's className comment for the actual
      // fix (aspect-video).

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
    // aspect-video ties this section's height to the video's own 16:9
    // ratio, so object-cover needs ~0% crop regardless of resolution
    // (see git history for the full crop-elimination story). A plain
    // uncapped aspect-video hero was deliberately kept that way earlier
    // specifically because an unsolicited max-height cap was breaking
    // the 1920x1080 case for no benefit - this time there IS a benefit
    // (shorter hero, explicitly requested), so a cap is the right call:
    // max-h-[720px] trades a little crop back on the largest monitors
    // (1920px+, where uncapped aspect-video wants a full 1080px-tall
    // hero) for a meaningfully shorter section everywhere, while common
    // laptop/smaller-desktop widths (up to ~1280px) still land at or
    // near 0% crop since their natural aspect-video height is already
    // under the cap.
    // max-md: below — mobile only, per explicit instruction not to touch
    // tablet/desktop. max-md:min-h-[560px] gives the mobile hero real
    // presence instead of shrinking to whatever height the (smaller,
    // unstyled-for-mobile) text stack happened to need — the md:aspect-video
    // sizing this section already has for tablet+ is completely untouched.
    <section className="relative flex w-full items-center overflow-hidden py-10 sm:py-14 max-md:min-h-[560px] md:aspect-video md:max-h-[800px] md:min-h-[380px] lg:py-20">
      <div className="absolute inset-0">
        {videoUrl ? (
          // autoPlay requires muted in every browser that allows it at all.
          // `loop` plays the full video through once and restarts it from
          // the beginning automatically - correct for a full-length feature
          // video, not just a short clip. `poster` shows the (real, no
          // dev-placeholder-text) fallback image until enough of the video
          // has buffered to paint a frame - this is typically an 15-20MB+
          // file, so that gap is the whole point of having a poster at all.
          // `preload="auto"` hints the browser to start fetching
          // immediately rather than waiting for user interaction, since
          // autoplay already means it's going to need the data right away.
          //
          // The <source> below only has a `media` query, no plain
          // (always-matching) fallback — deliberately: below md (768px,
          // matching this component's own md: breakpoint elsewhere), NO
          // source matches, so the browser never requests the video file
          // at all and just keeps showing `poster` indefinitely, exactly
          // like a static image. This is a real, measured ~18MB/visit
          // saved on every phone that loads this page — mobile is most of
          // this site's traffic and most of it is on metered connections,
          // so autoplaying a video that heavy there was the single
          // largest performance cost on the entire site. ImageKit's own
          // video transformation (which would let mobile get a smaller
          // *version* of the same video instead of no video) is
          // unavailable on this account right now — a HEAD request
          // against a `?tr=` URL returned "ik-error: ELIMIT - Video
          // transformations limit exceeded" — so a smaller mobile-specific
          // video isn't currently an option; falling back to the poster
          // image is the safe, zero-added-risk alternative until that
          // quota allows it.
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={fallbackImageUrl}
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
            <source media="(min-width: 768px)" src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={fallbackImageUrl}
            alt="DPI cinematic hero background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>
      {/* Dark charcoal scrim, not the light cream wash this originally
          shipped with: a moving aerial video has plenty of bright
          concrete/sky in it, and a light overlay behind dark text meant
          the two were fighting for the same tonal range rather than
          contrasting. Dark-behind-light is the standard, working pattern
          for text over video/photo heroes — text below switches to
          cream/light accordingly (this section only; the shared Button
          component's own colors are untouched). Pushed noticeably darker
          (92/72/45%, up from 85/55/25%) for stronger guaranteed contrast
          regardless of how bright any given frame of the video is. */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/92 via-charcoal/72 to-charcoal/45" />

      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* text-terracotta-light, not the shared text-terracotta: the base
            accent color measures ~3.3:1 against this scrim, short of the
            4.5:1 small-text AA threshold — this lighter, dark-background
            variant (see globals.css) clears it comfortably. */}
        {/* This file's existing sm: rules already apply from 640px up with
            no separate md:/lg: override for these particular properties —
            meaning sm: already covers "tablet and up" here, and stays
            completely untouched below. Every mobile-only change either
            edits the true sub-640px base value directly (spacing, this
            paragraph) or uses max-md: only where nothing at sm: competes
            for the same property (min-height, the heading's own font-size,
            the accent glow) — never both on the same property, which is
            what would actually risk bleeding into the 640-767px range. */}
        <p className="hero-eyebrow mb-3 text-[11px] uppercase tracking-[0.3em] text-terracotta-light sm:mb-5 sm:text-xs sm:tracking-[0.35em]">
          DPI Real Estate &mdash; Your Trusted Channel Partner
        </p>
        {/* Mobile's own size, not the desktop clamp shrunk down: at typical
            phone widths (375-428px) the shared clamp(2.25rem,6vw,5.25rem)
            floors flat at exactly 36px (6vw stays under the 2.25rem minimum
            until ~600px wide), so every phone rendered the identical,
            fairly modest size regardless of its own width — "basic/flat"
            was accurate. This clamp is scaled and re-centered specifically
            for the 375-767px range instead, so it's still fluid within
            mobile rather than another flat floor, and reads meaningfully
            bigger/bolder than before without inheriting anything from the
            desktop value. */}
        <h1 className="font-display max-w-full text-[clamp(2.25rem,6vw,5.25rem)] leading-[1.05] text-cream break-words max-md:text-[clamp(2.5rem,10vw,3.25rem)] max-md:leading-[1.08]">
          {/* Split separately from the accent line below: SplitText wraps
              each character in its own span, which breaks background-clip
              gradient text (the gradient has nothing of its own left to
              clip to once the glyphs move into child elements) — so the
              gradient phrase gets a simple fade/rise instead of a letter
              reveal. */}
          <span ref={headlineRef}>Discovering Landmarks,</span>{" "}
          {/* text-gradient-on-dark, not the shared text-terracotta-gradient:
              that gradient's darkest stop (terracotta-deep) measures ~2:1
              against this scrim — this dark-background variant bounds every
              stop to colors already checked >=3:1 (see globals.css).
              max-md: adds a soft warm text-shadow glow behind the gradient
              — at mobile's smaller point size the gradient itself reads
              quieter than it does large on desktop, so the glow gives it
              back some presence instead of it just sitting flat next to
              the line above. */}
          <span className="hero-accent text-gradient-on-dark max-md:[text-shadow:0_0_24px_rgba(219,160,128,0.45)]">
            Delivering Trust.
          </span>
        </h1>
        <p className="hero-sub mt-4 max-w-xl text-sm leading-relaxed text-cream/85 sm:mt-6 sm:text-base lg:text-lg">
          Landmark residences across Greater Noida, Ghaziabad, Aligarh, and Uttarakhand &mdash; curated for
          you and backed by transparent, trusted guidance.
        </p>
        <div className="hero-cta mt-7 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
          <ButtonLink href="/projects" variant="primary" className="w-full sm:w-auto">
            Explore Projects
          </ButtonLink>
          {/* outline-light, not the shared outline variant — this button sits
              on a dark charcoal video scrim, and the default outline's sage
              text/border is tuned for light surfaces (see Button.tsx). */}
          <ButtonLink href="/contact" variant="outline-light" className="w-full sm:w-auto">
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
