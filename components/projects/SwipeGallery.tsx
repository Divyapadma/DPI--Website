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
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, children } = track;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(children).forEach((child, i) => {
      const dist = Math.abs((child as HTMLElement).offsetLeft - scrollLeft);
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
