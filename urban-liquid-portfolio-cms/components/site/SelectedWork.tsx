"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/cms/types";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/site/ProjectCard";
import { cn } from "@/lib/utils";

export function SelectedWork({ projects, imageQuality }: { projects: Project[]; imageQuality: number }) {
  const [active, setActive] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects]
  );
  const filtered = active === "All" ? projects : projects.filter((project) => project.category === active);

  return (
    <section id="selected-work" className="px-5 py-24 md:px-10 lg:px-16">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge>Selected Work</Badge>
          <h2 className="mt-5 font-display text-6xl uppercase leading-[0.88] text-white md:text-8xl">
            Street-shaped systems
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={cn(
                "focus-ring rounded-full border px-4 py-2 text-xs font-semibold uppercase transition",
                active === category
                  ? "border-acid bg-acid text-black"
                  : "border-white/12 bg-white/8 text-white/58 hover:border-cyan hover:text-cyan"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <motion.div layout className="grid auto-rows-[180px] gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} imageQuality={imageQuality} />
        ))}
      </motion.div>
    </section>
  );
}
