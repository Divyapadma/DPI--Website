"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Attach to a button/link: on mousemove within its bounds, the element is
 * pulled a fraction of the way toward the cursor; on leave it springs
 * back. No-ops on touch (no mousemove events fire there), so nothing
 * needs to be conditionally disabled.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);

  function onMouseMove(e: React.MouseEvent<T>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: relX * strength, y: relY * strength, duration: 0.4, ease: "power3.out" });
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  }

  return { ref, onMouseMove, onMouseLeave };
}
