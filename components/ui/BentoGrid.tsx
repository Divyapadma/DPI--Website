import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Asymmetric "bento" grid shell. Single column on mobile, 2 up on tablet,
 * a 3-column grid on desktop where individual
 * <BentoItem span="lg:col-span-2 lg:row-span-2" /> calls opt into a
 * bigger footprint — kept per-section rather than algorithmic since each
 * listing's card content (and therefore the pleasing span pattern) differs.
 *
 * lg:auto-rows-[minmax(240px,auto)] — NOT a plain `auto-rows-[240px]`
 * (which this used to be): that set every implicit row to an exact,
 * non-negotiable 240px. A single-span card's image alone (h-56 = 224px)
 * already ate nearly all of that, leaving ~16px for the title/location/
 * price block below it — which rendered as fully invisible, clipped by
 * this container's own overflow-hidden, on every desktop viewport
 * (verified via screenshot: two of three Featured Projects cards showed
 * an image and *nothing* else). minmax's 240px is now only a floor —
 * rows still grow to fit whatever content actually needs, so text is
 * never cropped, while short cards still align to a tidy common height.
 *
 * lg:items-start (paired with BentoItem below dropping its own forced
 * `h-full`): the 2-row-span first item's own content (a taller image +
 * one line of text) is usually shorter than the *combined* height of the
 * two single-span rows it spans — those rows size to the taller image
 * count of two full cards' worth of text, not to the big item's needs.
 * Left on the default `stretch`, that surplus became a large dead blank
 * area inside the big card (its background stretched to fill it, with
 * the price line shoved down to float in empty space) — worse-looking
 * than simply letting the big card sit at its own natural height at the
 * top of the spanned area, gap showing through below it.
 */
export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:auto-rows-[minmax(240px,auto)] lg:items-start lg:gap-6",
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
  // No unconditional `h-full` here (used to be `cn("h-full", span, className)`)
  // — see the `lg:items-start` note above. Below `lg` this changes nothing:
  // each item is alone in its own implicit row there (grid-cols-1/2, no
  // row-span in play), so the grid's default stretch alignment already
  // sizes it to exactly its own content, h-full or not.
  return <div className={cn(span, className)}>{children}</div>;
}
