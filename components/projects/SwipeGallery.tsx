"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RevealImage from "@/components/ui/RevealImage";
import { cn } from "@/lib/utils";

/**
 * Full-bleed, natively swipeable gallery via CSS scroll-snap — no JS touch
 * handling needed for the swipe itself, just prev/next affordances for
 * mouse/keyboard users and a slide indicator.
 */
export default function SwipeGallery({ images, alt }: { images: string[]; alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function scrollToIndex(i: number) {
    const track = trackRef.current;
    const slide = track?.children[i] as HTMLElement | undefined;
    if (!track || !slide) return;
    // Not slide.scrollIntoView() — inside a scroll-snap-mandatory track,
    // Chromium's scrollIntoView(inline: "center") reliably lands one full
    // slide short of the requested target (verified: targeting slide i
    // consistently produced slide i-1's resting scrollLeft, on every
    // slide, every time — this is what made the desktop Next/Previous
    // arrows look like they'd stopped doing anything, since each click
    // was silently scrolling to the slide already on screen). Computing
    // the centering offset ourselves and calling scrollTo() directly on
    // the track sidesteps that interaction with snap entirely.
    const target = slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2;
    track.scrollTo({ left: target, behavior: "smooth" });
    // Set `active` directly here rather than waiting for onScroll to infer
    // it — this is what actually made Next look dead after the first
    // click. With ~3 slides visible at once at lg, centering slide 1 from
    // slide 0 takes under a pixel of scroll; the browser doesn't fire a
    // `scroll` event for a change that small, so onScroll's setActive
    // never ran, `active` stayed frozen at its initial 0 forever, and
    // every later click kept recomputing the same already-reached target.
    // onScroll still runs for real user-driven swipes/wheel scroll below,
    // so manual scrolling keeps the dots in sync too.
    setActive(i);
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    // Compares each slide's own center to the *viewport's* center — not
    // scrollLeft to each slide's left edge (what this used to do). That
    // mismatch was the actual bug behind Next/Previous looking dead on
    // desktop: at lg, ~3 slides are visible at once, so centering slide 1
    // only takes ~1px of scroll — nowhere near enough to become "closest"
    // to scrollLeft by a left-edge measure, which kept reporting slide 0
    // as active forever. Every subsequent Next click re-targeted slide 1
    // again, and `active` could never advance past 0. Measuring by center
    // (matching both the CSS snap-center on each slide and scrollToIndex's
    // own centering math above) keeps `active` in sync with what's
    // actually centered, so each click advances from wherever the
    // previous one actually landed.
    const viewportCenter = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - viewportCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  }

  return (
    <div className="relative mt-4 -mx-5 sm:mx-0">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:rounded-xl sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] w-[82%] shrink-0 snap-center overflow-hidden rounded-xl sm:w-[46%] lg:w-[32%]"
          >
            <RevealImage
              src={img}
              alt={`${alt} gallery ${i + 1}`}
              fill
              // Matches this slide's own width classes above
              // (w-[82%]/sm:w-[46%]/lg:w-[32%]) — without it, every
              // thumbnail in the gallery would fetch a full-viewport-width
              // image despite never rendering anywhere near that size.
              sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 82vw"
              wrapperClassName="h-full w-full"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                onClick={() => scrollToIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active ? "w-5 bg-terracotta" : "w-1.5 bg-line"
                )}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-2 sm:flex">
            <button
              aria-label="Previous image"
              onClick={() => scrollToIndex(Math.max(0, active - 1))}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ivory/90 text-charcoal shadow-soft transition-colors hover:border-terracotta hover:text-terracotta"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Next image"
              onClick={() => scrollToIndex(Math.min(images.length - 1, active + 1))}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ivory/90 text-charcoal shadow-soft transition-colors hover:border-terracotta hover:text-terracotta"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
