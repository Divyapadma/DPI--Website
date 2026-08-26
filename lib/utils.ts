import { type ClassValue, clsx } from "clsx";

/** Merge conditional class names. (Kept minimal — add tailwind-merge later if class conflicts appear.) */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Whole numbers show no decimals; fractional ones show up to 2 places
// with trailing zeros trimmed (3.50 -> "3.5", 1.25 stays "1.25") — used
// for both L and Cr so "75.5 L" and "3.5 Cr" both actually preserve the
// decimal a flexible price needs, instead of only the Cr branch getting
// any decimal handling at all (the L branch previously always rounded to
// a whole number via toFixed(0), silently dropping any fraction).
function formatAmount(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2).replace(/\.?0+$/, "");
}

export function formatINR(amountInLakhs: number) {
  if (amountInLakhs >= 100) {
    return `₹${formatAmount(amountInLakhs / 100)} Cr`;
  }
  return `₹${formatAmount(amountInLakhs)} L`;
}

/**
 * Single source of truth for how a project's price renders anywhere on
 * the site (card, detail page, admin list) — three admin-entered fields
 * combine into exactly one of four shapes:
 *
 *  - `priceDisplayOverride` set        -> that text, verbatim (e.g.
 *    "Price on Request", "Call for Price") — the escape valve for
 *    anything the numeric fields can't express. Wins over everything
 *    else: a project can still carry a real priceFromLakhs underneath
 *    (so it keeps participating correctly in the budget filter) while
 *    showing custom text publicly.
 *  - only `priceFromLakhs` set          -> "₹75 L+" (open-ended, "starting from")
 *  - both `priceFromLakhs`/`priceToLakhs` set -> "₹75 L – ₹1.2 Cr" (a range —
 *    each bound formats in whichever unit reads best on its own, via
 *    formatINR, so a mixed-unit range like this is normal, not a bug)
 *  - neither numeric field set           -> "Price on Request" (a sensible
 *    default so the UI never shows nothing/NaN, without requiring the
 *    admin to type that exact phrase into the override field themselves)
 */
export function formatProjectPrice(project: {
  priceFromLakhs?: number;
  priceToLakhs?: number;
  priceDisplayOverride?: string;
}): string {
  if (project.priceDisplayOverride) return project.priceDisplayOverride;
  if (project.priceFromLakhs == null) return "Price on Request";
  const from = formatINR(project.priceFromLakhs);
  if (project.priceToLakhs != null) return `${from} – ${formatINR(project.priceToLakhs)}`;
  return `${from}+`;
}

/**
 * A project's Map Embed URL (admin-entered, ProjectForm.tsx) is meant to be
 * just the iframe's `src` — but Google Maps' own "Embed a map" panel hands
 * you the *whole* `<iframe ...>` tag to copy, and a non-technical admin
 * pasting that verbatim would otherwise end up with the literal HTML
 * string inside a `src` attribute. Extracts the URL out of that markup if
 * present; returns the input unchanged (trimmed) otherwise, so a bare URL
 * still works exactly as before.
 */
export function extractMapEmbedSrc(raw: string): string {
  const match = raw.match(/src=["']([^"']+)["']/);
  return (match ? match[1] : raw).trim();
}

/** "DPI Crown Heights" -> "dpi-crown-heights". Used to auto-fill admin form slug fields. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
