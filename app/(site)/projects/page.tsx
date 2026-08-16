import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ProjectsExplorer from "@/components/projects/ProjectsExplorer";
import { getProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse DPI's residential projects by location, price, and construction status.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="Our Portfolio"
        title="Find Your Next Address"
        description="Filter by location, budget, and construction status to explore our current and upcoming developments."
      />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <ProjectsExplorer projects={projects} />
      </section>
    </>
  );
}
