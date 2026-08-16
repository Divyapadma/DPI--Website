# DPI Real Estate Website

Marketing site + admin CMS for DPI, a multi-city real estate developer. Warm editorial design system (cream / terracotta / sage), built on Next.js App Router with a full premium interaction layer.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS v4** (CSS-first theme in `app/globals.css`)
- **Framer Motion** for page transitions, scroll-reveal, tilt cards, and the scroll-progress line
- **GSAP** (ScrollTrigger + SplitText) for the cinematic hero, split-text headline reveals, image clip-path wipes, and the pinned "Why Choose Us" section
- **Lenis** for site-wide smooth scroll, synced with GSAP's ticker
- **Supabase** (`@supabase/supabase-js` + `@supabase/ssr`) for the admin panel, content, and lead storage
- **Vercel** for hosting

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The site renders fully on mock data (`lib/mock-data.ts`) with no Supabase connection required.

## Project Structure

```
app/
  (site)/           # Public marketing site — shares Navbar/Footer via its own root layout
    page.tsx           Home
    about/
    projects/           Listing (filterable) + [slug] detail page
    blog/                Listing + [slug] post page
    careers/             Listing + [slug] application page
    contact/
  (admin)/          # Admin CMS — separate root layout, no public nav/footer
    admin/
      login/            Supabase auth sign-in
      (dashboard)/      Auth-gated: dashboard home, projects/blog/careers CRUD shells
  globals.css       Design tokens (colors, fonts) + shared utilities

components/
  layout/           Navbar, Footer (public site chrome)
  home/             Hero, StatsBar, FeaturedProjects, Testimonials, CTASection, IntroSection
  projects/ blog/   Card + listing components
  forms/            LeadForm — shared contact/enquiry/application form
  admin/            AdminSidebar, AdminListPage, LogoutButton
  ui/               Button, SectionHeading, PageHero, ScrollReveal
  icons/            Social icons not shipped by lucide-react

lib/
  types.ts          Project, BlogPost, CareerListing, LeadPayload, etc.
  mock-data.ts       Placeholder content — replace page by page as real content arrives
  supabase.ts        Browser/service-role Supabase clients (public pages)
  supabase-server.ts / supabase-browser.ts / supabase-middleware.ts
                      @supabase/ssr clients for the admin auth flow
  actions.ts          submitLead() server action — writes to the shared leads table
  utils.ts            cn(), formatINR()

proxy.ts            Next 16's renamed middleware.ts — refreshes the Supabase
                    session and gates /admin/** once credentials are set.
```

## Design System (Warm Editorial — Cream / Terracotta / Sage)

Tokens live in `app/globals.css` under `@theme`:

| Token | Value | Use |
|---|---|---|
| `--color-cream` | `#F7F3EC` | Page background |
| `--color-ivory` / `--color-paper` | `#FDFBF7` / `#FFFFFF` | Cards, panels, nav-on-scroll |
| `--color-terracotta` / `-soft` / `-deep` | `#C97C5D` / `#D9967A` / `#A85F42` | Primary accent — CTAs, key highlights |
| `--color-sage` / `-soft` / `-deep` | `#8A9A7E` / `#A3B098` / `#6F7D64` | Secondary accent — secondary buttons, tags |
| `--color-charcoal` | `#2E2A26` | Primary text |
| `--color-taupe` | `#7A7368` | Secondary/muted text |
| `--color-line` | `#E8E1D5` | Borders/dividers |
| `--font-display` | Playfair Display | Headings |
| `--font-body` | Inter | Body copy |

Reusable utility classes: `.glass-card` (light glassmorphic panel, terracotta glow on hover — scoped to `hover: hover` with a real `:active` fallback for touch), `.text-terracotta-gradient`, `.divider-terracotta`, `.underline-grow` (center-out nav underline), `.focus-glow` (terracotta focus ring for inputs), `.grain-overlay` (barely-visible fixed noise texture).

## Premium Interaction Layer

All of the following live under `components/ui/` and `components/providers/`, wired into `app/(site)/layout.tsx` via `SiteChrome` — scoped to the public marketing site only, not `/admin`:

- **`SmoothScroll`** — Lenis smooth scroll synced with GSAP's ticker/ScrollTrigger (`lib/gsap.ts` centralizes plugin registration).
- **`RevealImage`** — every image wipes into view via `clip-path` on scroll, instead of a plain fade.
- **`CustomCursor`** + **`useMagnetic`** (in `Button`/`ButtonLink`) — terracotta dot-and-ring cursor and magnetic-pull buttons; both auto-disable on touch (no mousemove events).
- **`SplitHeading`** — GSAP SplitText word/letter reveal, used by `Hero`, `PageHero`, and `SectionHeading` (so it's picked up broadly without per-page wiring).
- **`BentoGrid` / `BentoItem`** — asymmetric card grid used by Home's Featured Projects, the Blog listing, and the Careers listing.
- **`WhyChooseUsPinned`** (`components/about/`) — ScrollTrigger `pin` on About's "Why Choose Us" section, cards stagger-reveal while it's pinned.
- **`GrainOverlay`** — fixed, `mix-blend-multiply`, ~3.5% opacity noise texture over the whole viewport.
- **`Preloader`** — logo + terracotta line-draw on first load only (`sessionStorage`-gated).
- **`PageTransition`** — `AnimatePresence` cross-fade between routes; also resets Lenis's scroll position on navigate (Next resets native scroll, Lenis tracks its own).
- **`TiltCard`** — mouse-position-based 3D tilt on project/blog/career cards.
- **`ScrollProgressBar`** — thin terracotta line at the top of the viewport, site-wide.
- **`SwipeGallery`** (`components/projects/`) — full-bleed, natively swipeable (CSS scroll-snap) project gallery.
- **`FadeIn`** — opacity-only entrance (deliberately no `transform`) for the sticky enquiry-form sidebars, so it never fights `position: sticky`.

## Content Status

Every page currently renders on placeholder content and SVG images (`lib/mock-data.ts`, `public/images/placeholder-*.svg`). Replace page by page as real copy, photos, and video are provided — search for `TODO` comments marking the swap points (founder bios, RERA numbers, map embeds, hero video, etc.).

## Supabase Setup (Pending)

This project uses its own standalone Supabase project (free tier is sufficient — no Storage usage, since all media lives on ImageKit; see below).

1. Create a project at [supabase.com](https://supabase.com) and copy `.env.local.example` to `.env.local`, filling in from **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only, never exposed to the client)
2. Create an admin user under **Authentication → Users → Add User** (email + password) — there's no signup flow, this is the only way in. `/admin/login` and the auth-gated dashboard layout (`app/(admin)/admin/(dashboard)/layout.tsx`) start enforcing this automatically once env vars are present; until then the panel runs unprotected with a visible warning banner.
3. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor — creates `projects`, `blog_posts`, `career_listings`, `leads` with RLS policies already applied. No Storage buckets needed — image/video columns store full ImageKit URLs (strings), not files.
4. RLS (already in the schema file): public read access on `projects`/`blog_posts`/`career_listings`; writes only via the service-role key (which the admin panel's server actions use, bypassing RLS by design). `leads` is insert-only for anon, no public read.
5. Replace the `lib/mock-data.ts` reads with live Supabase queries and wire the admin CRUD forms (currently UI shells in `components/admin/AdminListPage.tsx`) to actually write to these tables — this is the main remaining backend task.

## Images & Video (ImageKit)

Project photos, blog covers, and the hero video are hosted on [ImageKit](https://imagekit.io), not Supabase Storage:

- `next.config.ts` + `lib/imagekit-loader.ts` — a custom `next/image` loader that appends ImageKit's own `?tr=` transformation params instead of routing through Next's built-in image optimizer.
- Supabase table columns (`hero_image`, `gallery`, `cover_image`, etc.) store the **full ImageKit URL** as plain text — upload happens in the ImageKit dashboard (or later, via ImageKit's Upload API from the admin panel, which needs a separate public/private key pair — not required for the current URL-based setup).
- The hero video is optional: set `NEXT_PUBLIC_HERO_VIDEO_URL` to a direct ImageKit video URL, or leave it unset to keep the placeholder image (`components/home/Hero.tsx`).
- Local `public/images/placeholder-*.svg` fallbacks and any `data:` URIs pass straight through the loader untouched.

## Notes on Next.js 16

This project was scaffolded on Next.js 16, which has a few breaking changes from earlier versions worth knowing about:

- `middleware.ts` is renamed to **`proxy.ts`** (export `proxy` instead of `middleware`).
- Dynamic route `params` are typed via the `PageProps<'/route'>` / `LayoutProps<'/route'>` helpers (see any `app/**/page.tsx` with a `[slug]` segment).
