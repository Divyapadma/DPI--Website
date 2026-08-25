import Link from "next/link";
import { Briefcase, Building2, MessageSquare, Newspaper } from "lucide-react";
import { getBlogPosts, getCareerListings, getLeads, getProjects } from "@/lib/queries";

export default async function AdminDashboardPage() {
  const [projects, blogPosts, careerListings, leads] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getCareerListings(),
    getLeads(),
  ]);

  const cards = [
    { href: "/admin/projects", label: "Projects", count: projects.length, icon: Building2 },
    { href: "/admin/blog", label: "Blog Posts", count: blogPosts.length, icon: Newspaper },
    { href: "/admin/careers", label: "Career Listings", count: careerListings.length, icon: Briefcase },
    { href: "/admin/leads", label: "Leads", count: leads.length, icon: MessageSquare },
  ];

  return (
    <div>
      <h1 className="font-display text-xl text-charcoal sm:text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-taupe">Overview of your site content.</p>

      <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {cards.map(({ href, label, count, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="glass-card rounded-2xl p-6 transition-colors hover:border-terracotta active:border-terracotta"
          >
            <Icon className="text-terracotta" size={22} />
            <p className="font-display mt-4 text-3xl text-charcoal">{count}</p>
            <p className="mt-1 text-sm text-taupe">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
