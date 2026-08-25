import { type ClassValue, clsx } from "clsx";

/** Merge conditional class names. (Kept minimal — add tailwind-merge later if class conflicts appear.) */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatINR(amountInLakhs: number) {
  if (amountInLakhs >= 100) {
    const crores = amountInLakhs / 100;
    return `₹${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2)} Cr`;
  }
  return `₹${amountInLakhs.toFixed(0)} L`;
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
