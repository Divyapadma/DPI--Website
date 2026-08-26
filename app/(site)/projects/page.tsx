import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ProjectsExplorer from "@/components/projects/ProjectsExplorer";
import { getProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse DPI's residential projects by location, price, and construction status.",
};

// Deliberately *not* force-dynamic (this page used to be, along with
// blog/careers) — that forced a live Supabase round-trip on every single
// navigation here, ~200-250ms measured directly against this project's
// own Supabase instance, which was the actual cause of "Projects/Blog
// feel slower than other pages" (confirmed via client-side navigation
// timing: About/Contact, which fetch nothing, land in ~150-300ms;
// Projects/Blog/Careers, all force-dynamic, measured ~400-500ms — almost
// exactly that query latency, consistently, across repeated runs).
// force-dynamic was never actually needed for freshness: every mutation
// that touches this table (lib/mutations.ts createProject/updateProject/
// deleteProject) already calls revalidatePath("/projects") itself, which
// is Next's supported on-demand-ISR pattern — the normal cache serves
// this page instantly until an admin edit invalidates it, at which point
// the next request regenerates it and it's cached again. No change in
// how quickly an edit shows up; a real page-load cost removed for every
// visit in between.
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
