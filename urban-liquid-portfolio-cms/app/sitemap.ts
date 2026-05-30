import type { MetadataRoute } from "next";
import { getPublishedExperience } from "@/lib/cms/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { home, projects } = await getPublishedExperience();

  if (!home.performance.sitemapEnabled) return [];

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6
    }))
  ];
}
