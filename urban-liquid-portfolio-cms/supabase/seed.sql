insert into public.site_settings (key, status, value)
values (
  'home',
  'published',
  '{
    "hero": {
      "eyebrow": "Graphic designer / visual artist",
      "headline": "Liquid street systems for visual culture.",
      "subheadline": "A cinematic portfolio shaped from graffiti energy, fashion tension, brutal grids, and reflective digital matter.",
      "ctaLabel": "Enter the work",
      "marquee": ["liquid glass", "street culture", "motion systems", "editorial chaos"]
    },
    "about": {
      "title": "Raw visual identity, refined into systems.",
      "body": "The studio builds campaigns, identities, posters, digital installations, and moving image systems for culture-driven brands.",
      "stats": [
        { "label": "Campaigns", "value": "42" },
        { "label": "Cities", "value": "09" },
        { "label": "Motion sets", "value": "18" }
      ]
    },
    "process": {
      "title": "From street signal to cinematic system.",
      "steps": [
        { "title": "Scan", "body": "Collect visual noise, references, textures, cultural codes, and campaign pressure." },
        { "title": "Distort", "body": "Translate raw material through type, motion, layout, shaders, and sharp composition." },
        { "title": "Deploy", "body": "Ship responsive identities, editorial surfaces, launch assets, and living digital spaces." }
      ]
    },
    "playground": {
      "title": "Experimental playground",
      "body": "A live zone for unreleased motion tests, shader sketches, typographic collisions, and interactive artifacts."
    },
    "skills": ["Art direction", "Brand systems", "Editorial design", "Motion design", "WebGL direction", "Campaign visuals", "Creative coding", "Streetwear graphics"],
    "contact": {
      "email": "studio@example.com",
      "city": "Bogota / Remote",
      "availability": "Open for selected collaborations",
      "socials": [
        { "label": "Instagram", "url": "https://instagram.com" },
        { "label": "Behance", "url": "https://behance.net" }
      ]
    },
    "sections": [
      { "id": "hero", "label": "Hero", "enabled": true, "position": 0 },
      { "id": "about", "label": "About", "enabled": true, "position": 1 },
      { "id": "selectedWork", "label": "Selected Work", "enabled": true, "position": 2 },
      { "id": "process", "label": "Creative Process", "enabled": true, "position": 3 },
      { "id": "playground", "label": "Playground", "enabled": true, "position": 4 },
      { "id": "skills", "label": "Skills", "enabled": true, "position": 5 },
      { "id": "contact", "label": "Contact", "enabled": true, "position": 6 }
    ],
    "featuredProjectIds": [],
    "motion": {
      "enabled": true,
      "intensity": 72,
      "preset": "liquid",
      "transition": "mask"
    },
    "performance": {
      "lazyMedia": true,
      "imageQuality": 82,
      "mobileMotionScale": 64,
      "analyticsEnabled": true,
      "sitemapEnabled": true
    },
    "seo": {
      "title": "Urban Liquid Portfolio",
      "description": "Experimental portfolio for a graphic designer and visual artist with liquid glass and street culture direction.",
      "keywords": ["graphic design", "visual artist", "motion design", "portfolio"]
    }
  }'::jsonb
)
on conflict (key, status) do update set value = excluded.value;

insert into public.site_settings (key, status, value)
select key, 'draft'::public.content_status, value
from public.site_settings
where key = 'home' and status = 'published'
on conflict (key, status) do update set value = excluded.value;

insert into public.projects (
  slug,
  title,
  eyebrow,
  summary,
  description,
  category,
  tags,
  cover_url,
  featured,
  visible,
  status,
  position,
  layout
)
values
  (
    'chrome-yard',
    'Chrome Yard',
    'Identity / Motion',
    'Wet chrome identity system for an underground fashion drop.',
    'A campaign language built from reflective type, street-cast lighting, tactile posters, and short-form motion loops.',
    'Fashion',
    array['identity', 'motion', 'streetwear'],
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80',
    true,
    true,
    'published',
    0,
    '{"variant":"bento-wide","colSpan":2,"rowSpan":1,"accent":"cyan"}'::jsonb
  ),
  (
    'underpass-type',
    'Underpass Type',
    'Editorial / Poster',
    'Graffiti-pressure typography for a music video rollout.',
    'Oversized type, asphalt texture, and aggressive editorial crops for a multi-format campaign.',
    'Music',
    array['poster', 'typography', 'campaign'],
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80',
    false,
    true,
    'published',
    1,
    '{"variant":"poster","colSpan":1,"rowSpan":2,"accent":"acid"}'::jsonb
  ),
  (
    'signal-bloom',
    'Signal Bloom',
    'Interactive / WebGL',
    'Shader-driven digital installation for a pop-up gallery.',
    'A reactive visual environment using glass refraction, bloom, and motion-triggered distortion.',
    'Interactive',
    array['webgl', 'installation', 'shader'],
    'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=80',
    true,
    true,
    'published',
    2,
    '{"variant":"immersive","colSpan":2,"rowSpan":2,"accent":"signal"}'::jsonb
  )
on conflict (slug) do update set
  title = excluded.title,
  eyebrow = excluded.eyebrow,
  summary = excluded.summary,
  description = excluded.description,
  category = excluded.category,
  tags = excluded.tags,
  cover_url = excluded.cover_url,
  featured = excluded.featured,
  visible = excluded.visible,
  status = excluded.status,
  position = excluded.position,
  layout = excluded.layout;

