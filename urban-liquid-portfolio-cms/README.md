# Urban Liquid Portfolio CMS

Production-oriented Next.js App Router scaffold for an experimental graphic design portfolio with a private Supabase CMS.

## What Is Included

- Public portfolio with liquid glass art direction, WebGL hero, GSAP reveal motion, Lenis smooth scroll, bento project grid, SEO metadata, sitemap, robots, and analytics beacon.
- Private `/admin` studio with Supabase email/password auth, role-based admin access, responsive frosted-glass dashboard, project manager, homepage builder, media library, draft preview, motion controls, SEO controls, performance settings, analytics stats, autosave, undo/redo hooks, and version history.
- PostgreSQL schema with RLS policies for public published content, admin-only editing, media storage, visitor stats, and content snapshots.
- Supabase Storage upload route with image resizing and WebP conversion through `sharp`.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

- Public portfolio: `http://localhost:3000`
- Admin CMS: `http://localhost:3000/admin/login`

## Supabase Setup

1. Create a Supabase project.
2. Add the values to `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_ADMIN_EMAIL=owner@example.com
```

3. Apply the migration:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Then run `supabase/seed.sql` in the Supabase SQL editor, or apply it with your preferred Postgres client.

4. Create the owner user in Supabase Auth, then promote that user:

```sql
update public.profiles
set role = 'admin'
where email = 'owner@example.com';
```

## Main Routes

- `/` renders the published portfolio from `site_settings` and `projects`.
- `/admin/login` is the private email/password entry.
- `/admin` shows dashboard stats and publishing flow.
- `/admin/projects` manages projects, ordering, visibility, featured pins, uploads, and card formations.
- `/admin/homepage` edits hero, about, contact, featured content, and homepage section order.
- `/admin/media` manages uploads, folders, tags, optimized images, videos, and reusable asset URLs.
- `/admin/settings` controls motion, SEO, analytics, sitemap, and performance settings.
- `/admin/preview` renders the current draft experience before publishing.
- `/admin/history` lists saved content versions.

## Structure

```txt
app/
  page.tsx                         public portfolio
  api/                             analytics and secure admin upload routes
  (auth)/admin/login/              admin login
  (admin)/admin/                   private CMS dashboard
components/
  site/                            public visual experience
  admin/                           dashboard and CMS editing tools
  ui/                              reusable controls
lib/
  cms/                             schemas, defaults, queries, versioning
  supabase/                        browser, server, service, middleware clients
store/
  admin-store.ts                   preview, undo, redo, admin theme state
supabase/
  migrations/001_initial_schema.sql
  seed.sql
```

## Production Notes

- Pin dependency versions after first install by committing the generated lockfile.
- Add a deployment-level CSP, rate limiting for auth and upload routes, and file size enforcement matching the Supabase bucket limit.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it in client components.
- Use Supabase Auth policies and the `profiles.role = 'admin'` guard for every CMS write path.
- Add brand-specific assets, final copy, and real project media through the admin studio after the first deploy.
