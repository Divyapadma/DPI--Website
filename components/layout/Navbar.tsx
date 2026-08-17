"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./site-info";
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
      className="-mr-2.5 flex h-11 w-11 items-center justify-center text-charcoal lg:hidden"
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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-cream/90 backdrop-blur-sm border-b border-line" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="font-display text-2xl tracking-wide text-charcoal">
          DPI<span className="text-terracotta">.</span>
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
            href="tel:+910000000000"
            className="flex items-center gap-2 rounded-full border border-terracotta/40 px-4 py-2 text-sm text-terracotta transition-colors hover:border-terracotta hover:bg-terracotta/10 xl:px-5"
          >
            <Phone size={15} />
            <span className="hidden xl:inline">Enquire Now</span>
          </a>
        </div>

        <MenuToggle open={open} onClick={() => setOpen((v) => !v)} />
      </nav>

      <MobileNavDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
