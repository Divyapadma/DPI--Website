"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";
import type { Project, ProjectStatus } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import ProjectCard from "@/components/projects/ProjectCard";
import TiltCard from "@/components/ui/TiltCard";
import { ButtonLink } from "@/components/ui/Button";
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

      {/* Tablet+: full filter panel, staggered in on mount. An asymmetric
          editorial composition (eyebrow + heading beside the controls,
          like a magazine spread) rather than a plain bordered box — grain
          texture and an atmospheric glow tie it back into the rest of the
          site's visual language, matching PageHero/the nav drawer. */}
      <motion.div
        variants={barVariants}
        initial="hidden"
        animate="visible"
        className="surface-gradient relative hidden rounded-3xl border border-line shadow-soft sm:block"
      >
        {/* Decorative layer clipped to the rounded corners on its own —
            NOT on the outer card itself, which would also clip the
            CityCombobox dropdown below (an absolutely-positioned
            descendant that needs to escape the card's bounds). */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true">
          <div className="grain-texture absolute inset-0 opacity-[0.025]" />
        </div>

        <div className="relative grid gap-8 p-7 sm:p-9 lg:grid-cols-[13rem_1fr] lg:gap-12">
          <motion.div variants={rowVariants} className="lg:pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-terracotta">Refine</p>
            <h3 className="font-display mt-2 text-2xl leading-tight text-charcoal">Your Search</h3>
            <p className="mt-2 hidden text-sm leading-relaxed text-taupe lg:block">
              Narrow down by status, city, and budget.
            </p>
          </motion.div>

          <div className="space-y-7">
            <motion.div variants={rowVariants}>
              <span className="mb-3 block text-xs uppercase tracking-[0.15em] text-taupe">Status</span>
              <StatusPills value={status} onChange={setStatus} layoutId="status-pill-desktop" />
            </motion.div>
            <motion.div
              variants={rowVariants}
              className="flex flex-wrap items-end gap-x-10 gap-y-6 border-t border-line pt-6"
            >
              <div>
                <span className="mb-3 block text-xs uppercase tracking-[0.15em] text-taupe">Location</span>
                <CityCombobox cities={cities} value={city} onChange={setCity} />
              </div>
              <div className="min-w-[240px] max-w-sm flex-1">
                <BudgetSlider min={budgetBounds.min} max={budgetBounds.max} value={maxBudget} onChange={setMaxBudget} />
              </div>
            </motion.div>
          </div>
        </div>
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

          {/* The catalog itself is sparse right now (not "no matches for
              your filters" - that's the empty-state message below) - fill
              the remaining grid slots with an intentional "more coming"
              tile instead of leaving dead white space that reads as
              unfinished. Only when no filter is narrowing things down,
              since a filtered-down result set isn't the same claim as
              "that's everything we have". */}
          {activeCount === 0 &&
            filtered.length > 0 &&
            filtered.length < 3 &&
            Array.from({ length: 3 - filtered.length }).map((_, i) => (
              <motion.div
                key={`coming-soon-${i}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, delay: (filtered.length + i) * 0.04, ease: [0.22, 1, 0.36, 1] },
                }}
                className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line p-8 text-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10">
                  <Sparkles size={18} className="text-terracotta" />
                </span>
                <p className="font-display text-lg text-charcoal">More Addresses Coming Soon</p>
                <p className="max-w-[22ch] text-sm leading-relaxed text-taupe">
                  New developments are added regularly.
                </p>
                <ButtonLink href="/contact" variant="outline" className="mt-1">
                  Notify Me
                </ButtonLink>
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
