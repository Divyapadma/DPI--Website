"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "./supabase";
import { requireAdminSession } from "./admin-guard";
import {
  blogPostInputToRow,
  careerListingInputToRow,
  projectInputToRow,
  siteSettingsInputToRow,
  type BlogPostInput,
  type CareerListingInput,
  type ProjectInput,
  type SiteSettingsInput,
} from "./mappers";

export interface MutationResult {
  ok: boolean;
  message: string;
}

/** Postgres unique-violation code — used to surface a friendly "slug taken" message. */
const UNIQUE_VIOLATION = "23505";

function friendlyDbError(error: { code?: string; message: string }, entity: string): string {
  if (error.code === UNIQUE_VIOLATION) {
    return `That slug is already used by another ${entity} — pick a different one.`;
  }
  return `Couldn't save the ${entity}: ${error.message}`;
}

// ---------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------

export async function createProject(input: ProjectInput): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("projects").insert(projectInputToRow(input));
  if (error) return { ok: false, message: friendlyDbError(error, "project") };

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return { ok: true, message: "Project created." };
}

export async function updateProject(id: string, input: ProjectInput): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("projects").update(projectInputToRow(input)).eq("id", id);
  if (error) return { ok: false, message: friendlyDbError(error, "project") };

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${input.slug}`);
  revalidatePath("/");
  return { ok: true, message: "Project updated." };
}

export async function deleteProject(id: string): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("projects").delete().eq("id", id);
  if (error) return { ok: false, message: `Couldn't delete the project: ${error.message}` };

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return { ok: true, message: "Project deleted." };
}

// ---------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------

export async function createBlogPost(input: BlogPostInput): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("blog_posts").insert(blogPostInputToRow(input));
  if (error) return { ok: false, message: friendlyDbError(error, "post") };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { ok: true, message: "Post created." };
}

export async function updateBlogPost(id: string, input: BlogPostInput): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("blog_posts").update(blogPostInputToRow(input)).eq("id", id);
  if (error) return { ok: false, message: friendlyDbError(error, "post") };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${input.slug}`);
  return { ok: true, message: "Post updated." };
}

export async function deleteBlogPost(id: string): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("blog_posts").delete().eq("id", id);
  if (error) return { ok: false, message: `Couldn't delete the post: ${error.message}` };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { ok: true, message: "Post deleted." };
}

// ---------------------------------------------------------------------
// Career listings
// ---------------------------------------------------------------------

export async function createCareerListing(input: CareerListingInput): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("career_listings").insert(careerListingInputToRow(input));
  if (error) return { ok: false, message: friendlyDbError(error, "listing") };

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  return { ok: true, message: "Listing created." };
}

export async function updateCareerListing(id: string, input: CareerListingInput): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("career_listings").update(careerListingInputToRow(input)).eq("id", id);
  if (error) return { ok: false, message: friendlyDbError(error, "listing") };

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  revalidatePath(`/careers/${input.slug}`);
  return { ok: true, message: "Listing updated." };
}

export async function deleteCareerListing(id: string): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("career_listings").delete().eq("id", id);
  if (error) return { ok: false, message: `Couldn't delete the listing: ${error.message}` };

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  return { ok: true, message: "Listing deleted." };
}

// ---------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------

/** No create/update — leads only ever arrive via submitLead (lib/actions.ts). Delete only, for clearing handled enquiries. */
export async function deleteLead(id: string): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("leads").delete().eq("id", id);
  if (error) return { ok: false, message: `Couldn't delete the lead: ${error.message}` };

  revalidatePath("/admin/leads");
  return { ok: true, message: "Lead deleted." };
}

// ---------------------------------------------------------------------
// Site settings (singleton — hero video URL + homepage stats)
// ---------------------------------------------------------------------

/** Upserts the single settings row (id always 1) — see supabase/schema.sql. */
export async function updateSiteSettings(input: SiteSettingsInput): Promise<MutationResult> {
  const session = await requireAdminSession();
  if (!session.ok) return session;

  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, message: "Supabase isn't configured yet." };

  const { error } = await admin.from("site_settings").upsert(siteSettingsInputToRow(input));
  if (error) return { ok: false, message: `Couldn't save settings: ${error.message}` };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  // About page also reads this row now (aboutStoryImageUrl) — not
  // force-dynamic (see app/(site)/about/page.tsx), so it needs its own
  // explicit revalidation the same way "/" does.
  revalidatePath("/about");
  return { ok: true, message: "Settings saved — changes are live on the homepage." };
}
