"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SESSION_KEY = "dpi-preloader-shown";

/**
 * Branded first-load screen: logo fades/settles in, a terracotta line
 * draws under it, then the whole thing lifts away. Shows once per browser
 * session (not on every client-side route change) via sessionStorage.
 */
export default function Preloader() {
  // Starts false on both server and client — no hydration mismatch, no
  // separate "mounted" gate needed. The effect below only flips it on
  // conditionally (once per session), never unconditionally.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    // Deferred into a callback (not called synchronously in the effect
    // body) — shows the preloader, then hides it again after a beat.
    const showTimer = setTimeout(() => setVisible(true), 0);
    const hideTimer = setTimeout(() => setVisible(false), 1600);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
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
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl text-charcoal"
          >
            DPI<span className="text-terracotta">.</span>
          </motion.p>
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
