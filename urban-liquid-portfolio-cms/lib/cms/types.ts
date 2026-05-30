export type ContentStatus = "draft" | "published" | "archived";

export type SectionKey =
  | "hero"
  | "about"
  | "selectedWork"
  | "process"
  | "playground"
  | "skills"
  | "contact";

export type MotionPreset = "liquid" | "glitch" | "cinematic" | "minimal";

export type ProjectLayoutVariant =
  | "bento-wide"
  | "bento-tall"
  | "poster"
  | "split"
  | "immersive";

export type MediaAsset = {
  id: string;
  type: "image" | "video";
  url: string;
  alt: string;
  storagePath?: string;
  width?: number;
  height?: number;
  duration?: number;
  tags?: string[];
};

export type ContentBlock =
  | {
      id: string;
      type: "text";
      label: string;
      body: string;
      tone?: "quiet" | "loud" | "raw";
    }
  | {
      id: string;
      type: "media";
      label: string;
      asset: MediaAsset;
      crop?: "wide" | "square" | "portrait";
    }
  | {
      id: string;
      type: "stat";
      label: string;
      value: string;
      caption: string;
    }
  | {
      id: string;
      type: "quote";
      body: string;
      credit?: string;
    };

export type SectionConfig = {
  id: SectionKey;
  label: string;
  enabled: boolean;
  position: number;
  blocks?: ContentBlock[];
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    ctaLabel: string;
    marquee: string[];
  };
  about: {
    title: string;
    body: string;
    stats: Array<{ label: string; value: string }>;
  };
  process: {
    title: string;
    steps: Array<{ title: string; body: string }>;
  };
  playground: {
    title: string;
    body: string;
  };
  skills: string[];
  contact: {
    email: string;
    city: string;
    availability: string;
    socials: Array<{ label: string; url: string }>;
  };
  sections: SectionConfig[];
  featuredProjectIds: string[];
  motion: {
    enabled: boolean;
    intensity: number;
    preset: MotionPreset;
    transition: "slide" | "fade" | "mask" | "glitch";
  };
  performance: {
    lazyMedia: boolean;
    imageQuality: number;
    mobileMotionScale: number;
    analyticsEnabled: boolean;
    sitemapEnabled: boolean;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    image?: string;
  };
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  category: string;
  tags: string[];
  coverUrl: string;
  videoUrl?: string;
  externalUrl?: string;
  featured: boolean;
  visible: boolean;
  status: ContentStatus;
  position: number;
  layout: {
    variant: ProjectLayoutVariant;
    colSpan: number;
    rowSpan: number;
    accent: "cyan" | "acid" | "violet" | "signal" | "chrome";
  };
  media: MediaAsset[];
  createdAt?: string;
  updatedAt?: string;
};

export type PortfolioExperience = {
  home: HomeContent;
  projects: Project[];
};

export type AdminProfile = {
  id: string;
  email?: string;
  display_name?: string;
  role: "admin" | "viewer";
};
