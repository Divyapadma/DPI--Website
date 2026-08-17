"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import type { ProjectStatus } from "@/lib/types";
import { getLenisInstance } from "@/components/providers/lenis-store";
import { Button } from "@/components/ui/Button";
import StatusPills from "./StatusPills";
import CityCombobox from "./CityCombobox";
import BudgetSlider from "./BudgetSlider";

export default function MobileFilterSheet({
  open,
  onClose,
  resultCount,
  activeCount,
  onReset,
  cities,
  city,
  setCity,
  status,
  setStatus,
  budgetMin,
  budgetMax,
  maxBudget,
  setMaxBudget,
}: {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  activeCount: number;
  onReset: () => void;
  cities: string[];
  city: string;
  setCity: (v: string) => void;
  status: ProjectStatus | "all";
  setStatus: (v: ProjectStatus | "all") => void;
  budgetMin: number;
  budgetMax: number;
  maxBudget: number;
  setMaxBudget: (v: number) => void;
}) {
  // Scroll lock while the sheet is open — same pattern as MobileNavDrawer.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenisInstance();
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handleDragEnd(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 500) onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-charcoal/35 backdrop-blur-[2px] sm:hidden"
          />

          <motion.div
            key="sheet-panel"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            role="dialog"
            aria-modal="true"
            aria-label="Filter projects"
            className="surface-gradient fixed inset-x-0 bottom-0 z-[95] flex max-h-[85vh] flex-col rounded-t-[28px] shadow-[0_-24px_60px_-20px_rgba(46,42,38,0.35)] sm:hidden"
          >
            <div className="grain-texture pointer-events-none absolute inset-0 rounded-t-[28px] opacity-[0.035]" aria-hidden="true" />

            <div className="flex shrink-0 cursor-grab justify-center pt-3 active:cursor-grabbing">
              <span className="h-1.5 w-10 rounded-full bg-line" />
            </div>

            <div className="relative flex shrink-0 items-center justify-between px-5 pb-4 pt-2">
              <h3 className="font-display text-xl text-charcoal">Filters</h3>
              <button
                aria-label="Close filters"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-taupe transition-colors hover:bg-cream hover:text-terracotta"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative flex-1 overflow-y-auto border-t border-line px-5 py-6">
              <div className="space-y-7">
                <div>
                  <span className="mb-3 block text-xs uppercase tracking-[0.15em] text-taupe">Status</span>
                  <StatusPills value={status} onChange={setStatus} layoutId="status-pill-mobile" />
                </div>
                <div>
                  <span className="mb-3 block text-xs uppercase tracking-[0.15em] text-taupe">Location</span>
                  <CityCombobox cities={cities} value={city} onChange={setCity} />
                </div>
                <BudgetSlider min={budgetMin} max={budgetMax} value={maxBudget} onChange={setMaxBudget} />
              </div>
            </div>

            <div className="relative flex shrink-0 items-center gap-3 border-t border-line px-5 py-4">
              {activeCount > 0 && (
                <button
                  onClick={onReset}
                  className="flex min-h-[48px] items-center gap-1.5 px-2 text-sm text-taupe transition-colors hover:text-terracotta"
                >
                  <RotateCcw size={15} />
                  Reset
                </button>
              )}
              <Button onClick={onClose} className="flex-1">
                Show {resultCount} {resultCount === 1 ? "Result" : "Results"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
