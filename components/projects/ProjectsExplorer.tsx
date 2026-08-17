"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { Project, ProjectStatus } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import ProjectCard from "@/components/projects/ProjectCard";
import TiltCard from "@/components/ui/TiltCard";
import StatusPills, { STATUS_OPTIONS } from "./filters/StatusPills";
import CityCombobox from "./filters/CityCombobox";
import BudgetSlider from "./filters/BudgetSlider";
import FilterChips, { type FilterChip } from "./filters/FilterChips";
import ResultCount from "./filters/ResultCount";
import MobileFilterSheet from "./filters/MobileFilterSheet";

const barVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [sheetOpen, setSheetOpen] = useState(false);

  const cities = useMemo(
    () => Array.from(new Set(projects.map((p) => p.location.city))).sort(),
    [projects]
  );

  // Budget slider bounds are derived from the real data (rounded to tidy
  // 5L steps) rather than an arbitrary hardcoded ceiling, so the slider
  // always spans exactly what's actually on offer.
  const budgetBounds = useMemo(() => {
    if (projects.length === 0) return { min: 0, max: 500 };
    const values = projects.map((p) => p.priceFromLakhs);
    return {
      min: Math.floor(Math.min(...values) / 5) * 5,
      max: Math.ceil(Math.max(...values) / 5) * 5,
    };
  }, [projects]);

  const [maxBudget, setMaxBudget] = useState(budgetBounds.max);

  const activeCount = [city !== "all", status !== "all", maxBudget < budgetBounds.max].filter(Boolean).length;

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (city !== "all" && p.location.city !== city) return false;
      if (status !== "all" && p.status !== status) return false;
      if (p.priceFromLakhs > maxBudget) return false;
      return true;
    });
  }, [projects, city, status, maxBudget]);

  function resetFilters() {
    setCity("all");
    setStatus("all");
    setMaxBudget(budgetBounds.max);
  }

  const chips: FilterChip[] = useMemo(() => {
    const list: FilterChip[] = [];
    if (city !== "all") list.push({ key: "city", label: city, onRemove: () => setCity("all") });
    if (status !== "all") {
      const label = STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
      list.push({ key: "status", label, onRemove: () => setStatus("all") });
    }
    if (maxBudget < budgetBounds.max) {
      list.push({
        key: "budget",
        label: `Up to ${formatINR(maxBudget)}`,
        onRemove: () => setMaxBudget(budgetBounds.max),
      });
    }
    return list;
  }, [city, status, maxBudget, budgetBounds.max]);

  return (
    <div>
      {/* Mobile: single "Filters" trigger opening a bottom sheet */}
      <div className="sm:hidden">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex min-h-[46px] items-center gap-2 rounded-full border border-line bg-ivory px-5 text-sm text-charcoal transition-colors active:border-terracotta/40"
        >
          <SlidersHorizontal size={16} className="text-terracotta" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[11px] font-semibold text-cream">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <MobileFilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        resultCount={filtered.length}
        activeCount={activeCount}
        onReset={resetFilters}
        cities={cities}
        city={city}
        setCity={setCity}
        status={status}
        setStatus={setStatus}
        budgetMin={budgetBounds.min}
        budgetMax={budgetBounds.max}
        maxBudget={maxBudget}
        setMaxBudget={setMaxBudget}
      />

      {/* Tablet+: full filter bar, staggered in on mount */}
      <motion.div variants={barVariants} initial="hidden" animate="visible" className="hidden flex-col gap-6 sm:flex">
        <motion.div variants={rowVariants}>
          <StatusPills value={status} onChange={setStatus} layoutId="status-pill-desktop" />
        </motion.div>
        <motion.div variants={rowVariants} className="flex flex-wrap items-end gap-x-8 gap-y-6">
          <CityCombobox cities={cities} value={city} onChange={setCity} />
          <div className="w-full min-w-[240px] max-w-sm flex-1">
            <BudgetSlider min={budgetBounds.min} max={budgetBounds.max} value={maxBudget} onChange={setMaxBudget} />
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-6 space-y-4 sm:mt-8">
        <FilterChips chips={chips} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <ResultCount count={filtered.length} total={projects.length} />
          <AnimatePresence>
            {activeCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={resetFilters}
                className="hidden items-center gap-1.5 text-sm text-taupe transition-colors hover:text-terracotta sm:flex"
              >
                <RotateCcw size={14} />
                Reset Filters
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div layout className="mt-6 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
            >
              <TiltCard>
                <ProjectCard project={project} />
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-taupe">No projects match the selected filters.</p>
      )}
    </div>
  );
}
