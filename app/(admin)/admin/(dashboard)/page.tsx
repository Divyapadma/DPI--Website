import Link from "next/link";
import { Briefcase, Building2, Newspaper } from "lucide-react";
import { projects, blogPosts, careerListings } from "@/lib/mock-data";

const CARDS = [
  { href: "/admin/projects", label: "Projects", count: projects.length, icon: Building2 },
  { href: "/admin/blog", label: "Blog Posts", count: blogPosts.length, icon: Newspaper },
  { href: "/admin/careers", label: "Career Listings", count: careerListings.length, icon: Briefcase },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ivory">Dashboard</h1>
      <p className="mt-1 text-sm text-mist">Overview of your site content.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {CARDS.map(({ href, label, count, icon: Icon }) => (
          <Link key={href} href={href} className="glass-card rounded-2xl p-6 transition-colors hover:border-gold">
            <Icon className="text-gold" size={22} />
            <p className="font-display mt-4 text-3xl text-ivory">{count}</p>
            <p className="mt-1 text-sm text-mist">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
