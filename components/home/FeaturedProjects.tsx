import { projects } from "@/lib/mock-data";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "@/components/projects/ProjectCard";
import TiltCard from "@/components/ui/TiltCard";
import { BentoGrid, BentoItem } from "@/components/ui/BentoGrid";
import { ButtonLink } from "@/components/ui/Button";

// Bento span pattern for however many featured projects exist: the first
// item gets a big 2x2 footprint, everything after fills single cells.
const SPAN = (i: number) => (i === 0 ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-1 lg:row-span-1");

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

      <BentoGrid className="mt-10 sm:mt-14">
        {featured.map((project, i) => (
          <BentoItem key={project.id} span={SPAN(i)}>
            <ScrollReveal delay={i * 0.1} className="h-full">
              <TiltCard className="h-full">
                <ProjectCard project={project} imageHeight={i === 0 ? "h-72 sm:h-80 lg:h-96" : "h-56"} />
              </TiltCard>
            </ScrollReveal>
          </BentoItem>
        ))}
      </BentoGrid>

      <div className="mt-10 flex justify-center sm:mt-14">
        <ButtonLink href="/projects" variant="outline" className="w-full sm:w-auto">
          View All Projects
        </ButtonLink>
      </div>
    </section>
  );
}
