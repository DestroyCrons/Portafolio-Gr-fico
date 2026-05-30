import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { defaultExperience, defaultHomeContent, defaultProjects } from "@/lib/cms/defaults";
import type { HomeContent, MediaAsset, PortfolioExperience, Project } from "@/lib/cms/types";
import { safeJson } from "@/lib/utils";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string | null;
  summary: string | null;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  cover_url: string | null;
  video_url: string | null;
  external_url: string | null;
  featured: boolean | null;
  visible: boolean | null;
  status: "draft" | "published" | "archived";
  position: number | null;
  layout: unknown;
  media: unknown;
  created_at: string;
  updated_at: string;
};

type SiteSettingsRow = {
  value: unknown;
};

type MediaAssetRow = {
  id: string;
  type: "image" | "video";
  url: string;
  alt: string | null;
  storage_path: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  tags: string[] | null;
};

type ContentVersionRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
  profiles?: {
    display_name: string | null;
    email: string | null;
  } | null;
};

function mergeHomeContent(value: unknown): HomeContent {
  const incoming = safeJson<Partial<HomeContent>>(value, {});

  return {
    ...defaultHomeContent,
    ...incoming,
    hero: { ...defaultHomeContent.hero, ...incoming.hero },
    about: { ...defaultHomeContent.about, ...incoming.about },
    process: { ...defaultHomeContent.process, ...incoming.process },
    playground: { ...defaultHomeContent.playground, ...incoming.playground },
    contact: { ...defaultHomeContent.contact, ...incoming.contact },
    motion: { ...defaultHomeContent.motion, ...incoming.motion },
    performance: { ...defaultHomeContent.performance, ...incoming.performance },
    seo: { ...defaultHomeContent.seo, ...incoming.seo },
    sections: incoming.sections ?? defaultHomeContent.sections,
    skills: incoming.skills ?? defaultHomeContent.skills,
    featuredProjectIds: incoming.featuredProjectIds ?? defaultHomeContent.featuredProjectIds
  };
}

export function mapProjectRow(row: ProjectRow): Project {
  const fallbackLayout: Project["layout"] = {
    variant: "bento-wide",
    colSpan: 1,
    rowSpan: 1,
    accent: "cyan"
  };

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    eyebrow: row.eyebrow ?? "",
    summary: row.summary ?? "",
    description: row.description ?? "",
    category: row.category ?? "Uncategorized",
    tags: row.tags ?? [],
    coverUrl: row.cover_url ?? "",
    videoUrl: row.video_url ?? undefined,
    externalUrl: row.external_url ?? undefined,
    featured: Boolean(row.featured),
    visible: row.visible ?? true,
    status: row.status,
    position: row.position ?? 0,
    layout: safeJson(row.layout, fallbackLayout),
    media: safeJson(row.media, []),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getPublishedExperience(): Promise<PortfolioExperience> {
  const supabase = await createClient();
  if (!supabase) return defaultExperience;

  const [homeResult, projectResult] = await Promise.all([
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "home")
      .eq("status", "published")
      .maybeSingle(),
    supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .eq("visible", true)
      .order("position", { ascending: true })
  ]);

  const homeRow = homeResult.data as SiteSettingsRow | null;

  return {
    home: mergeHomeContent(homeRow?.value),
    projects: projectResult.data?.map((row) => mapProjectRow(row as ProjectRow)) ?? defaultProjects
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const experience = await getPublishedExperience();
  return experience.projects;
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  if (!supabase) {
    return defaultProjects.find((project) => project.slug === slug) ?? null;
  }

  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("visible", true)
    .maybeSingle();

  return data ? mapProjectRow(data as ProjectRow) : null;
}

export async function getAdminProjects(): Promise<Project[]> {
  noStore();
  const supabase = await createClient();
  if (!supabase) return defaultProjects;

  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("position", { ascending: true });

  return data?.map((row) => mapProjectRow(row as ProjectRow)) ?? [];
}

export async function getDraftHome(): Promise<HomeContent> {
  noStore();
  const supabase = await createClient();
  if (!supabase) return defaultHomeContent;

  const { data: draft } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "home")
    .eq("status", "draft")
    .maybeSingle();

  const draftRow = draft as SiteSettingsRow | null;
  if (draftRow?.value) return mergeHomeContent(draftRow.value);

  const { data: published } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "home")
    .eq("status", "published")
    .maybeSingle();

  const publishedRow = published as SiteSettingsRow | null;

  return mergeHomeContent(publishedRow?.value);
}

export async function getAdminStats() {
  noStore();
  const supabase = await createClient();
  if (!supabase) {
    return {
      projectCount: defaultProjects.length,
      draftCount: 0,
      mediaCount: 0,
      pageViews: 0
    };
  }

  const [projects, drafts, media, views] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("media_assets").select("id", { count: "exact", head: true }),
    supabase.from("page_views").select("id", { count: "exact", head: true })
  ]);

  return {
    projectCount: projects.count ?? 0,
    draftCount: drafts.count ?? 0,
    mediaCount: media.count ?? 0,
    pageViews: views.count ?? 0
  };
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  noStore();
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("media_assets")
    .select("id,type,url,alt,storage_path,width,height,duration,tags")
    .order("created_at", { ascending: false });

  return (
    data?.map((row) => {
      const asset = row as MediaAssetRow;
      return {
        id: asset.id,
        type: asset.type,
        url: asset.url,
        alt: asset.alt ?? "",
        storagePath: asset.storage_path ?? undefined,
        width: asset.width ?? undefined,
        height: asset.height ?? undefined,
        duration: asset.duration ?? undefined,
        tags: asset.tags ?? []
      };
    }) ?? []
  );
}

export async function getContentVersions() {
  noStore();
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("content_versions")
    .select("id,entity_type,entity_id,created_at,profiles:created_by(display_name,email)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    data?.map((row) => {
      const version = row as ContentVersionRow;
      return {
        id: version.id,
        entityType: version.entity_type,
        entityId: version.entity_id,
        createdAt: version.created_at,
        author: version.profiles?.display_name ?? version.profiles?.email ?? "Admin"
      };
    }) ?? []
  );
}
