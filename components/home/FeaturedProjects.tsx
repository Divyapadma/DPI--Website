import { projects } from "@/lib/mock-data";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";

export default function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
      <ScrollReveal>
        <SectionHeading
          eyebrow="Our Portfolio"
          title="Featured Projects"
          description="A selection of landmark developments across our active markets."
        />
      </ScrollReveal>

      <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project, i) => (
          <ScrollReveal key={project.id} delay={i * 0.1}>
            <ProjectCard project={project} />
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-10 flex justify-center sm:mt-14">
        <ButtonLink href="/projects" variant="outline" className="w-full sm:w-auto">
          View All Projects
        </ButtonLink>
      </div>
    </section>
  );
}
