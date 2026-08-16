"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, LayoutDashboard, Menu, Newspaper, Building2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/blog", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
];

// Renders as a fragment of siblings (not wrapped in a div) so the parent
// layout's `lg:flex` row picks up exactly the pieces it needs at each size:
// below `lg` these stack as normal block content (topbar, then an
// off-canvas drawer that's `fixed` and out of flow, then the page content);
// at `lg`+ the topbar/backdrop disappear and the <aside> becomes a static
// flex item alongside the content column.
export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile / tablet top bar */}
      <div className="flex items-center justify-between border-b border-line bg-ivory px-5 py-4 lg:hidden">
        <Link href="/admin" className="font-display text-lg text-charcoal">
          DPI<span className="text-terracotta">.</span> Admin
        </Link>
        <button
          aria-label="Open admin menu"
          className="-mr-2.5 p-2.5 text-charcoal"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Backdrop for the mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-line bg-ivory px-5 py-6 transition-transform duration-300 ease-in-out",
          "lg:static lg:z-auto lg:h-full lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/admin" className="font-display px-2 text-xl text-charcoal">
            DPI<span className="text-terracotta">.</span> Admin
          </Link>
          <button
            aria-label="Close admin menu"
            className="p-1.5 text-taupe lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-10 flex-1 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-terracotta/10 text-terracotta" : "text-taupe hover:bg-paper hover:text-charcoal"
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        <LogoutButton />
      </aside>
    </>
  );
}
