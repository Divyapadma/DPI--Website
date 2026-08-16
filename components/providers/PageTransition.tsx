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
    getLenisInstance()?.scrollTo(0, { immediate: true });
    // New route = new content height; let ScrollTrigger recompute its
    // trigger positions after the DOM settles.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
