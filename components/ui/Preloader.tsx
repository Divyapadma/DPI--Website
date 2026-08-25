"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { LOGO_URL } from "@/components/layout/site-info";

const SESSION_KEY = "dpi-preloader-shown";

// Read (and immediately mark) at module scope — evaluated exactly once
// per real browser page load, not per React render/effect. That matters
// specifically because React Strict Mode (on by default in Next.js dev)
// double-invokes effects: mount → cleanup → mount again, synchronously.
// Doing this same read-then-write *inside* the component's effect instead
// meant the first of those two passes already wrote the "shown" flag
// before being cleaned up, so the second pass — the one whose timer
// actually survives — always saw it as an already-shown repeat load and
// hid after 50ms instead of the intended 1600ms. Module-level code has no
// such double-invocation; it only re-runs on an actual new page load.
// `typeof window` guards SSR, where this module is also evaluated but
// sessionStorage doesn't exist.
const isRepeatLoadThisSession = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";
if (typeof window !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");

/**
 * Branded first-load screen: logo fades/settles in, a terracotta line
 * draws under it, then the whole thing lifts away. Shows once per browser
 * session (not on every client-side route change) via sessionStorage.
 *
 * Starts `visible: true` — unconditionally, on both the server-rendered
 * HTML and the client's first render, before any effect runs — so the
 * very first frame the browser paints already has this covering the
 * screen. Starting `false` (and only flipping to `true` inside a
 * post-mount effect, as this previously did) is what caused the loader to
 * visibly appear *after* a flash of real page content: there's always at
 * least one paint between mount and a setTimeout(0) firing, and by then
 * the content underneath was already visible — backwards from what a
 * preloader is for. The effect below only ever moves the *hide* timer
 * earlier (near-instant) on a repeat load within the same tab session —
 * it never delays the first paint, since that's already covered by the
 * initial state, and it never reintroduces the content-before-loader gap.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // First load this session: keep the full branded animation (1.6s).
    // Repeat load (e.g. a hard refresh, or a new tab within the same
    // session): dismiss almost immediately instead — still never zero
    // (that would risk the exit animation racing its own mount), just
    // short enough to not feel like a deliberate second show.
    const hideTimer = setTimeout(() => setVisible(false), isRepeatLoadThisSession ? 50 : 1600);
    return () => clearTimeout(hideTimer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.1, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-cream"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* unoptimized — local path, custom loader returns it unchanged regardless of width (see Navbar.tsx). */}
            <Image src={LOGO_URL} alt="DPI — Divya Padma Infosystem LLP" width={293} height={251} priority unoptimized className="h-24 w-auto sm:h-28" />
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="mt-4 h-[2px] w-24 origin-left bg-terracotta"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
