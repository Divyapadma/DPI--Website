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
 *
 * Hover state is read via `document.elementFromPoint` on every move
 * instead of separate mouseover/mouseout listeners: this site navigates
 * client-side constantly (AnimatePresence page transitions), and a
 * hovered <a>/<button> can be removed from the DOM by a route change
 * without the browser ever firing its mouseout — there's no element left
 * to fire it from. That left the ring stuck scaled up (1.5x) at whatever
 * viewport position the mouse was at when the link disappeared; since
 * the ring is `position: fixed` (viewport-anchored, not page-anchored),
 * scrolling afterwards with the mouse still (a click then a scroll,
 * without moving the mouse, is a completely ordinary sequence) made it
 * appear to be floating over unrelated content further down the page —
 * this is almost certainly the "mystery circle" reported after
 * navigating to a new page. Recomputing from elementFromPoint on every
 * move is self-correcting regardless of what the DOM does underneath it,
 * and also fades the ring out during scroll entirely (reappearing on the
 * next real mousemove) as a second, independent guard against the same
 * "stale position revealed by scroll" failure mode.
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
    let isHovering = false;
    let isScrolling = false;

    const onMove = (e: MouseEvent) => {
      const isFirstMove = !hasMoved;
      if (isFirstMove) {
        hasMoved = true;
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
      }
      if (isFirstMove || isScrolling) {
        isScrolling = false;
        gsap.to(cursor, { opacity: 1, duration: 0.25 });
      }
      moveX(e.clientX);
      moveY(e.clientY);

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const nowHovering = !!target?.closest(HOVER_SELECTOR);
      if (nowHovering !== isHovering) {
        isHovering = nowHovering;
        gsap.to(cursor, { scale: nowHovering ? 1.5 : 1, duration: 0.25, ease: "power3.out" });
      }
    };

    // Fixed-position ring + scrolling without moving the mouse (e.g. click
    // a link, then scroll wheel) is exactly the scenario that made the
    // ring look "stuck" over unrelated content - hide it for the
    // duration, it reappears correctly-positioned on the next move.
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      isScrolling = true;
      gsap.to(cursor, { opacity: 0, duration: 0.15 });
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 400);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
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
