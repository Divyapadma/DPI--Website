"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Opacity-only entrance animation — deliberately never touches `transform`,
 * unlike ScrollReveal (which animates x/y). Use this for elements that are
 * also `position: sticky`, where a lingering `transform: translate(0,0)`
 * on the same element can interfere with sticky's containing-block math.
 */
export default function FadeIn({
  children,
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
