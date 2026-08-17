"use client";

import { useLayoutEffect, useRef } from "react";
import Image, { type ImageProps } from "next/image";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Wraps next/image and wipes it into view via clip-path as it scrolls
 * into the viewport, instead of a plain fade — the highest-impact piece
 * of the interaction layer per the brief. Direction defaults to a
 * left-to-right reveal; pass `direction="up"` for a bottom-to-top wipe.
 */
export default function RevealImage({
  wrapperClassName,
  direction = "left",
  alt,
  ...imageProps
}: ImageProps & { wrapperClassName?: string; direction?: "left" | "up" }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect for consistency with the other GSAP-context components
  // in this codebase (SplitHeading, Hero, WhyChooseUsPinned) — doesn't
  // restructure DOM children itself, but keeps GSAP setup/teardown timing
  // uniform relative to React's commit phase across the whole animation layer.
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!wrapper || !img) return;

    const from = direction === "left" ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)";
    const to = "inset(0 0% 0 0)";

    gsap.set(wrapper, { clipPath: from });
    gsap.set(img, { scale: 1.15 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top 85%",
          once: true,
        },
      });
      tl.to(wrapper, { clipPath: to, duration: 1.1, ease: "power3.inOut" }).to(
        img,
        { scale: 1, duration: 1.3, ease: "power3.out" },
        "-=0.9"
      );
    }, wrapper);

    return () => ctx.revert();
  }, [direction]);

  return (
    <div ref={wrapperRef} className={cn("relative overflow-hidden", wrapperClassName)}>
      <div ref={imgRef} className="relative h-full w-full">
        <Image alt={alt} {...imageProps} />
      </div>
    </div>
  );
}
