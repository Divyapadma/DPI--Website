"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Mail, MapPin, Phone, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getLenisInstance } from "@/components/providers/lenis-store";
import { CONTACT, NAV_LINKS, SOCIALS } from "./site-info";

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const panelVariants: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 340, damping: 36 } },
  exit: { x: "100%", transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
};

// One shared stagger orchestrator for every row in the scrollable middle
// section — nav links, divider, contact rows, and the social row all sit
// underneath it (through plain, non-motion <ul>/<div> wrappers, which don't
// break variant propagation) so the whole thing cascades in as one sequence
// rather than several independent bursts.
const contentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.22 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function MobileNavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  // Lock scroll (both native and Lenis's own smooth-scroll input handling —
  // stopping Lenis alone leaves native touch-scroll on iOS untouched, and
  // vice versa) for as long as the drawer is open.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenisInstance();
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-charcoal/45 backdrop-blur-sm lg:hidden"
          />

          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-y-0 right-0 z-[95] flex w-[86vw] max-w-[400px] flex-col bg-ivory shadow-[-24px_0_60px_-20px_rgba(46,42,38,0.35)] lg:hidden"
          >
            <div className="grain-texture pointer-events-none absolute inset-0 opacity-[0.035]" aria-hidden="true" />

            {/* Header */}
            <div className="relative flex shrink-0 items-center justify-between border-b border-line px-6 py-4 sm:px-8">
              <Link href="/" onClick={onClose} className="font-display text-2xl text-charcoal">
                DPI<span className="text-terracotta">.</span>
              </Link>
              <button
                aria-label="Close menu"
                onClick={onClose}
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-taupe transition-colors hover:bg-paper hover:text-terracotta"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable middle: nav links + contact + socials */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="relative flex-1 overflow-y-auto px-6 py-6 sm:px-8"
            >
              <ul className="space-y-0.5">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <motion.li key={link.href} variants={rowVariants}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        data-active={active}
                        className={cn(
                          "underline-grow font-display inline-block py-1.5 text-[1.7rem] leading-tight transition-colors sm:text-[2.05rem]",
                          active ? "text-terracotta" : "text-charcoal hover:text-terracotta"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div variants={rowVariants} className="my-6 h-px bg-line" />

              <div className="space-y-3 text-sm text-taupe">
                <motion.div variants={rowVariants} className="flex gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-terracotta" />
                  <span>{CONTACT.address}</span>
                </motion.div>
                <motion.a
                  variants={rowVariants}
                  href={CONTACT.phoneHref}
                  className="flex min-h-[44px] items-center gap-3 transition-colors hover:text-terracotta"
                >
                  <Phone size={18} className="shrink-0 text-terracotta" />
                  {CONTACT.phone}
                </motion.a>
                <motion.a
                  variants={rowVariants}
                  href={CONTACT.emailHref}
                  className="flex min-h-[44px] items-center gap-3 break-all transition-colors hover:text-terracotta"
                >
                  <Mail size={18} className="shrink-0 text-terracotta" />
                  {CONTACT.email}
                </motion.a>
              </div>

              <motion.div variants={rowVariants} className="mt-5 flex gap-3">
                {SOCIALS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-sage/35 text-sage transition-all duration-200 hover:scale-110 hover:border-terracotta hover:text-terracotta active:scale-95"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </motion.div>
            </motion.div>

            {/* Hints there's more to scroll, without needing a visible scrollbar —
                harmless/invisible when content already fits (blends into the
                solid ivory below it either way). */}
            <div className="pointer-events-none absolute inset-x-0 bottom-[76px] h-8 bg-gradient-to-t from-ivory to-transparent" />

            {/* Fixed bottom CTA — stays put regardless of middle-section scroll */}
            <div className="relative shrink-0 border-t border-line px-6 py-4 sm:px-8">
              <ButtonLink href="/contact" onClick={onClose} variant="primary" className="w-full">
                Enquire Now
              </ButtonLink>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
