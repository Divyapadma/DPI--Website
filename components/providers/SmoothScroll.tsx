"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenisInstance } from "./lenis-store";

/**
 * Site-wide smooth scroll, synced with GSAP's ticker so every
 * ScrollTrigger-driven animation (image reveals, pinned sections, split
 * text) reads the same scroll position Lenis is interpolating — without
 * this sync, ScrollTrigger and Lenis independently smooth the scroll and
 * drift out of phase.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    setLenisInstance(lenis);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
