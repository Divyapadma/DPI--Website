"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Project, ProjectStatus } from "@/lib/types";
import ProjectCard from "@/components/projects/ProjectCard";

const STATUS_OPTIONS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Under Construction" },
  { value: "ready-to-move", label: "Ready to Move" },
  { value: "completed", label: "Completed" },
];

export default function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [maxBudget, setMaxBudget] = useState("all");

  const cities = useMemo(
    () => Array.from(new Set(projects.map((p) => p.location.city))).sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (city !== "all" && p.location.city !== city) return false;
      if (status !== "all" && p.status !== status) return false;
      if (maxBudget !== "all" && p.priceFromLakhs > Number(maxBudget)) return false;
      return true;
    });
  }, [projects, city, status, maxBudget]);

  const selectClass =
    "rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-ivory outline-none transition-colors focus:border-gold";

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
          <option value="all">All Locations</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus | "all")}
          className={selectClass}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className={selectClass}>
          <option value="all">Any Budget</option>
          <option value="75">Up to ₹75 L</option>
          <option value="150">Up to ₹1.5 Cr</option>
          <option value="300">Up to ₹3 Cr</option>
        </select>
      </div>

      <p className="mt-6 text-sm text-mist">
        Showing {filtered.length} of {projects.length} projects
      </p>

      <motion.div layout className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-mist">No projects match the selected filters.</p>
      )}
    </div>
  );
}
