import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  title: z.string().min(2),
  eyebrow: z.string().min(2),
  summary: z.string().min(8),
  description: z.string().min(12),
  category: z.string().min(2),
  tags: z.array(z.string()).default([]),
  coverUrl: z.string().url().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),
  externalUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  position: z.coerce.number().int().default(0),
  layout: z.object({
    variant: z.enum(["bento-wide", "bento-tall", "poster", "split", "immersive"]),
    colSpan: z.coerce.number().min(1).max(3),
    rowSpan: z.coerce.number().min(1).max(3),
    accent: z.enum(["cyan", "acid", "violet", "signal", "chrome"])
  }),
  media: z.array(z.unknown()).default([])
});

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: z.string().min(2),
    headline: z.string().min(6),
    subheadline: z.string().min(12),
    ctaLabel: z.string().min(2),
    marquee: z.array(z.string()).default([])
  }),
  about: z.object({
    title: z.string().min(4),
    body: z.string().min(12),
    stats: z.array(z.object({ label: z.string(), value: z.string() })).default([])
  }),
  process: z.object({
    title: z.string().min(4),
    steps: z.array(z.object({ title: z.string(), body: z.string() })).default([])
  }),
  playground: z.object({
    title: z.string().min(4),
    body: z.string().min(12)
  }),
  skills: z.array(z.string()).default([]),
  contact: z.object({
    email: z.string().email(),
    city: z.string(),
    availability: z.string(),
    socials: z.array(z.object({ label: z.string(), url: z.string().url() })).default([])
  }),
  sections: z.array(
    z.object({
      id: z.enum(["hero", "about", "selectedWork", "process", "playground", "skills", "contact"]),
      label: z.string(),
      enabled: z.boolean(),
      position: z.number()
    })
  ),
  featuredProjectIds: z.array(z.string()).default([]),
  motion: z.object({
    enabled: z.boolean(),
    intensity: z.number().min(0).max(100),
    preset: z.enum(["liquid", "glitch", "cinematic", "minimal"]),
    transition: z.enum(["slide", "fade", "mask", "glitch"])
  }),
  performance: z.object({
    lazyMedia: z.boolean(),
    imageQuality: z.number().min(40).max(100),
    mobileMotionScale: z.number().min(0).max(100),
    analyticsEnabled: z.boolean(),
    sitemapEnabled: z.boolean()
  }),
  seo: z.object({
    title: z.string().min(2),
    description: z.string().min(8),
    keywords: z.array(z.string()).default([]),
    image: z.string().optional()
  })
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type HomeInput = z.infer<typeof homeSchema>;
