// Read access for projects/blog/careers — used by both the public site and
// the admin list pages (RLS allows public SELECT on all rows, so one
// client suffices for reads; only writes need the service-role key, see
// lib/mutations.ts).
//
// Falls back to lib/mock-data.ts when Supabase isn't configured (keeps the
// "clone and run, no credentials required" property for local dev) or if
// a query genuinely errors (defensive — a flaky read shouldn't 500 the
// site). Once Supabase is configured and the tables are empty, callers get
// a real empty array/null — that's the actual current state until content
// is added via /admin.

import "server-only";
import { getSupabaseAdmin, isSupabaseConfigured, supabase } from "./supabase";
import { rowToBlogPost, rowToCareerListing, rowToProject } from "./mappers";
import type { BlogPostRow, CareerListingRow, ProjectRow } from "./db-types";
import { blogPosts as mockBlogPosts, careerListings as mockCareerListings, projects as mockProjects } from "./mock-data";
import type { BlogPost, CareerListing, Lead, Project } from "./types";

// ---------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) return mockProjects;

  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("[getProjects] Supabase query failed, falling back to mock data:", error.message);
    return mockProjects;
  }
  return (data as ProjectRow[]).map(rowToProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured || !supabase) return mockProjects.find((p) => p.slug === slug) ?? null;

  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("[getProjectBySlug] Supabase query failed:", error.message);
    return null;
  }
  return data ? rowToProject(data as ProjectRow) : null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured || !supabase) return mockProjects.find((p) => p.id === id) ?? null;

  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[getProjectById] Supabase query failed:", error.message);
    return null;
  }
  return data ? rowToProject(data as ProjectRow) : null;
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const all = await getProjects();
  return all.map((p) => p.slug);
}

// ---------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured || !supabase) return mockBlogPosts;

  const { data, error } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
  if (error) {
    console.error("[getBlogPosts] Supabase query failed, falling back to mock data:", error.message);
    return mockBlogPosts;
  }
  return (data as BlogPostRow[]).map(rowToBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured || !supabase) return mockBlogPosts.find((p) => p.slug === slug) ?? null;

  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("[getBlogPostBySlug] Supabase query failed:", error.message);
    return null;
  }
  return data ? rowToBlogPost(data as BlogPostRow) : null;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured || !supabase) return mockBlogPosts.find((p) => p.id === id) ?? null;

  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[getBlogPostById] Supabase query failed:", error.message);
    return null;
  }
  return data ? rowToBlogPost(data as BlogPostRow) : null;
}

// ---------------------------------------------------------------------
// Career listings
// ---------------------------------------------------------------------

export async function getCareerListings(): Promise<CareerListing[]> {
  if (!isSupabaseConfigured || !supabase) return mockCareerListings;

  const { data, error } = await supabase.from("career_listings").select("*").order("posted_at", { ascending: false });
  if (error) {
    console.error("[getCareerListings] Supabase query failed, falling back to mock data:", error.message);
    return mockCareerListings;
  }
  return (data as CareerListingRow[]).map(rowToCareerListing);
}

export async function getCareerListingBySlug(slug: string): Promise<CareerListing | null> {
  if (!isSupabaseConfigured || !supabase) return mockCareerListings.find((c) => c.slug === slug) ?? null;

  const { data, error } = await supabase.from("career_listings").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("[getCareerListingBySlug] Supabase query failed:", error.message);
    return null;
  }
  return data ? rowToCareerListing(data as CareerListingRow) : null;
}

export async function getCareerListingById(id: string): Promise<CareerListing | null> {
  if (!isSupabaseConfigured || !supabase) return mockCareerListings.find((c) => c.id === id) ?? null;

  const { data, error } = await supabase.from("career_listings").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[getCareerListingById] Supabase query failed:", error.message);
    return null;
  }
  return data ? rowToCareerListing(data as CareerListingRow) : null;
}

// ---------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------

/**
 * Admin-only, unlike every other read above: the service-role client, not
 * the public one — leads carry a submitter's name/email/phone, and there's
 * no RLS policy allowing public SELECT on this table (only submitLead's own
 * service-role insert writes to it, in lib/actions.ts). No mock-data
 * fallback either, for the same reason getProjects etc. have one and this
 * doesn't: an empty/misconfigured state here should read as "no leads yet"
 * or a visible error, never silently show fabricated sample enquiries.
 * Safe to call without its own requireAdminSession check because — unlike
 * a mutation, which is a POST-able endpoint reachable directly — this is
 * only ever invoked from the admin leads page itself, which the
 * middleware already keeps unauthenticated visitors out of.
 */
export async function getLeads(): Promise<Lead[]> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];

  const { data, error } = await admin.from("leads").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("[getLeads] Supabase query failed:", error.message);
    return [];
  }
  return data as Lead[];
}
