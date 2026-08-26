// Converts between Supabase's snake_case row shapes (lib/db-types.ts) and
// the camelCase app-level types (lib/types.ts) that every component
// already renders. Keeping this in one place means components never see
// a raw DB row.

import type { BlogPostRow, CareerListingRow, ProjectRow, SiteSettingsRow } from "./db-types";
import type { BlogPost, CareerListing, Project, SiteSettings, StatItem } from "./types";

export function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: {
      city: row.city,
      area: row.area,
      mapEmbedUrl: row.map_embed_url ?? undefined,
    },
    status: row.status,
    priceFromLakhs: row.price_from_lakhs,
    priceToLakhs: row.price_to_lakhs ?? undefined,
    configuration: row.configuration,
    description: row.description,
    heroImage: row.hero_image,
    gallery: row.gallery ?? [],
    videoUrl: row.video_url ?? undefined,
    amenities: row.amenities ?? [],
    reraNumber: row.rera_number ?? undefined,
    featured: row.featured,
  };
}

/** Input shape for create/update — everything the form collects, no id/created_at. */
export interface ProjectInput {
  slug: string;
  title: string;
  city: string;
  area: string;
  mapEmbedUrl?: string;
  status: Project["status"];
  priceFromLakhs: number;
  priceToLakhs?: number;
  configuration: string;
  description: string;
  heroImage: string;
  gallery: string[];
  videoUrl?: string;
  amenities: string[];
  reraNumber?: string;
  featured: boolean;
}

export function projectInputToRow(input: ProjectInput) {
  return {
    slug: input.slug,
    title: input.title,
    city: input.city,
    area: input.area,
    map_embed_url: input.mapEmbedUrl || null,
    status: input.status,
    price_from_lakhs: input.priceFromLakhs,
    price_to_lakhs: input.priceToLakhs ?? null,
    configuration: input.configuration,
    description: input.description,
    hero_image: input.heroImage,
    gallery: input.gallery,
    video_url: input.videoUrl || null,
    amenities: input.amenities,
    rera_number: input.reraNumber || null,
    featured: input.featured,
  };
}

export function rowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    author: row.author,
    publishedAt: row.published_at,
    tags: row.tags ?? [],
  };
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export function blogPostInputToRow(input: BlogPostInput) {
  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    cover_image: input.coverImage,
    author: input.author,
    published_at: input.publishedAt,
    tags: input.tags,
  };
}

export function rowToCareerListing(row: CareerListingRow): CareerListing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location,
    employmentType: row.employment_type,
    description: row.description,
    postedAt: row.posted_at,
  };
}

export interface CareerListingInput {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: CareerListing["employmentType"];
  description: string;
  postedAt: string;
}

export function careerListingInputToRow(input: CareerListingInput) {
  return {
    slug: input.slug,
    title: input.title,
    department: input.department,
    location: input.location,
    employment_type: input.employmentType,
    description: input.description,
    posted_at: input.postedAt,
  };
}

// ---------------------------------------------------------------------
// Site settings (singleton)
// ---------------------------------------------------------------------

export function rowToSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    heroVideoUrl: row.hero_video_url ?? undefined,
    heroFallbackImageUrl: row.hero_fallback_image_url ?? undefined,
    stats: row.stats,
    privacyPolicy: row.privacy_policy ?? "",
    aboutStoryImageUrl: row.about_story_image_url ?? undefined,
  };
}

// All fields are required, not just the one a given form edits — two
// separate admin forms (Site Settings; Privacy Policy) write this same
// singleton row, and each must send the *other* form's current values
// back unchanged (read from its own settings prop) rather than omit them,
// so neither form's save can blank out the other's content.
export interface SiteSettingsInput {
  heroVideoUrl?: string;
  heroFallbackImageUrl?: string;
  stats: StatItem[];
  privacyPolicy: string;
  aboutStoryImageUrl?: string;
}

export function siteSettingsInputToRow(input: SiteSettingsInput) {
  return {
    id: 1,
    hero_video_url: input.heroVideoUrl || null,
    hero_fallback_image_url: input.heroFallbackImageUrl || null,
    stats: input.stats,
    privacy_policy: input.privacyPolicy || null,
    about_story_image_url: input.aboutStoryImageUrl || null,
    updated_at: new Date().toISOString(),
  };
}
