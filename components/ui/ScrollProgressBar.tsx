"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin terracotta line at the very top of the viewport, tracking scroll progress. */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left bg-terracotta"
    />
  );
}
