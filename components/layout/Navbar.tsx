"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-cream/90 backdrop-blur-md border-b border-line" : "bg-transparent"
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

        <button
          aria-label="Toggle menu"
          className="-mr-2.5 p-2.5 text-charcoal lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-line bg-cream lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block min-h-[44px] py-3 text-sm uppercase tracking-[0.15em] leading-[20px]",
                      pathname === link.href ? "text-terracotta" : "text-taupe"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="tel:+910000000000"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-terracotta/40 px-5 py-3 text-sm text-terracotta sm:w-fit"
                >
                  <Phone size={15} />
                  Enquire Now
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
