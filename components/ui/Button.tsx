"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

type Variant = "primary" | "outline" | "outline-light" | "ghost";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  // Diagonal gradient instead of a flat fill, plus an inset top highlight +
  // outer glow shadow for a tactile "raised" feel rather than a flat color
  // swatch. Hover/active shift the gradient itself, not just a solid color.
  // Flat solid fill, not a diagonal gradient — pulled back from an earlier
  // gradient/glow pass that pushed the site toward "SaaS dashboard" rather
  // than editorial. Depth on press comes from a shadow that shrinks (a
  // physically "pushed in" surface loses elevation), not a colored glow.
  primary:
    "bg-terracotta text-cream shadow-[0_4px_14px_-6px_rgba(46,42,38,0.35)] hover:bg-terracotta-deep active:shadow-[0_1px_4px_-2px_rgba(46,42,38,0.3)]",
  // A soft resting border (visible on touch, where :hover never fires) plus
  // the SVG rect below draws a crisper full-opacity line in on hover.
  // Sage-on-light: correct contrast on cream/ivory/glass-card surfaces,
  // which is every current usage of "outline" except the Hero (see below).
  outline: "border border-sage/35 text-sage hover:bg-sage/10 active:bg-sage/15 active:border-sage",
  // Same shape/motion as "outline", but for the one case where the button
  // sits directly on a dark photo/video scrim (the Hero) rather than a
  // light surface — sage text at ~35% border opacity reads as barely-there
  // on a dark charcoal background, well short of the site-wide contrast
  // requirement. Cream text/border reads clearly against dark charcoal or
  // photography instead.
  "outline-light": "border border-cream/50 text-cream hover:bg-cream/10 active:bg-cream/15 active:border-cream",
  ghost: "text-charcoal hover:text-terracotta active:text-terracotta-deep",
};

// min-h-[44px] guarantees a touch-friendly tap target regardless of text
// line-height; active: styles give touch devices (no :hover) visible feedback.
const base =
  "group relative inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 py-3 text-sm uppercase tracking-[0.15em] transition-all duration-300 active:scale-[0.98]";

/** Thin rounded-rect outline that draws itself in on hover, via SVG stroke-dashoffset. */
function DrawBorder() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx="9999"
        ry="9999"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        pathLength={1}
        className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-500 ease-out group-hover:[stroke-dashoffset:0]"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(base, variantStyles[variant], className)}
      {...props}
    >
      {(variant === "outline" || variant === "outline-light") && <DrawBorder />}
      <span className="relative">{children}</span>
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  onClick,
}: CommonProps & { href: string; onClick?: () => void }) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={cn(base, variantStyles[variant], className)}
    >
      {(variant === "outline" || variant === "outline-light") && <DrawBorder />}
      <span className="relative">{children}</span>
    </Link>
  );
}
