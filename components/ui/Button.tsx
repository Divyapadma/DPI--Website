"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

type Variant = "primary" | "outline" | "ghost";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-terracotta text-cream hover:bg-terracotta-soft active:bg-terracotta-deep",
  // A soft resting border (visible on touch, where :hover never fires) plus
  // the SVG rect below draws a crisper full-opacity line in on hover.
  outline: "border border-sage/35 text-sage hover:bg-sage/10 active:bg-sage/15 active:border-sage",
  ghost: "text-charcoal hover:text-terracotta active:text-terracotta-deep",
};

// min-h-[44px] guarantees a touch-friendly tap target regardless of text
// line-height; active: styles give touch devices (no :hover) visible feedback.
const base =
  "group relative inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 py-3 text-sm uppercase tracking-[0.15em] transition-colors duration-300 active:scale-[0.98]";

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
      {variant === "outline" && <DrawBorder />}
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
      {variant === "outline" && <DrawBorder />}
      <span className="relative">{children}</span>
    </Link>
  );
}
