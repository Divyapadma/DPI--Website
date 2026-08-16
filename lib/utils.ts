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
