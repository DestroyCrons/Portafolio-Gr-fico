"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Pin } from "lucide-react";
import type { Project } from "@/lib/cms/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const colSpan: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3"
};

const accentClass: Record<Project["layout"]["accent"], string> = {
  cyan: "text-cyan border-cyan/40",
  acid: "text-acid border-acid/40",
  violet: "text-violet border-violet/40",
  signal: "text-signal border-signal/40",
  chrome: "text-chrome border-white/24"
};

export function ProjectCard({ project, imageQuality }: { project: Project; imageQuality: number }) {
  return (
    <motion.article
      layout
      whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className={cn(
        "group glass-panel noise-border relative min-h-[360px] overflow-hidden rounded-[8px]",
        colSpan[project.layout.colSpan] ?? "lg:col-span-1"
      )}
      style={{ gridRow: `span ${project.layout.rowSpan}` }}
    >
      <Link href={`/work/${project.slug}`} className="absolute inset-0 z-10" aria-label={`Open ${project.title}`} />
      {project.coverUrl ? (
        <Image
          src={project.coverUrl}
          alt={project.title}
          fill
          quality={imageQuality}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-78 saturate-[1.1] transition duration-700 group-hover:scale-105 group-hover:opacity-96"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,231,255,0.14),rgba(180,255,61,0.10),rgba(255,47,85,0.12))]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/36 to-transparent" />
      <div className="absolute left-4 top-4 flex gap-2">
        <Badge className={accentClass[project.layout.accent]}>{project.category}</Badge>
        {project.featured ? (
          <Badge className="border-acid/40 text-acid">
            <Pin className="mr-1 h-3 w-3" />
            Featured
          </Badge>
        ) : null}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <p className="font-display text-xs uppercase text-white/52">{project.eyebrow}</p>
        <h3 className="mt-2 font-display text-4xl uppercase leading-[0.92] text-white md:text-5xl">
          {project.title}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/72">{project.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-black/24 px-3 py-1 text-[11px] uppercase text-white/58"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {project.externalUrl ? (
        <a
          href={project.externalUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title}`}
          className="focus-ring absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-black/36 text-white backdrop-blur transition hover:border-cyan hover:text-cyan"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : null}
    </motion.article>
  );
}
