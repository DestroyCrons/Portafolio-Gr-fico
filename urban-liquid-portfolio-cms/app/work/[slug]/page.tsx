import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/lib/cms/queries";

type ProjectPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.coverUrl ? [project.coverUrl] : undefined
    }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="min-h-screen px-5 py-8 md:px-10 lg:px-16">
      <Link
        href="/"
        className="focus-ring inline-flex h-11 items-center gap-2 rounded-[8px] border border-white/12 bg-white/8 px-4 text-sm font-semibold uppercase text-white/68 transition hover:border-cyan hover:text-cyan"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>
      <section className="grid min-h-[80vh] gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <Badge>{project.category}</Badge>
          <h1 className="mt-6 font-display text-[clamp(4rem,12vw,11rem)] uppercase leading-[0.78] text-chrome">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-white/72">{project.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs uppercase text-white/54"
              >
                {tag}
              </span>
            ))}
          </div>
          {project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-8 inline-flex h-12 items-center gap-2 rounded-[8px] border border-acid/50 bg-acid px-5 text-sm font-semibold uppercase text-black transition hover:bg-cyan"
            >
              Visit Project
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>
        <div className="glass-panel noise-border relative min-h-[520px] overflow-hidden rounded-[8px]">
          {project.videoUrl ? (
            <video src={project.videoUrl} className="h-full w-full object-cover" autoPlay muted loop playsInline />
          ) : project.coverUrl ? (
            <Image src={project.coverUrl} alt={project.title} fill priority className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,231,255,0.16),rgba(180,255,61,0.12),rgba(255,47,85,0.16))]" />
          )}
        </div>
      </section>
      <section className="grid gap-8 border-t border-white/10 py-12 lg:grid-cols-[0.7fr_1.3fr]">
        <p className="font-display text-3xl uppercase text-cyan">{project.eyebrow}</p>
        <p className="max-w-4xl text-2xl leading-10 text-white/76">{project.description}</p>
      </section>
    </main>
  );
}

