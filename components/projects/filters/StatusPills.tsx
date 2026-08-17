"use client";

import { motion } from "framer-motion";
import type { ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const STATUS_OPTIONS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Under Construction" },
  { value: "ready-to-move", label: "Ready to Move" },
  { value: "completed", label: "Completed" },
];

/**
 * Segmented-control-style status filter: an animated terracotta highlight
 * (shared via `layoutId`) glides from pill to pill instead of each pill
 * just swapping color instantly. `layoutId` must be unique per rendered
 * instance — this component is mounted twice (desktop bar + mobile sheet),
 * and a shared id across both would make framer-motion fight over which
 * instance owns the highlight.
 */
export default function StatusPills({
  value,
  onChange,
  layoutId = "status-pill-highlight",
}: {
  value: ProjectStatus | "all";
  onChange: (v: ProjectStatus | "all") => void;
  layoutId?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "focus-glow relative min-h-[40px] rounded-full px-4 text-sm transition-colors duration-300",
              active ? "text-cream" : "text-taupe hover:text-charcoal"
            )}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-terracotta"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : (
              <span className="absolute inset-0 rounded-full border border-line transition-colors group-hover:border-terracotta/30" />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
