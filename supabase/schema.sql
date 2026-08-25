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

-- ---------------------------------------------------------------------
-- site_settings  (singleton row — homepage hero video + stats counters,
-- managed via /admin/settings; written by lib/mutations.ts
-- updateSiteSettings(), via the service-role key)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id              smallint primary key default 1,
  hero_video_url  text,
  stats           jsonb not null default '[]'::jsonb, -- [{ "value": "6+", "label": "Cities Present" }, ...]
  privacy_policy  text, -- "## Heading" lines + blank-line-separated paragraphs, see app/(site)/privacy-policy/page.tsx
  updated_at      timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- Catches up a site_settings table created before privacy_policy existed
-- (this project's own live table included) — a no-op on a fresh install,
-- since the column is already in the create table above.
alter table public.site_settings add column if not exists privacy_policy text;

alter table public.site_settings enable row level security;

create policy "Site settings are publicly readable"
  on public.site_settings for select
  using (true);
-- No insert/update/delete policy for anon/authenticated — same as
-- projects/blog_posts/career_listings: the admin panel writes via the
-- service-role key, which bypasses RLS entirely.

-- Seed the singleton row with today's live homepage values (fresh
-- installs only — on conflict do nothing) so nothing changes visually
-- until an admin edits them at /admin/settings or /admin/privacy-policy.
-- $$-quoted so the policy text's own apostrophes don't need escaping.
insert into public.site_settings (id, hero_video_url, stats, privacy_policy)
values (
  1,
  null,
  '[
    {"value": "6+", "label": "Cities Present"},
    {"value": "10+", "label": "Projects Partnered"},
    {"value": "250+", "label": "Happy Families"},
    {"value": "4+", "label": "Years of Experience"}
  ]'::jsonb,
  $$Last updated: 25 August 2026

## Who We Are

DPI (Divya Padma Infosystem LLP) is a real estate channel partner helping families find their next home across Greater Noida West, Noida Extension, the Jewar Airport corridor, Aligarh, Ghaziabad, and Uttarakhand. We connect you with trusted developers — we do not build or sell the projects ourselves. This policy explains what information we collect through this website and how we use it.

## Information We Collect

We collect the information you choose to share with us through our forms — the Contact page, a project enquiry form, or a career application. This typically includes your name, phone number, email address, and any message or requirements you add.

We do not collect payment information, government ID numbers, or any other sensitive personal data through this website.

## How We Use Your Information

We use the details you submit to respond to your enquiry, share project and pricing information you've asked about, follow up on your interest by phone, WhatsApp, or email, and process career applications for open roles. If you enquire about a specific project, we may share your contact details with that project's developer solely to help fulfil your enquiry.

## What We Don't Do

We do not sell, rent, or trade your personal information to third parties for their own marketing purposes. We only share your details with the specific developer relevant to a project you've enquired about, or when required by law.

## Cookies & Analytics

This website does not currently use third-party advertising or analytics tracking cookies. The only cookies set are essential, functional cookies required to keep our admin panel login working — these do not track visitors to the public site.

## Data Retention & Security

We retain your information for as long as reasonably necessary to respond to your enquiry and maintain our business records, and take reasonable technical and organisational measures to keep it secure.

## Your Rights

You can ask us to access, correct, or delete the personal information we hold about you at any time by reaching out using the contact details below.

## Third-Party Links

Our website links to external sites, including our social media pages and the websites of developers we partner with. This policy does not cover how those sites handle your information — please review their own privacy policies.

## Changes to This Policy

We may update this policy from time to time as our services or applicable regulations change. The "Last updated" date above reflects the most recent revision.

## Contact Us

For any questions about this policy or your personal information, reach out to us at:

Divya Padma Infosystem LLP
Atha Mart, 4th Floor F-417, Techzone 4, Greater Noida West
Phone: +91 92209 07340
Email: info@divyapadma.com$$
)
on conflict (id) do nothing;

-- Existing installs (row already present from before privacy_policy
-- existed): fill in the same default text, but only if it's still empty —
-- never overwrites a policy an admin has already written.
update public.site_settings
set privacy_policy = $$Last updated: 25 August 2026

## Who We Are

DPI (Divya Padma Infosystem LLP) is a real estate channel partner helping families find their next home across Greater Noida West, Noida Extension, the Jewar Airport corridor, Aligarh, Ghaziabad, and Uttarakhand. We connect you with trusted developers — we do not build or sell the projects ourselves. This policy explains what information we collect through this website and how we use it.

## Information We Collect

We collect the information you choose to share with us through our forms — the Contact page, a project enquiry form, or a career application. This typically includes your name, phone number, email address, and any message or requirements you add.

We do not collect payment information, government ID numbers, or any other sensitive personal data through this website.

## How We Use Your Information

We use the details you submit to respond to your enquiry, share project and pricing information you've asked about, follow up on your interest by phone, WhatsApp, or email, and process career applications for open roles. If you enquire about a specific project, we may share your contact details with that project's developer solely to help fulfil your enquiry.

## What We Don't Do

We do not sell, rent, or trade your personal information to third parties for their own marketing purposes. We only share your details with the specific developer relevant to a project you've enquired about, or when required by law.

## Cookies & Analytics

This website does not currently use third-party advertising or analytics tracking cookies. The only cookies set are essential, functional cookies required to keep our admin panel login working — these do not track visitors to the public site.

## Data Retention & Security

We retain your information for as long as reasonably necessary to respond to your enquiry and maintain our business records, and take reasonable technical and organisational measures to keep it secure.

## Your Rights

You can ask us to access, correct, or delete the personal information we hold about you at any time by reaching out using the contact details below.

## Third-Party Links

Our website links to external sites, including our social media pages and the websites of developers we partner with. This policy does not cover how those sites handle your information — please review their own privacy policies.

## Changes to This Policy

We may update this policy from time to time as our services or applicable regulations change. The "Last updated" date above reflects the most recent revision.

## Contact Us

For any questions about this policy or your personal information, reach out to us at:

Divya Padma Infosystem LLP
Atha Mart, 4th Floor F-417, Techzone 4, Greater Noida West
Phone: +91 92209 07340
Email: info@divyapadma.com$$
where id = 1 and privacy_policy is null;
