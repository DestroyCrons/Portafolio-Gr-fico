create extension if not exists "pgcrypto";

do $$ begin
  create type public.content_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  eyebrow text,
  summary text,
  description text,
  category text,
  tags text[] not null default '{}',
  cover_url text,
  video_url text,
  external_url text,
  featured boolean not null default false,
  visible boolean not null default true,
  status public.content_status not null default 'draft',
  position integer not null default 0,
  layout jsonb not null default '{"variant":"bento-wide","colSpan":1,"rowSpan":1,"accent":"cyan"}'::jsonb,
  media jsonb not null default '[]'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_idx on public.projects (status, visible, position);
create index if not exists projects_featured_idx on public.projects (featured, position);
create index if not exists projects_tags_idx on public.projects using gin(tags);

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  status public.content_status not null default 'draft',
  value jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  updated_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (key, status)
);

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  type text not null check (type in ('image', 'video')),
  url text not null,
  storage_path text,
  alt text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  duration numeric,
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  tags text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists media_assets_tags_idx on public.media_assets using gin(tags);

drop trigger if exists media_assets_touch_updated_at on public.media_assets;
create trigger media_assets_touch_updated_at
  before update on public.media_assets
  for each row execute function public.touch_updated_at();

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('project', 'home', 'settings')),
  entity_id uuid not null,
  snapshot jsonb not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists content_versions_entity_idx on public.content_versions (entity_type, entity_id, created_at desc);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_idx on public.page_views (created_at desc);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_assets enable row level security;
alter table public.content_versions enable row level security;
alter table public.page_views enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Admins update profiles" on public.profiles;
create policy "Admins update profiles"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public reads published projects" on public.projects;
create policy "Public reads published projects"
  on public.projects for select
  using ((status = 'published' and visible = true) or public.is_admin());

drop policy if exists "Admins insert projects" on public.projects;
create policy "Admins insert projects"
  on public.projects for insert
  with check (public.is_admin());

drop policy if exists "Admins update projects" on public.projects;
create policy "Admins update projects"
  on public.projects for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete projects" on public.projects;
create policy "Admins delete projects"
  on public.projects for delete
  using (public.is_admin());

drop policy if exists "Public reads published settings" on public.site_settings;
create policy "Public reads published settings"
  on public.site_settings for select
  using (status = 'published' or public.is_admin());

drop policy if exists "Admins insert settings" on public.site_settings;
create policy "Admins insert settings"
  on public.site_settings for insert
  with check (public.is_admin());

drop policy if exists "Admins update settings" on public.site_settings;
create policy "Admins update settings"
  on public.site_settings for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public reads public media" on public.media_assets;
create policy "Public reads public media"
  on public.media_assets for select
  using (visibility = 'public' or public.is_admin());

drop policy if exists "Admins insert media" on public.media_assets;
create policy "Admins insert media"
  on public.media_assets for insert
  with check (public.is_admin());

drop policy if exists "Admins update media" on public.media_assets;
create policy "Admins update media"
  on public.media_assets for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete media" on public.media_assets;
create policy "Admins delete media"
  on public.media_assets for delete
  using (public.is_admin());

drop policy if exists "Admins read versions" on public.content_versions;
create policy "Admins read versions"
  on public.content_versions for select
  using (public.is_admin());

drop policy if exists "Admins create versions" on public.content_versions;
create policy "Admins create versions"
  on public.content_versions for insert
  with check (public.is_admin());

drop policy if exists "Anyone can create page views" on public.page_views;
create policy "Anyone can create page views"
  on public.page_views for insert
  with check (true);

drop policy if exists "Admins read page views" on public.page_views;
create policy "Admins read page views"
  on public.page_views for select
  using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads portfolio media" on storage.objects;
create policy "Public reads portfolio media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

drop policy if exists "Admins upload portfolio media" on storage.objects;
create policy "Admins upload portfolio media"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admins update portfolio media" on storage.objects;
create policy "Admins update portfolio media"
  on storage.objects for update
  using (bucket_id = 'portfolio-media' and public.is_admin())
  with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admins delete portfolio media" on storage.objects;
create policy "Admins delete portfolio media"
  on storage.objects for delete
  using (bucket_id = 'portfolio-media' and public.is_admin());
