"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getLenisInstance } from "./lenis-store";

type Displayed = { path: string; node: React.ReactNode };

/**
 * Soft fade-through between routes (cross-fade + slight lift) instead of
 * an instant cut.
 *
 * Why this isn't just "<AnimatePresence key={pathname}>{children}</...>":
 * on rapid navigation (click a nav link, then click another before the
 * ~500ms exit animation finishes) `pathname` changes twice in quick
 * succession. AnimatePresence with mode="wait" is only designed to
 * handle one key swap at a time — handing it a second key change while
 * the first child's exit animation hasn't finished removing its DOM
 * node yet made framer-motion and React's own commit both try to tear
 * down the same node, which is exactly what threw "Failed to execute
 * 'removeChild' on 'Node': The node to be removed is not a child of
 * this node." and left the tree broken for every navigation after it.
 *
 * The fix is to gate it ourselves: keep a `displayed` snapshot (path +
 * content) that only advances to a new route once the previous exit has
 * fully completed. If the real pathname changes again mid-transition,
 * we queue just the latest target instead of forwarding every change
 * straight into AnimatePresence.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayed, setDisplayed] = useState<Displayed>({ path: pathname, node: children });
  const animatingRef = useRef(false);
  const pendingRef = useRef<Displayed | null>(null);

  // Same route re-rendering with fresh content (e.g. after a mutation) -
  // adjust synchronously during render, no key change / transition needed.
  // (This is the React-recommended "adjust state when a prop changes"
  // pattern, not an effect, so it can't cascade into another commit.)
  if (pathname === displayed.path && children !== displayed.node) {
    setDisplayed({ path: pathname, node: children });
  }

  useEffect(() => {
    if (pathname === displayed.path) return;

    if (animatingRef.current) {
      // A transition is already in flight - queue only the most recent
      // target instead of handing AnimatePresence a second key change
      // before the current exit has finished removing its DOM node.
      pendingRef.current = { path: pathname, node: children };
      return;
    }

    animatingRef.current = true;
    setDisplayed({ path: pathname, node: children });
  }, [pathname, children, displayed]);

  useEffect(() => {
    // Resets Lenis's virtual scroll position on route change - Next.js
    // resets native scroll, but Lenis tracks its own interpolated
    // position separately. Only touches scroll, never DOM structure, so
    // it can't race with AnimatePresence's own DOM work.
    getLenisInstance()?.scrollTo(0, { immediate: true });
  }, [displayed.path]);

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        const next = pendingRef.current;
        pendingRef.current = null;
        if (next) {
          setDisplayed(next);
        } else {
          animatingRef.current = false;
        }
      }}
    >
      <motion.div
        key={displayed.path}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {displayed.node}
      </motion.div>
    </AnimatePresence>
  );
}
