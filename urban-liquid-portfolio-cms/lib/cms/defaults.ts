import type { HomeContent, PortfolioExperience, Project } from "@/lib/cms/types";

export const defaultHomeContent: HomeContent = {
  hero: {
    eyebrow: "Graphic designer / visual artist",
    headline: "Liquid street systems for visual culture.",
    subheadline:
      "A cinematic portfolio shaped from graffiti energy, fashion tension, brutal grids, and reflective digital matter.",
    ctaLabel: "Enter the work",
    marquee: ["liquid glass", "street culture", "motion systems", "editorial chaos"]
  },
  about: {
    title: "Raw visual identity, refined into systems.",
    body:
      "The studio builds campaigns, identities, posters, digital installations, and moving image systems for culture-driven brands.",
    stats: [
      { label: "Campaigns", value: "42" },
      { label: "Cities", value: "09" },
      { label: "Motion sets", value: "18" }
    ]
  },
  process: {
    title: "From street signal to cinematic system.",
    steps: [
      {
        title: "Scan",
        body: "Collect visual noise, references, textures, cultural codes, and campaign pressure."
      },
      {
        title: "Distort",
        body: "Translate raw material through type, motion, layout, shaders, and sharp composition."
      },
      {
        title: "Deploy",
        body: "Ship responsive identities, editorial surfaces, launch assets, and living digital spaces."
      }
    ]
  },
  playground: {
    title: "Experimental playground",
    body:
      "A live zone for unreleased motion tests, shader sketches, typographic collisions, and interactive artifacts."
  },
  skills: [
    "Art direction",
    "Brand systems",
    "Editorial design",
    "Motion design",
    "WebGL direction",
    "Campaign visuals",
    "Creative coding",
    "Streetwear graphics"
  ],
  contact: {
    email: "studio@example.com",
    city: "Bogota / Remote",
    availability: "Open for selected collaborations",
    socials: [
      { label: "Instagram", url: "https://instagram.com" },
      { label: "Behance", url: "https://behance.net" }
    ]
  },
  sections: [
    { id: "hero", label: "Hero", enabled: true, position: 0 },
    { id: "about", label: "About", enabled: true, position: 1 },
    { id: "selectedWork", label: "Selected Work", enabled: true, position: 2 },
    { id: "process", label: "Creative Process", enabled: true, position: 3 },
    { id: "playground", label: "Playground", enabled: true, position: 4 },
    { id: "skills", label: "Skills", enabled: true, position: 5 },
    { id: "contact", label: "Contact", enabled: true, position: 6 }
  ],
  featuredProjectIds: [],
  motion: {
    enabled: true,
    intensity: 72,
    preset: "liquid",
    transition: "mask"
  },
  performance: {
    lazyMedia: true,
    imageQuality: 82,
    mobileMotionScale: 64,
    analyticsEnabled: true,
    sitemapEnabled: true
  },
  seo: {
    title: "Urban Liquid Portfolio",
    description:
      "Experimental portfolio for a graphic designer and visual artist with liquid glass and street culture direction.",
    keywords: ["graphic design", "visual artist", "motion design", "portfolio"]
  }
};

export const defaultProjects: Project[] = [
  {
    id: "sample-a",
    slug: "chrome-yard",
    title: "Chrome Yard",
    eyebrow: "Identity / Motion",
    summary: "Wet chrome identity system for an underground fashion drop.",
    description:
      "A campaign language built from reflective type, street-cast lighting, tactile posters, and short-form motion loops.",
    category: "Fashion",
    tags: ["identity", "motion", "streetwear"],
    coverUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80",
    featured: true,
    visible: true,
    status: "published",
    position: 0,
    layout: {
      variant: "bento-wide",
      colSpan: 2,
      rowSpan: 1,
      accent: "cyan"
    },
    media: []
  },
  {
    id: "sample-b",
    slug: "underpass-type",
    title: "Underpass Type",
    eyebrow: "Editorial / Poster",
    summary: "Graffiti-pressure typography for a music video rollout.",
    description:
      "Oversized type, asphalt texture, and aggressive editorial crops for a multi-format campaign.",
    category: "Music",
    tags: ["poster", "typography", "campaign"],
    coverUrl:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80",
    featured: false,
    visible: true,
    status: "published",
    position: 1,
    layout: {
      variant: "poster",
      colSpan: 1,
      rowSpan: 2,
      accent: "acid"
    },
    media: []
  },
  {
    id: "sample-c",
    slug: "signal-bloom",
    title: "Signal Bloom",
    eyebrow: "Interactive / WebGL",
    summary: "Shader-driven digital installation for a pop-up gallery.",
    description:
      "A reactive visual environment using glass refraction, bloom, and motion-triggered distortion.",
    category: "Interactive",
    tags: ["webgl", "installation", "shader"],
    coverUrl:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=80",
    featured: true,
    visible: true,
    status: "published",
    position: 2,
    layout: {
      variant: "immersive",
      colSpan: 2,
      rowSpan: 2,
      accent: "signal"
    },
    media: []
  }
];

export const defaultExperience: PortfolioExperience = {
  home: defaultHomeContent,
  projects: defaultProjects
};
