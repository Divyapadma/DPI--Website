import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Asymmetric "bento" grid shell. Single column on mobile, 2 up on tablet,
 * a 3-column / fixed-row-height grid on desktop where individual
 * <BentoItem span="lg:col-span-2 lg:row-span-2" /> calls opt into a
 * bigger footprint — kept per-section rather than algorithmic since each
 * listing's card content (and therefore the pleasing span pattern) differs.
 */
export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:auto-rows-[240px] lg:gap-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoItem({
  children,
  span,
  className,
}: {
  children: ReactNode;
  span?: string;
  className?: string;
}) {
  return <div className={cn("h-full", span, className)}>{children}</div>;
}
