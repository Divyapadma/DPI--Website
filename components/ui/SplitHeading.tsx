"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";

type Tag = "h1" | "h2" | "h3";

/**
 * Animates a heading in word-by-word (default) or letter-by-letter via
 * GSAP SplitText, triggered on scroll into view unless `trigger="mount"`
 * (used for the hero, which should animate immediately, not on scroll).
 */
export default function SplitHeading({
  as: Tag = "h2",
  text,
  className,
  splitType = "words",
  trigger = "scroll",
  delay = 0,
}: {
  as?: Tag;
  text: string;
  className?: string;
  splitType?: "words" | "chars";
  trigger?: "scroll" | "mount";
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  // useLayoutEffect, not useEffect: SplitText physically replaces el's text
  // node with wrapper <span> elements — a real DOM mutation React doesn't
  // know about. On unmount, split.revert() has to put the original text
  // node back *before* React's own commit-phase DOM removal runs, or React
  // tries to removeChild a node SplitText already swapped out ("Failed to
  // execute 'removeChild' on 'Node': The node to be removed is not a child
  // of this node"). useEffect cleanup fires after that removal already
  // happened; useLayoutEffect cleanup fires synchronously before it.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      split = new SplitText(el, {
        // For "chars" mode, split words *and* chars — the word wrapper is
        // what the browser breaks lines on, so letters never get orphaned
        // mid-word onto their own line the way a chars-only split can.
        type: splitType === "chars" ? "words, chars" : "words",
        wordsClass: "split-word",
        charsClass: "split-char",
      });
      const targets = splitType === "chars" ? split.chars : split.words;

      gsap.set(targets, { yPercent: 110, opacity: 0 });

      const anim = {
        yPercent: 0,
        opacity: 1,
        duration: splitType === "chars" ? 0.7 : 0.9,
        stagger: splitType === "chars" ? 0.02 : 0.08,
        ease: "power3.out",
        delay,
      };

      if (trigger === "mount") {
        gsap.to(targets, anim);
      } else {
        gsap.to(targets, {
          ...anim,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
    }, el);

    return () => {
      // split.revert() first: restore the original text node before ctx.revert()
      // kills the tween/ScrollTrigger targeting the (about to be removed) spans.
      split?.revert();
      ctx.revert();
    };
  }, [text, splitType, trigger, delay]);

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
