"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT, LOGO_URL, NAV_LINKS } from "./site-info";
import MobileNavDrawer from "./MobileNavDrawer";

const hamburgerLine = "block h-[1.5px] w-full origin-center rounded-full bg-current";

/** Hamburger that morphs into an × — three lines rotating/collapsing into
 * place instead of a hard icon swap. */
function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onClick}
      // z-[100] — above the drawer panel's z-[95] (MobileNavDrawer.tsx) —
      // so this exact button stays the one reachable, always-on-top close
      // affordance while the drawer is open, instead of being visually
      // covered by the panel sliding in on top of it (confirmed via
      // elementFromPoint that it previously was, with only the drawer's
      // own now-removed close button actually receiving the tap at this
      // screen position).
      className="relative z-[100] -mr-2.5 flex h-11 w-11 items-center justify-center text-charcoal lg:hidden"
    >
      <span className="relative flex h-[13px] w-6 flex-col justify-between">
        <motion.span
          className={hamburgerLine}
          animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
        />
        <motion.span
          className={hamburgerLine}
          animate={open ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className={hamburgerLine}
          animate={open ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
        />
      </span>
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  // Guards against the drawer's open/close spring being re-triggered
  // mid-flight by a rapid second tap — confirmed via a frame-by-frame
  // transform trace that without this, a tap landing ~100ms into the
  // opening animation visibly reverses it before it's even halfway open,
  // which is what read as "glitching" (worse on iOS: WebKit's
  // backdrop-filter + transform compositing is already more expensive
  // per frame, so an interrupted/reversed spring has more visible
  // stutter to begin with). True for exactly as long as the drawer's own
  // enter/exit animation is actually running — released by
  // MobileNavDrawer's onAnimationComplete callback below, not a guessed
  // timeout, so it can never fall out of sync with the real animation
  // duration.
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the drawer's open state in sync with the route (covers the browser
  // back/forward buttons, not just in-drawer link clicks which already
  // close it themselves via onClose). Adjusted synchronously during render
  // rather than in an effect, per React's "adjusting state when a prop
  // changes" pattern — avoids an extra post-commit render pass.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Every path that changes `open` — the toggle button, backdrop tap,
  // in-drawer nav link clicks, the CTA button — funnels through here, so
  // the lock genuinely covers all of them, not just the toggle button.
  function requestOpen(next: boolean) {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setOpen(next);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-cream/90 backdrop-blur-sm border-b border-line" : "bg-transparent"
      )}
    >
      {/* Header height = py*2 + logo height (logo is the tallest row item).
          Solved deliberately so logo/header lands at 66-68% at every
          breakpoint, measured after the fact via getBoundingClientRect
          (not assumed): 76px header / 52px logo = 68.4% (mobile),
          88px / 60px = 68.2% (sm), 96px / 64px = 66.7% (lg). Previous
          rounds sized the <img> box correctly but the source logo file
          itself only used ~42% of its own canvas height for actual ink
          (see site-info.ts) — no box-size increase fixes that; the
          cropped LOGO_URL asset is what makes this percentage real
          rather than nominal. */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6 sm:py-3.5 lg:px-10 lg:py-4">
        <Link href="/" className="shrink-0">
          <Image
            src={LOGO_URL}
            alt="DPI — Divya Padma Infosystem LLP"
            width={293}
            height={251}
            priority
            // unoptimized — LOGO_URL is a local path, and the custom
            // ImageKit loader (lib/imagekit-loader.ts) intentionally
            // returns it unchanged regardless of width (nothing to
            // transform for a local file). Without this, Next's dev mode
            // logs a warning that the loader "doesn't implement width"
            // since it can't tell that's deliberate.
            unoptimized
            className="h-[52px] w-auto sm:h-[60px] lg:h-[64px]"
          />
        </Link>

        <ul className="hidden items-center gap-5 lg:flex xl:gap-9">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-active={active}
                  className={cn(
                    "underline-grow text-sm uppercase tracking-[0.1em] transition-colors hover:text-terracotta xl:tracking-[0.15em]",
                    active ? "text-terracotta" : "text-taupe"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-2 rounded-full border border-terracotta/40 px-4 py-2 text-sm text-terracotta transition-colors hover:border-terracotta hover:bg-terracotta/10 xl:px-5"
          >
            <Phone size={15} />
            <span className="hidden xl:inline">Enquire Now</span>
          </a>
        </div>

        <MenuToggle open={open} onClick={() => requestOpen(!open)} />
      </nav>

      <MobileNavDrawer
        open={open}
        onClose={() => requestOpen(false)}
        onTransitionEnd={() => setIsTransitioning(false)}
      />
    </header>
  );
}
