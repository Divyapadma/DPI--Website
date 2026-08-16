import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ProjectsExplorer from "@/components/projects/ProjectsExplorer";
import { projects } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse DPI's residential projects by location, price, and construction status.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Portfolio"
        title="Find Your Next Address"
        description="Filter by location, budget, and construction status to explore our current and upcoming developments."
      />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <ProjectsExplorer projects={projects} />
      </section>
    </>
  );
}
