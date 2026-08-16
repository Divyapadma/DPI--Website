import type { ImageLoaderProps } from "next/image";

/**
 * Custom next/image loader for ImageKit-hosted media.
 *
 * ImageKit already resizes/compresses/reformats on the fly via its own
 * `?tr=` URL params, so this bypasses Next's built-in image optimizer
 * entirely (no double-processing, no Vercel image-optimization usage)
 * and just appends ImageKit's transformation string to whatever full
 * ImageKit URL is stored in the DB.
 *
 * Local assets (anything starting with "/", e.g. the public/images/
 * placeholder-*.svg fallbacks used before real content arrives) pass
 * through untouched — they're not on ImageKit.
 */
export default function imageKitLoader({ src, width, quality }: ImageLoaderProps) {
  if (src.startsWith("/") || src.startsWith("data:") || src.endsWith(".svg")) {
    return src;
  }

  const transformations = [`w-${width}`, `q-${quality ?? 75}`];
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}tr=${transformations.join(",")}`;
}
