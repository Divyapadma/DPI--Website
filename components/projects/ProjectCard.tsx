import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/lib/types";
import { formatINR } from "@/lib/utils";

const STATUS_LABEL: Record<Project["status"], string> = {
  upcoming: "Upcoming",
  ongoing: "Under Construction",
  completed: "Completed",
  "ready-to-move": "Ready to Move",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="glass-card group relative block overflow-hidden rounded-2xl transition-all duration-500"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-gold/40 bg-ink/70 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-gold">
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl text-ivory">{project.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-mist">
              <MapPin size={14} className="text-gold" />
              {project.location.area}, {project.location.city}
            </p>
          </div>
          <ArrowUpRight
            size={20}
            className="mt-1 shrink-0 text-gold opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>

        <div className="divider-gold my-4 opacity-30" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-mist">{project.configuration}</span>
          <span className="font-display text-gold">
            {formatINR(project.priceFromLakhs)}
            {project.priceToLakhs ? ` – ${formatINR(project.priceToLakhs)}` : "+"}
          </span>
        </div>
      </div>
    </Link>
  );
}
