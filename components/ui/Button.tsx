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

// One easing curve, used everywhere in this file (and matching the site's
// other premium-motion moments — ScrollReveal, underline-grow) so every
// button variant's hover feels like the same hand drew it, per the "must
// be consistent across button types" requirement. A plain duration-300
// with the browser default ease is what read as "cheap instant swap" —
// this decelerates into place instead of stopping abruptly.
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const variantStyles: Record<Variant, string> = {
  // Fill swap + a shadow that grows AND lifts (not just darkens) — the
  // combination the brief asked for instead of a flat color swap. Press
  // reverses both: shadow shrinks back down and the lift resets, so it
  // reads as a physical surface being pushed in, not just a color change.
  primary:
    "bg-terracotta text-cream shadow-[0_4px_14px_-6px_rgba(46,42,38,0.35)] hover:-translate-y-0.5 hover:bg-terracotta-deep hover:shadow-[0_14px_28px_-10px_rgba(46,42,38,0.45)] active:translate-y-0 active:shadow-[0_2px_6px_-2px_rgba(46,42,38,0.35)]",
  // The SVG stroke-dashoffset "border draws itself in" effect (an earlier
  // pass on this exact variant) read as a cheap trick rather than premium
  // motion once actually seen in use, so it's gone — DrawBorder is deleted
  // below, not just unused. In its place: the outline fills solid on
  // hover, same "surface transforms" idea as primary's shadow-lift, just
  // starting from transparent-with-a-border instead of already-filled.
  // Text flips to cream so it stays readable once the fill lands.
  outline:
    "border border-sage/35 text-sage hover:-translate-y-0.5 hover:border-sage hover:bg-sage hover:text-cream hover:shadow-[0_14px_28px_-10px_rgba(125,138,112,0.4)] active:translate-y-0 active:bg-sage-deep active:border-sage-deep active:text-cream",
  // Same fill-on-hover idea as "outline", but for the one case where the
  // button sits directly on a dark photo/video scrim (the Hero) rather
  // than a light surface — sage reads as barely-there on dark charcoal,
  // short of the site-wide contrast requirement. Cream border/text at
  // rest, and the hover fill is cream too, so the flipped text needs to
  // go dark (charcoal) instead of the light-surface variant's cream, to
  // stay readable against its own now-light fill.
  "outline-light":
    "border border-cream/50 text-cream hover:-translate-y-0.5 hover:border-cream hover:bg-cream hover:text-charcoal hover:shadow-[0_14px_28px_-10px_rgba(0,0,0,0.35)] active:translate-y-0 active:bg-cream/90 active:text-charcoal",
  // Underline draws in from the left on hover (mirrors underline-grow's
  // center-out draw used on nav links, just left-anchored to suit an
  // inline text button) instead of a flat color swap with nothing else
  // moving.
  ghost:
    "text-charcoal after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-terracotta after:transition-transform after:duration-400 after:content-[''] hover:text-terracotta hover:after:scale-x-100 active:text-terracotta-deep",
};

// min-h-[44px] guarantees a touch-friendly tap target regardless of text
// line-height; active: styles give touch devices (no :hover) visible
// feedback. duration-[400ms] (not a bare "duration-300") + EASE apply to
// every property every variant transitions (transform, shadow, background,
// border, color) — one shared timing/curve is what makes the whole set
// read as one system instead of each variant animating on its own terms.
const base = `group relative inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 py-3 text-sm uppercase tracking-[0.15em] transition-all duration-[400ms] ${EASE} active:scale-[0.98]`;

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
      <span className="relative">{children}</span>
    </Link>
  );
}
