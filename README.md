# DPI Real Estate Website

Marketing site + admin CMS for DPI, a multi-city real estate developer. Luxury dark (black & gold) design system, built on Next.js App Router.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS v4** (CSS-first theme in `app/globals.css`)
- **Framer Motion** for scroll-reveal/UI motion, **GSAP** for the cinematic hero
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

## Design System (Luxury Dark — Black & Gold)

Tokens live in `app/globals.css` under `@theme`:

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0A0A0A` | Page background |
| `--color-surface` / `--color-surface-2` | `#121212` / `#1A1A1A` | Cards, panels, nav |
| `--color-gold` / `--color-gold-soft` / `--color-gold-deep` | `#C9A227` / `#E4C567` / `#8F711A` | Accent, hover, pressed |
| `--color-ivory` | `#F5F1E8` | Primary text |
| `--color-mist` | `#A8A29A` | Secondary/muted text |
| `--font-display` | Playfair Display | Headings |
| `--font-body` | Inter | Body copy |

**This is a placeholder palette per the project brief.** Swap the hex values once the logo is supplied — everything downstream (Tailwind classes like `bg-ink`, `text-gold`, `font-display`) updates automatically.

Reusable utility classes: `.glass-card` (glassmorphic panel + gold hover glow), `.text-gold-gradient`, `.divider-gold`.

## Content Status

Every page currently renders on placeholder content and SVG images (`lib/mock-data.ts`, `public/images/placeholder-*.svg`). Replace page by page as real copy, photos, and video are provided — search for `TODO` comments marking the swap points (founder bios, RERA numbers, map embeds, hero video, etc.).

## Supabase Setup (Pending)

1. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
2. Confirm the `leads` table schema against the existing **DPI Dashboard V2** project and adjust the insert in `lib/actions.ts` if column names differ. All website leads are tagged `source: "website"`.
3. Create a Supabase Auth user for admin login (`/admin/login`) — the admin dashboard layout (`app/(admin)/admin/(dashboard)/layout.tsx`) will start enforcing auth automatically once env vars are present; until then it runs unprotected with a visible warning banner.
4. Build out `projects`, `blog_posts`, `career_listings` tables + Storage buckets, then replace `lib/mock-data.ts` reads with live Supabase queries and wire the admin CRUD forms (currently UI shells in `components/admin/AdminListPage.tsx`).
5. Add RLS policies matching the DPI Dashboard V2 pattern.

## Notes on Next.js 16

This project was scaffolded on Next.js 16, which has a few breaking changes from earlier versions worth knowing about:

- `middleware.ts` is renamed to **`proxy.ts`** (export `proxy` instead of `middleware`).
- Dynamic route `params` are typed via the `PageProps<'/route'>` / `LayoutProps<'/route'>` helpers (see any `app/**/page.tsx` with a `[slug]` segment).
