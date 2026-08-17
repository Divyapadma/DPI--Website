"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

/** Removable chips summarizing each active filter — click one to clear just that filter. */
export default function FilterChips({ chips }: { chips: FilterChip[] }) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.button
            key={chip.key}
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={chip.onRemove}
            className="group flex min-h-[36px] items-center gap-1.5 rounded-full border border-terracotta/30 bg-terracotta/10 px-3.5 py-1.5 text-xs text-terracotta transition-colors hover:border-terracotta hover:bg-terracotta/15"
          >
            {chip.label}
            <X size={13} className="transition-transform duration-200 group-hover:rotate-90" />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
