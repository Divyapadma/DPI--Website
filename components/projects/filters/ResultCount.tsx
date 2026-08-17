"use client";

import { AnimatePresence, motion } from "framer-motion";

/** "N Projects Found" with the number itself rolling in/out vertically on change, instead of an instant text swap. */
export default function ResultCount({ count, total }: { count: number; total: number }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5 text-sm text-taupe">
      <span className="relative inline-flex h-6 items-center overflow-hidden align-middle">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={count}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-lg text-charcoal"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </span>
      <span>{count === 1 ? "Project" : "Projects"} Found</span>
      {count !== total && <span className="text-taupe/60">— out of {total} total</span>}
    </p>
  );
}
