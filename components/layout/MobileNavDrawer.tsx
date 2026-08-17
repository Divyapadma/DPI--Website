"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone, X } from "lucide-react";
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
// section. Plain (non-motion) <ul>/<div> wrappers sit between this and the
// individual motion.* rows without breaking propagation, so the whole
// thing cascades in as one continuous sequence rather than several
// independent bursts.
const contentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.2 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const eyebrowClass = "text-[11px] font-semibold uppercase tracking-[0.24em] text-terracotta";

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
            className="fixed inset-0 z-[90] bg-charcoal/35 backdrop-blur-[2px] lg:hidden"
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
            className="fixed inset-y-0 right-0 z-[95] flex w-[88vw] max-w-[420px] flex-col bg-ivory shadow-[-32px_0_70px_-24px_rgba(46,42,38,0.4)] lg:hidden"
          >
            <div className="grain-texture pointer-events-none absolute inset-0 opacity-[0.035]" aria-hidden="true" />
            {/* Soft atmospheric glow, same device used on PageHero/Hero — ties the
                drawer back into the rest of the site's visual language instead
                of reading as a plain flat panel. */}
            <div className="pointer-events-none absolute -top-24 right-[-40px] h-72 w-72 rounded-full bg-terracotta/10 blur-[110px]" aria-hidden="true" />

            {/* Header — logo and close button share one h-11 box so both center
                on the exact same line regardless of the two elements' differing
                font metrics (Playfair Display's line-box vs. the icon's own). */}
            <div className="relative flex shrink-0 items-center justify-between border-b border-line px-6 py-4 sm:px-8">
              <Link href="/" onClick={onClose} className="flex h-11 items-center font-display text-2xl text-charcoal">
                DPI<span className="text-terracotta">.</span>
              </Link>
              <button
                aria-label="Close menu"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-taupe transition-all duration-200 hover:border-terracotta hover:bg-terracotta hover:text-cream active:scale-95"
              >
                <X size={19} />
              </button>
            </div>

            {/* Scrollable middle: nav links + contact + socials */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="relative min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-7 sm:px-8"
            >
              <motion.p variants={rowVariants} className={cn(eyebrowClass, "mb-1")}>
                Menu
              </motion.p>

              <ul>
                {NAV_LINKS.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      variants={rowVariants}
                      className={cn("border-b border-line/70", i === 0 && "border-t")}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="group flex items-center justify-between gap-3 py-2.5"
                      >
                        <span className="flex items-baseline gap-3.5">
                          <span className="font-body text-[10px] tabular-nums text-taupe/50">0{i + 1}</span>
                          <span
                            className={cn(
                              "font-display text-[1.7rem] leading-[0.95] transition-colors sm:text-[1.9rem]",
                              active ? "text-terracotta" : "text-charcoal group-hover:text-terracotta"
                            )}
                          >
                            {link.label}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={18}
                          className={cn(
                            "shrink-0 text-terracotta transition-all duration-300",
                            active
                              ? "translate-x-0 translate-y-0 opacity-100"
                              : "translate-x-1 -translate-y-1 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                          )}
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.p variants={rowVariants} className={cn(eyebrowClass, "mb-4 mt-7")}>
                Get in Touch
              </motion.p>

              <div className="space-y-3.5">
                <motion.div variants={rowVariants} className="flex items-start gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta/10">
                    <MapPin size={16} className="text-terracotta" />
                  </span>
                  <span className="pt-1.5 text-sm leading-relaxed text-taupe">{CONTACT.address}</span>
                </motion.div>
                <motion.a
                  variants={rowVariants}
                  href={CONTACT.phoneHref}
                  className="group flex items-center gap-3.5 text-sm text-taupe transition-colors hover:text-terracotta"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta/10 transition-colors group-hover:bg-terracotta/15">
                    <Phone size={16} className="text-terracotta" />
                  </span>
                  {CONTACT.phone}
                </motion.a>
                <motion.a
                  variants={rowVariants}
                  href={CONTACT.emailHref}
                  className="group flex items-center gap-3.5 text-sm text-taupe transition-colors hover:text-terracotta"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta/10 transition-colors group-hover:bg-terracotta/15">
                    <Mail size={16} className="text-terracotta" />
                  </span>
                  <span className="break-all">{CONTACT.email}</span>
                </motion.a>
              </div>

              <motion.p variants={rowVariants} className={cn(eyebrowClass, "mb-4 mt-7")}>
                Follow Us
              </motion.p>

              <motion.div variants={rowVariants} className="flex gap-2.5">
                {SOCIALS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-cream text-charcoal/70 transition-all duration-200 hover:scale-105 hover:border-terracotta hover:bg-terracotta hover:text-cream hover:shadow-terracotta-glow active:scale-95"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </motion.div>
            </motion.div>

            {/* Hints there's more to scroll, without needing a visible scrollbar —
                harmless/invisible when content already fits (blends into the
                solid ivory below it either way). */}
            <div className="pointer-events-none absolute inset-x-0 bottom-[77px] h-10 bg-gradient-to-t from-ivory to-transparent" />

            {/* Fixed bottom CTA — lifted off the content above with its own
                shadow (a "raised sheet" reads as a deliberate surface, not
                just a flat border cutting the panel in two) and stays put
                regardless of middle-section scroll. */}
            <div className="relative shrink-0 border-t border-line bg-ivory px-6 py-4 shadow-[0_-10px_28px_-16px_rgba(46,42,38,0.18)] sm:px-8">
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
