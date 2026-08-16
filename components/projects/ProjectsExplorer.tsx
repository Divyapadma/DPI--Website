"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import type { Project, ProjectStatus } from "@/lib/types";
import ProjectCard from "@/components/projects/ProjectCard";
import TiltCard from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Under Construction" },
  { value: "ready-to-move", label: "Ready to Move" },
  { value: "completed", label: "Completed" },
];

const BUDGET_OPTIONS = [
  { value: "all", label: "Any Budget" },
  { value: "75", label: "Up to ₹75 L" },
  { value: "150", label: "Up to ₹1.5 Cr" },
  { value: "300", label: "Up to ₹3 Cr" },
];

export default function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [maxBudget, setMaxBudget] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const cities = useMemo(
    () => Array.from(new Set(projects.map((p) => p.location.city))).sort(),
    [projects]
  );

  const activeCount = [city, status, maxBudget].filter((v) => v !== "all").length;

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (city !== "all" && p.location.city !== city) return false;
      if (status !== "all" && p.status !== status) return false;
      if (maxBudget !== "all" && p.priceFromLakhs > Number(maxBudget)) return false;
      return true;
    });
  }, [projects, city, status, maxBudget]);

  // Shared styles: full-width + stacked on mobile (inside the accordion),
  // compact pills side by side from `sm` up. min-h-[44px] keeps every
  // control a touch-friendly tap target.
  // text-base (16px) avoids iOS Safari auto-zooming the page on focus.
  const selectClass =
    "focus-glow min-h-[44px] w-full rounded-xl border border-line bg-ivory px-4 py-2.5 text-base text-charcoal outline-none transition-colors sm:w-auto sm:rounded-full sm:px-5 sm:text-sm";

  return (
    <div>
      {/* Mobile / tablet-portrait: collapsible filter accordion */}
      <div className="sm:hidden">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-line bg-ivory px-4 py-3 text-sm text-charcoal"
          aria-expanded={filtersOpen}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-terracotta" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[11px] font-semibold text-cream">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown
            size={18}
            className={cn("text-taupe transition-transform", filtersOpen && "rotate-180")}
          />
        </button>

        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-col gap-3">
                <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
                  <option value="all">All Locations</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus | "all")}
                  className={selectClass}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <select value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className={selectClass}>
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tablet+ : horizontal filter bar */}
      <div className="hidden sm:flex sm:flex-wrap sm:gap-3">
        <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
          <option value="all">All Locations</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus | "all")}
          className={selectClass}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className={selectClass}>
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-5 text-sm text-taupe sm:mt-6">
        Showing {filtered.length} of {projects.length} projects
      </p>

      <motion.div layout className="mt-6 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TiltCard>
              <ProjectCard project={project} />
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-taupe">No projects match the selected filters.</p>
      )}
    </div>
  );
}
