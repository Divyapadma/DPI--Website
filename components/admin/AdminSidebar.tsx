"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, LayoutDashboard, Newspaper, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/blog", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-line bg-surface px-5 py-6">
      <Link href="/admin" className="font-display px-2 text-xl text-ivory">
        DPI<span className="text-gold">.</span> Admin
      </Link>

      <nav className="mt-10 flex-1 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-gold/10 text-gold" : "text-mist hover:bg-surface-2 hover:text-ivory"
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
  );
}
