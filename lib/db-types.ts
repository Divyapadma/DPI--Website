// Raw Supabase row shapes — snake_case, flat, matching supabase/schema.sql
// exactly. lib/mappers.ts converts these to/from the camelCase app types in
// lib/types.ts. Keep this file in sync with supabase/schema.sql.

import type { ProjectStatus } from "./types";

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  city: string;
  area: string;
  map_embed_url: string | null;
  status: ProjectStatus;
  price_from_lakhs: number;
  price_to_lakhs: number | null;
  configuration: string;
  description: string;
  hero_image: string;
  gallery: string[];
  video_url: string | null;
  amenities: string[];
  rera_number: string | null;
  featured: boolean;
  created_at: string;
}

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  published_at: string;
  tags: string[];
  created_at: string;
}

export interface CareerListingRow {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: "full-time" | "part-time" | "contract" | "internship";
  description: string;
  posted_at: string;
  created_at: string;
}

/** The singleton row (id always 1) — see supabase/schema.sql site_settings. */
export interface SiteSettingsRow {
  id: number;
  hero_video_url: string | null;
  hero_fallback_image_url: string | null;
  stats: { value: string; label: string }[];
  privacy_policy: string | null;
  about_story_image_url: string | null;
  updated_at: string;
}
