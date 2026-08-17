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
 *
 * The ring itself stays opacity-0 (via inline style, set imperatively —
 * same no-React-state reasoning as above) until the *first* real
 * mousemove event: before that, GSAP's quickTo has never set x/y, so the
 * ring sits at its plain CSS position (fixed left-0 top-0) rather than
 * the real pointer position — visible as a small ring apparently
 * floating with no relation to the cursor until the mouse first moves.
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
    cursor.style.opacity = "0";
    document.documentElement.classList.add("has-custom-cursor");

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3.out" });

    let hasMoved = false;
    const onMove = (e: MouseEvent) => {
      if (!hasMoved) {
        hasMoved = true;
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        gsap.to(cursor, { opacity: 1, duration: 0.25 });
      }
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
