# Architecture

## Public Portfolio

The public site is CMS-driven. `app/page.tsx` loads `getPublishedExperience()`, which returns published homepage settings and visible published projects. The experience is rendered by `components/site/SiteExperience.tsx`.

Key pieces:

- `LiquidGlassStage.tsx`: React Three Fiber WebGL hero scene with shader distortion and chrome forms.
- `SiteExperience.tsx`: section renderer, Lenis smooth scrolling, GSAP ScrollTrigger reveal system, cursor layer, analytics beacon.
- `SelectedWork.tsx` and `ProjectCard.tsx`: filterable bento project grid driven by project layout JSON.
- `sitemap.ts`, `robots.ts`, and dynamic page metadata: SEO is editable from the CMS.

## Admin CMS

All private routes live under `app/(admin)/admin`. `middleware.ts` refreshes Supabase auth cookies and blocks unauthenticated admin access. `app/(admin)/admin/layout.tsx` calls `requireAdmin()`, which verifies that the current user has `profiles.role = 'admin'`.

Admin modules:

- `ProjectManager.tsx`: add, edit, delete, publish, hide, pin, reorder, upload, and visually resize project cards.
- `HomeEditor.tsx`: edit hero, about, contact, featured projects, and drag-and-drop homepage section order.
- `LayoutBuilder.tsx`: reusable section ordering and live structure preview.
- `MediaLibrary.tsx`: image/video upload, folder tags, WebP optimization, asset deletion, and copyable URLs.
- `MotionSeoEditor.tsx`: animation presets, intensity, transitions, SEO, analytics, sitemap, and performance controls.
- `AdminShell.tsx`: responsive dashboard navigation and private studio frame.

## Data Model

PostgreSQL tables:

- `profiles`: user role, email, display name.
- `projects`: portfolio items with status, visibility, tags, layout JSON, media JSON, and ordering.
- `site_settings`: JSON documents for draft and published homepage/settings content.
- `media_assets`: uploaded image/video library records.
- `content_versions`: snapshots for version history.
- `page_views`: lightweight visitor statistics.

The app intentionally uses JSON for layout-heavy content:

- Homepage sections are ordered with `HomeContent.sections`.
- Bento/project composition is stored in `Project.layout`.
- Reusable content blocks are typed in `ContentBlock`.
- Media attachments are stored in `Project.media` and `media_assets`.

This keeps the CMS flexible enough for a designer to evolve the site visually without new database migrations for every composition change.

## Security

- Supabase Auth handles email/password login.
- Middleware protects `/admin`.
- `requireAdmin()` protects server-rendered admin pages.
- `getAdminContext()` protects API routes.
- RLS policies allow public reads only for published/visible content.
- Admin-only RLS policies protect inserts, updates, deletes, media writes, and version reads.
- Storage policies allow public reads from `portfolio-media` and admin-only writes.

## Publishing Flow

1. Editors work against draft JSON in `site_settings`.
2. Project saves write draft or published status per project.
3. Homepage/settings publish copies the edited document into the `published` row.
4. Public routes only read published settings and visible published projects.
5. Each save records a `content_versions` snapshot.

## Scaling Path

Recommended next production upgrades:

- Add an invite-only admin user flow.
- Add edge rate limiting to `/admin/login`, `/api/admin/media/upload`, and `/api/analytics`.
- Add signed media support for private drafts if unpublished assets must stay hidden.
- Add project detail pages backed by the same `projects` schema.
- Add a block-level editor for `ContentBlock` arrays if the owner wants full Webflow-style page construction.
- Add audit logs for login and destructive actions.

