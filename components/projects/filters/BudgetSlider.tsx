"use client";

import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Custom-styled (not default-browser-look) single-thumb range: dragging
 * left of the max sets a budget cap; resting at the max edge reads as
 * "Any Budget" (no filter applied). The filled portion of the track is
 * painted via an inline gradient tied to the current percentage, since
 * that's the one part of a native range input's look CSS can't reach any
 * other way (the track background itself, not just the thumb).
 */
export default function BudgetSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const isCapped = value < max;

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-[0.15em] text-taupe">Budget</span>
        <span className="font-display text-base text-charcoal">
          {isCapped ? `Up to ${formatINR(value)}` : "Any Budget"}
        </span>
      </div>

      <div className="py-2">
        <input
          type="range"
          min={min}
          max={max}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Maximum budget"
          style={{
            background: `linear-gradient(to right, var(--color-terracotta) ${percent}%, var(--color-line) ${percent}%)`,
          }}
          className={cn(
            "h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none",
            "[&::-webkit-slider-runnable-track]:appearance-none [&::-webkit-slider-runnable-track]:bg-transparent",
            "[&::-moz-range-track]:appearance-none [&::-moz-range-track]:bg-transparent",
            "[&::-webkit-slider-thumb]:h-[22px] [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-ivory",
            "[&::-webkit-slider-thumb]:bg-terracotta [&::-webkit-slider-thumb]:shadow-[0_2px_10px_rgba(201,124,93,0.5)]",
            "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150",
            "hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-125",
            "[&::-moz-range-thumb]:h-[22px] [&::-moz-range-thumb]:w-[22px] [&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-ivory [&::-moz-range-thumb]:bg-terracotta",
            "[&::-moz-range-thumb]:shadow-[0_2px_10px_rgba(201,124,93,0.5)]"
          )}
        />
      </div>

      <div className="flex justify-between text-[11px] text-taupe/70">
        <span>{formatINR(min)}</span>
        <span>{formatINR(max)}+</span>
      </div>
    </div>
  );
}
