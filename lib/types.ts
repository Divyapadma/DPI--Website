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

export interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

// Shape written to the shared DPI Dashboard V2 "leads" table.
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
