"use client";

import { motion } from "framer-motion";

const PHONE = "919220907340";
const MESSAGE = "Hi, I'm interested in your projects";
const HREF = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

/**
 * Site-wide floating WhatsApp button — fixed bottom-right on every (site)
 * page, above page content but below modal-level overlays (nav drawer /
 * filter sheet both sit at z-90+, so those correctly cover this rather
 * than it floating on top of an open drawer).
 *
 * The brand mark is the actual WhatsApp glyph (Font Awesome's long-standing
 * whatsapp path, MIT-licensed), not a generic chat-bubble icon — a generic
 * icon in the right color isn't "recognizable" the way the real mark is.
 * The ring behind it is a slow, intermittent pulse (most of its 5s cycle
 * is spent invisible) rather than a continuous animate-ping — enough to
 * catch the eye occasionally without nagging on every page.
 */
export default function WhatsAppButton() {
  return (
    <motion.a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with DPI on WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_28px_-6px_rgba(37,211,102,0.55)] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16 lg:bottom-8 lg:right-8"
    >
      <span
        aria-hidden="true"
        className="whatsapp-ping-ring absolute inset-0 rounded-full bg-[#25D366]"
      />
      <svg viewBox="0 0 448 512" className="relative h-7 w-7 sm:h-8 sm:w-8" fill="#fff" aria-hidden="true">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
      </svg>
    </motion.a>
  );
}
