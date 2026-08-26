"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getLenisInstance } from "@/components/providers/lenis-store";
import { CONTACT, LOGO_URL, NAV_LINKS, SOCIALS } from "./site-info";

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

export default function MobileNavDrawer({
  open,
  onClose,
  onTransitionEnd,
}: {
  open: boolean;
  onClose: () => void;
  // Fires once the panel's own enter/exit animation actually finishes —
  // Navbar uses this to release its rapid-tap lock exactly when it's
  // visually safe to, rather than guessing a fixed delay. See Navbar.tsx
  // for why the lock exists at all: repeated taps landing mid-transition
  // were each individually re-triggering the spring, so a tap arriving
  // ~100ms after the previous one would reverse it before it had gotten
  // even halfway — visually indistinguishable from a broken animation.
  // Confirmed via a frame-by-frame transform trace before writing this
  // fix, not assumed.
  onTransitionEnd?: () => void;
}) {
  const pathname = usePathname();
  const previousOverflowRef = useRef("");
  // Mirrors `open` into a ref, read inside handlePanelAnimationComplete
  // instead of the `open` closed over by that function directly.
  // AnimatePresence keeps the exiting panel's props/closures frozen from
  // the last render *before* React removed it from the tree — which is
  // the render where `open` was still `true` — so `onAnimationComplete`'s
  // own closure over `open` is permanently stale-true for the entire
  // exit animation and never reflects the close. A ref sidesteps this
  // because `.current` always reads the latest write regardless of which
  // stale closure is holding the ref object itself. Confirmed via a
  // console.log inside the handler: it fired with `open=true` logged on
  // *both* the enter-complete and the exit-complete call.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Lock scroll (both native and Lenis's own smooth-scroll input handling —
  // stopping Lenis alone leaves native touch-scroll on iOS untouched, and
  // vice versa) for as long as the drawer is open — but *only* the lock
  // half lives here. The unlock deliberately does not: it used to run as
  // this same effect's cleanup, which fires the instant `open` flips to
  // false — synchronously, on the very same render that starts the exit
  // animation, roughly 350ms before that animation actually finishes
  // playing. Restoring `overflow` and restarting Lenis mid-flight hands
  // scroll compositing back to the page while the panel is still visibly
  // sliding out; iOS Safari in particular re-engages native touch-scroll
  // compositing the moment `overflow` leaves `hidden`, which was fighting
  // the still-running transform animation on the exiting panel — that's
  // the close-only stutter/freeze-then-glitch reported (open never showed
  // it because opening only ever *adds* the lock, with nothing running
  // that could contend with an entrance animation the way an unlock
  // contends with an exit one). The unlock now happens in
  // handlePanelAnimationComplete below, firing only once the exit
  // transition has genuinely finished.
  useEffect(() => {
    if (!open) return;
    previousOverflowRef.current = document.body.style.overflow;
    const lenis = getLenisInstance();
    lenis?.stop();
    document.body.style.overflow = "hidden";
  }, [open]);

  // True-unmount safety net only, empty deps so it's not this effect's
  // per-render cleanup — Navbar (and this) are mounted for the whole
  // app's lifetime in practice, so this never actually fires today, but
  // costs nothing to guard against the drawer somehow being torn down
  // while still `open`, which would otherwise leave the page permanently
  // unscrollable.
  useEffect(() => {
    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, []);

  function handlePanelAnimationComplete() {
    if (!openRef.current) {
      getLenisInstance()?.start();
      document.body.style.overflow = previousOverflowRef.current;
    }
    onTransitionEnd?.();
  }

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
            onAnimationComplete={handlePanelAnimationComplete}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            // Positioning + the outward shadow live here; overflow-hidden
            // moved to the inner wrapper below instead of sitting on this
            // same element, because overflow-hidden clips box-shadow on
            // whichever element it's set on — putting it here would have
            // silently clipped this panel's own "-32px to the left" shadow
            // the moment it also gained overflow-hidden.
            className="fixed inset-y-0 right-0 z-[95] w-[88vw] max-w-[420px] shadow-[-32px_0_70px_-24px_rgba(46,42,38,0.4)] will-change-transform lg:hidden"
          >
            {/* overflow-hidden here (not on the motion.div above) — the glow
                div just below sits at right-[-40px] (deliberately, so it
                bleeds off the panel's own edge rather than looking like a
                bounded shape), which without this was inflating the panel's
                own scrollWidth 40px past its clientWidth (370px vs 330px
                measured at 375px viewport) even though it happened not to
                produce a visible scrollbar. Same fix Footer already uses
                for its own edge-bleeding watermark. */}
            <div className="surface-gradient relative flex h-full w-full flex-col overflow-hidden">
              <div className="grain-texture pointer-events-none absolute inset-0 opacity-[0.035]" aria-hidden="true" />
              {/* Soft atmospheric glow, same device used on PageHero/Hero — ties the
                  drawer back into the rest of the site's visual language instead
                  of reading as a plain flat panel.
                  blur-xl (24px), not the original blur-[110px] — isolated via a
                  binary-search-style test sweep (110/80/60/48/32/24/16px) that
                  this element alone accounted for most of the close-animation
                  delay reported on iOS: WebKit needs real, measurable time to
                  prepare/recompute a filter this large before it can start
                  compositing the panel's own transform animation, and that
                  cost scales with blur radius — 110px measured ~680ms before
                  the exit transform's first visible frame; every value at or
                  below 32px measured ~285-300ms (a hard cliff between 48px and
                  32px, not a smooth gradient). 24px keeps a genuinely soft
                  glow (this element is 288px square) while sitting well past
                  that cliff. */}
              <div className="pointer-events-none absolute -top-24 right-[-40px] h-72 w-72 rounded-full bg-terracotta/10 blur-xl" aria-hidden="true" />

            {/* Header — logo+name only. No close button here (there used to
                be one): it sat at almost the exact same screen position as
                Navbar's own hamburger-turned-X toggle, and since that
                button's own z-index wasn't raised above this panel, this
                one was the only one actually reachable by touch/mouse —
                two controls stacked at one spot, only one of them live.
                Navbar's toggle is now raised above the panel (z-[100] vs
                this panel's z-[95]) specifically so it stays the single,
                unambiguous close affordance in that exact spot, matching
                its own visible X icon and aria-expanded state. Backdrop
                tap and swipe-to-dismiss remain as additional ways to
                close. */}
            <div className="relative flex shrink-0 items-center border-b border-line px-6 py-4 sm:px-8">
              <Link href="/" onClick={onClose} className="flex min-w-0 items-center gap-2.5">
                <Image
                  src={LOGO_URL}
                  alt="DPI"
                  width={293}
                  height={251}
                  // unoptimized — local path, custom loader returns it
                  // unchanged regardless of width (see Navbar.tsx).
                  unoptimized
                  className="h-9 w-auto shrink-0 sm:h-10"
                />
                {/* Two lines echoing the logo's own internal typography
                    (a serif name line over a smaller tracked-caps line)
                    instead of cramming the full name onto one line — at
                    the narrowest drawer width one line of "Divya Padma
                    Infosystem LLP" at a legible size would either wrap
                    awkwardly or force a tiny font; two deliberate lines
                    stay legible and proportionate at every width instead. */}
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="font-display truncate text-[15px] text-charcoal sm:text-base">
                    Divya Padma
                  </span>
                  <span className="truncate text-[9px] font-medium uppercase tracking-[0.16em] text-taupe sm:text-[10px] sm:tracking-[0.2em]">
                    Infosystem LLP
                  </span>
                </span>
              </Link>
            </div>

            {/* Middle: nav links + contact. Compact enough by design to fit
                one screen without scrolling at 375px (verified down to
                375x667, the tightest common viewport) — overflow-y-auto
                stays on only as an accessibility safety net (e.g. a
                visitor with enlarged system text), not because scrolling
                is expected in normal use. Social icons used to live in
                their own section here too; moved into the fixed bottom
                bar below instead, both to save vertical space and because
                "always visible, never needs a scroll to reach" fits icon
                row better than the longer nav/contact list above it. */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="relative min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-4 sm:px-8"
            >
              <motion.p variants={rowVariants} className={eyebrowClass}>
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
                        className="group flex items-center justify-between gap-3 py-1.5"
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="font-body text-[9px] tabular-nums text-taupe/50">0{i + 1}</span>
                          <span
                            className={cn(
                              "font-display text-lg leading-tight transition-colors sm:text-xl",
                              active ? "text-terracotta" : "text-charcoal group-hover:text-terracotta"
                            )}
                          >
                            {link.label}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={15}
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

              <motion.p variants={rowVariants} className={cn(eyebrowClass, "mb-2.5 mt-4")}>
                Get in Touch
              </motion.p>

              <div className="space-y-2">
                <motion.div variants={rowVariants} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta/10">
                    <MapPin size={13} className="text-terracotta" />
                  </span>
                  <span className="pt-1 text-xs leading-relaxed text-taupe">{CONTACT.address}</span>
                </motion.div>
                <motion.a
                  variants={rowVariants}
                  href={CONTACT.phoneHref}
                  className="group flex items-center gap-3 text-xs text-taupe transition-colors hover:text-terracotta"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta/10 transition-colors group-hover:bg-terracotta/15">
                    <Phone size={13} className="text-terracotta" />
                  </span>
                  {CONTACT.phone}
                </motion.a>
                <motion.a
                  variants={rowVariants}
                  href={CONTACT.emailHref}
                  className="group flex items-center gap-3 text-xs text-taupe transition-colors hover:text-terracotta"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta/10 transition-colors group-hover:bg-terracotta/15">
                    <Mail size={13} className="text-terracotta" />
                  </span>
                  <span className="break-all">{CONTACT.email}</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Fixed bottom bar — social icons + CTA, lifted off the content
                above with its own shadow (a "raised sheet" reads as a
                deliberate surface, not just a flat border cutting the
                panel in two) and stays put regardless of middle-section
                scroll. */}
            <div className="relative shrink-0 border-t border-line bg-ivory px-6 py-3.5 shadow-[0_-10px_28px_-16px_rgba(46,42,38,0.18)] sm:px-8">
              <div className="mb-3 flex items-center justify-between">
                <span className={eyebrowClass}>Follow Us</span>
                <div className="flex gap-2">
                  {SOCIALS.map(({ href, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-cream text-charcoal/70 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-terracotta hover:bg-terracotta hover:text-cream active:scale-95"
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
              </div>
              <ButtonLink href="/contact" onClick={onClose} variant="primary" className="w-full">
                Enquire Now
              </ButtonLink>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
