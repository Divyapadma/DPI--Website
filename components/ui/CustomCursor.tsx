"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const HOVER_SELECTOR = "a, button, [data-cursor-hover]";

/**
 * Small, subtle terracotta ring cursor — follows the pointer and scales
 * up slightly over links/buttons. Deliberately minimal: one element, one
 * movement speed, one hover transition — no trailing dot, no click
 * animation. Only activates on devices with a fine pointer (mouse/
 * trackpad); touch devices keep their native cursor. The container
 * renders `hidden` by default (matches SSR, no hydration mismatch) and
 * is revealed via direct DOM manipulation — not React state — once the
 * pointer check passes, so there's no setState-in-effect.
 */
export default function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container || !cursor) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    container.classList.remove("hidden");
    document.documentElement.classList.add("has-custom-cursor");

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      moveX(e.clientX);
      moveY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(HOVER_SELECTOR)) {
        gsap.to(cursor, { scale: 1.5, duration: 0.25, ease: "power3.out" });
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(HOVER_SELECTOR)) {
        gsap.to(cursor, { scale: 1, duration: 0.25, ease: "power3.out" });
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[9999] hidden">
      <div
        ref={cursorRef}
        className="fixed left-0 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-terracotta"
      />
    </div>
  );
}
