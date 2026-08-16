-- DPI website — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- after creating the project. Mirrors the shapes in lib/types.ts.
--
-- No Storage buckets are created here — image/video columns store full
-- ImageKit URLs as plain text, not files. See README.md "Images & Video".

-- ---------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  city              text not null,
  area              text not null,
  map_embed_url     text,
  status            text not null check (status in ('upcoming', 'ongoing', 'completed', 'ready-to-move')),
  price_from_lakhs  numeric not null,
  price_to_lakhs    numeric,
  configuration     text not null,
  description       text not null,
  hero_image        text not null, -- full ImageKit URL
  gallery           text[] not null default '{}', -- ImageKit URLs
  video_url         text,          -- ImageKit URL, optional walkthrough video
  amenities         text[] not null default '{}',
  rera_number       text,
  featured          boolean not null default false,
  created_at        timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Projects are publicly readable"
  on public.projects for select
  using (true);
-- No insert/update/delete policy for anon/authenticated — the admin panel
-- writes via the service-role key, which bypasses RLS entirely.

-- ---------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text not null,
  content       text not null,
  cover_image   text not null, -- full ImageKit URL
  author        text not null,
  published_at  timestamptz not null default now(),
  tags          text[] not null default '{}',
  created_at    timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Blog posts are publicly readable"
  on public.blog_posts for select
  using (true);

-- ---------------------------------------------------------------------
-- career_listings
-- ---------------------------------------------------------------------
create table if not exists public.career_listings (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  department       text not null,
  location         text not null,
  employment_type  text not null check (employment_type in ('full-time', 'part-time', 'contract', 'internship')),
  description      text not null,
  posted_at        timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

alter table public.career_listings enable row level security;

create policy "Career listings are publicly readable"
  on public.career_listings for select
  using (true);

-- ---------------------------------------------------------------------
-- leads  (written by lib/actions.ts submitLead(), via the service-role key)
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text not null,
  message       text,
  source        text not null default 'website',
  form_type     text not null check (form_type in ('contact', 'project-enquiry', 'career-application')),
  project_slug  text,
  career_slug   text,
  created_at    timestamptz not null default now()
);

alter table public.leads enable row level security;

-- lib/actions.ts submitLead() writes via the service-role key (bypasses
-- RLS entirely), so no insert policy is strictly required — this one just
-- keeps the door open for a future client-side insert path without
-- needing a migration. Deliberately no select policy for anon: leads
-- aren't publicly readable; the admin panel reads them via service-role.
create policy "Anyone can submit a lead"
  on public.leads for insert
  to anon, authenticated
  with check (true);
