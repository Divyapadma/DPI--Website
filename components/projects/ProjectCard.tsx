import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import RevealImage from "@/components/ui/RevealImage";

const STATUS_LABEL: Record<Project["status"], string> = {
  upcoming: "Upcoming",
  ongoing: "Under Construction",
  completed: "Completed",
  "ready-to-move": "Ready to Move",
};

export default function ProjectCard({ project, imageHeight = "h-64" }: { project: Project; imageHeight?: string }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-500"
    >
      <div className="relative">
        <RevealImage
          src={project.heroImage}
          alt={project.title}
          fill
          wrapperClassName={`${imageHeight} w-full`}
          className="object-cover transition-transform duration-700 group-hover:scale-110 group-active:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream via-cream/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-terracotta/40 bg-cream/70 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-terracotta">
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display truncate text-xl text-charcoal">{project.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-taupe">
              <MapPin size={14} className="text-terracotta" />
              {project.location.area}, {project.location.city}
            </p>
          </div>
          <ArrowUpRight
            size={20}
            className="mt-1 shrink-0 text-terracotta opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100"
          />
        </div>

        <div className="divider-terracotta my-4 opacity-30" />

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
          <span className="text-taupe">{project.configuration}</span>
          <span className="font-display text-terracotta">
            {formatINR(project.priceFromLakhs)}
            {project.priceToLakhs ? ` – ${formatINR(project.priceToLakhs)}` : "+"}
          </span>
        </div>
      </div>
    </Link>
  );
}
