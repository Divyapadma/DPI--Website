"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import RevealImage from "@/components/ui/RevealImage";

/** Click-to-play walkthrough video — shows a poster until clicked, so the video file isn't loaded/played until the visitor actually wants it. */
export default function WalkthroughVideo({ videoUrl, posterImage, alt }: { videoUrl: string; posterImage: string; alt: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="mt-4 overflow-hidden rounded-2xl bg-charcoal">
        <video src={videoUrl} controls autoPlay playsInline className="aspect-video w-full" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label="Play walkthrough video"
      className="group relative mt-4 block aspect-video w-full overflow-hidden rounded-2xl"
    >
      <RevealImage
        src={posterImage}
        alt={alt}
        fill
        // This poster lives in the project detail page's lg:col-span-2
        // content column (2 of 3 columns, ~66vw at lg), full width below
        // that — without it, next/image always fetches the largest
        // ImageKit-transformed candidate regardless of the real render size.
        sizes="(min-width: 1024px) 66vw, 100vw"
        wrapperClassName="h-full w-full"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/30 transition-colors group-hover:bg-charcoal/40" />
      <PlayCircle
        size={64}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-cream drop-shadow-lg transition-transform group-hover:scale-110"
      />
    </button>
  );
}
