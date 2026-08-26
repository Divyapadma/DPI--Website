// Shared content types for the DPI site. These mirror the shape we expect
// the Supabase tables to take — keep in sync with the DB schema once it
// exists (see lib/supabase.ts for the client setup).

export type ProjectStatus = "upcoming" | "ongoing" | "completed" | "ready-to-move";

export interface ProjectLocation {
  city: string;
  area: string;
  mapEmbedUrl?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: ProjectLocation;
  status: ProjectStatus;
  priceFromLakhs: number;
  priceToLakhs?: number;
  configuration: string; // e.g. "2, 3 & 4 BHK"
  description: string;
  heroImage: string;
  gallery: string[];
  videoUrl?: string;
  amenities: string[];
  reraNumber?: string;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string; // ISO date
  tags: string[];
}

export interface CareerListing {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  description: string;
  postedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  rating?: number;
}

// `value` is the full display text as typed by an admin — e.g. "6+", "250+"
// — not split into number/suffix. StatsBar's Counter animates only the
// leading digits and renders whatever follows (e.g. "+") statically, so a
// non-technical admin never has to think about the two parts separately.
export interface StatItem {
  label: string;
  value: string;
}

// Singleton admin-editable content — the homepage hero video and the four
// stats counter cards. Mirrors the "site_settings" table (always a single
// row, id 1) — see supabase/schema.sql and lib/mutations.ts updateSiteSettings().
export interface SiteSettings {
  heroVideoUrl?: string;
  // Shown on the homepage hero: as the <video>'s poster while it buffers
  // (and permanently on mobile widths, where no video source loads at
  // all — see components/home/Hero.tsx), and as the hero background
  // outright when heroVideoUrl itself is unset. Falls back to the local
  // placeholder SVG when unset.
  heroFallbackImageUrl?: string;
  stats: StatItem[];
  // "## Heading" lines + blank-line-separated paragraphs — see
  // app/(site)/privacy-policy/page.tsx for how this is parsed/rendered.
  privacyPolicy: string;
  // Shown in the About page's "Our Story" section. Falls back to the
  // local placeholder SVG when unset.
  aboutStoryImageUrl?: string;
}

// Shape written to this project's own Supabase "leads" table.
// `source` is always tagged "website" so leads can be filtered by origin.
export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  message?: string;
  source: "website";
  form_type: "contact" | "project-enquiry" | "career-application";
  project_slug?: string;
  career_slug?: string;
}

/** A row read back from "leads" — LeadPayload plus what the DB adds itself. */
export interface Lead extends LeadPayload {
  id: string;
  created_at: string;
}
