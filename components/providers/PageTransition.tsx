"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollTrigger } from "@/lib/gsap";
import { getLenisInstance } from "./lenis-store";

/**
 * Soft fade-through between routes (cross-fade + slight lift) instead of
 * an instant cut. Also resets Lenis's virtual scroll position to the top
 * on navigation — Next.js resets the *native* scroll, but Lenis tracks
 * its own interpolated position, so without this the page can render
 * scrolled to the old spot while Lenis "thinks" it's still there.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Safe to do immediately — this only changes scroll position, not DOM
    // structure, so it can't race with React/AnimatePresence's own DOM work.
    getLenisInstance()?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        // Only re-measure ScrollTrigger positions once THIS page has
        // fully finished entering — not on every pathname change via a
        // bare effect. Calling ScrollTrigger.refresh() while
        // AnimatePresence is still mid-exit/enter made GSAP re-query DOM
        // nodes (including RevealImage's ScrollTrigger instances) at the
        // same moment React/framer-motion were still adding/removing
        // that exact subtree — the two DOM-lifecycle managers stepped on
        // each other, surfacing as "Failed to execute 'removeChild'" and
        // leaving the next render in a broken state. Waiting for
        // onAnimationComplete guarantees the transition's DOM work is
        // fully settled before GSAP touches anything.
        onAnimationComplete={() => ScrollTrigger.refresh()}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
