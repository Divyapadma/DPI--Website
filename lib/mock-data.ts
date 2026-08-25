// Placeholder content so every page renders end-to-end before real data
// (Supabase tables + client photos/copy) is wired in. Replace page by page.
//
// The three sample projects below are placeholder fixtures for local dev
// without Supabase credentials configured - not real DPI listings. DPI is a
// channel partner, not a developer, so these are deliberately named as
// generic samples rather than "DPI [Name]" (which would incorrectly imply
// DPI built them) or any of DPI's actual 10 real project partnerships,
// which live in the admin-managed projects table, not in code.

import type { BlogPost, CareerListing, Project, StatItem, Testimonial } from "./types";

export const stats: StatItem[] = [
  { value: "6+", label: "Cities Present" },
  { value: "10+", label: "Projects Partnered" },
  { value: "250+", label: "Happy Families" },
  { value: "4+", label: "Years of Experience" },
];

export const projects: Project[] = [
  {
    id: "1",
    slug: "sample-project-one",
    title: "Sample Project One",
    location: { city: "Greater Noida", area: "Techzone 4" },
    status: "ongoing",
    priceFromLakhs: 85,
    priceToLakhs: 180,
    configuration: "2 & 3 BHK",
    description:
      "Placeholder listing — a landmark residential address offering skyline views, resort-style amenities, and effortless connectivity.",
    heroImage: "/images/placeholder-project.svg",
    gallery: ["/images/placeholder-project.svg"],
    amenities: ["Infinity Pool", "Clubhouse", "Landscaped Gardens", "24x7 Security", "EV Charging"],
    featured: true,
  },
  {
    id: "2",
    slug: "sample-project-two",
    title: "Sample Project Two",
    location: { city: "Ghaziabad", area: "NH24" },
    status: "ready-to-move",
    priceFromLakhs: 120,
    priceToLakhs: 260,
    configuration: "2, 3 & 4 BHK",
    description: "Placeholder listing — curated interiors, private decks, and a wellness-first amenity deck.",
    heroImage: "/images/placeholder-project.svg",
    gallery: ["/images/placeholder-project.svg"],
    amenities: ["Sky Lounge", "Spa & Wellness", "Kids' Play Zone", "Multipurpose Hall"],
    featured: true,
  },
  {
    id: "3",
    slug: "sample-project-three",
    title: "Sample Project Three",
    location: { city: "Aligarh", area: "GT Road" },
    status: "upcoming",
    priceFromLakhs: 55,
    priceToLakhs: 95,
    configuration: "2 & 3 BHK",
    description:
      "Placeholder listing — low-density villas and mid-rise residences designed for families who want space without compromise.",
    heroImage: "/images/placeholder-project.svg",
    gallery: ["/images/placeholder-project.svg"],
    amenities: ["Private Gardens", "Jogging Track", "Clubhouse", "Solar Power Backup"],
    featured: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rohan Mehta",
    role: "Homeowner, Greater Noida West",
    quote:
      "From the first site visit to handover, the DPI team made the entire process transparent and stress-free. The finish quality exceeded what we saw in the sample flat.",
    rating: 5,
  },
  {
    id: "2",
    name: "Ananya Kulkarni",
    role: "Homeowner, Ghaziabad",
    quote:
      "We compared several channel partners before choosing DPI — the clarity on pricing and project timelines was unmatched.",
    rating: 5,
  },
  {
    id: "3",
    name: "Vikram Singh",
    role: "Investor",
    quote:
      "Consistent appreciation across every project DPI has helped me invest in. Their location scouting is genuinely best-in-class.",
    rating: 5,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "real-estate-outlook-2026",
    title: "Real Estate Outlook 2026: Where Smart Money Is Moving",
    excerpt:
      "A look at the emerging micro-markets and buyer trends set to define residential real estate over the coming year.",
    content: "Full article content coming soon.",
    coverImage: "/images/placeholder-blog.svg",
    author: "DPI Research Desk",
    publishedAt: "2026-07-01",
    tags: ["Market Insights"],
  },
  {
    id: "2",
    slug: "guide-to-home-loan-approval",
    title: "A First-Time Buyer's Guide to Home Loan Approval",
    excerpt: "Everything you need to know before applying for a home loan — documents, eligibility, and timelines.",
    content: "Full article content coming soon.",
    coverImage: "/images/placeholder-blog.svg",
    author: "DPI Research Desk",
    publishedAt: "2026-06-12",
    tags: ["Buyer Guide"],
  },
];

// Kept in sync with the real listings seeded into the career_listings table
// (see /admin/careers to manage them) so local dev without Supabase
// credentials still shows accurate roles instead of stale placeholders.
export const careerListings: CareerListing[] = [
  {
    id: "1",
    slug: "hr-manager",
    title: "HR Manager",
    department: "Human Resources",
    location: "Greater Noida West",
    employmentType: "full-time",
    description:
      "Minimum 1 year of experience required. Manage recruitment, onboarding, and day-to-day HR operations for our growing sales team.",
    postedAt: "2026-08-01",
  },
  {
    id: "2",
    slug: "sales-executive",
    title: "Sales Executive",
    department: "Sales",
    location: "Greater Noida West",
    employmentType: "full-time",
    description:
      "Freshers and experienced candidates both welcome. Drive property sales and client relationships across our active project partnerships.",
    postedAt: "2026-08-01",
  },
  {
    id: "3",
    slug: "team-lead",
    title: "Team Lead",
    department: "Sales",
    location: "Greater Noida West",
    employmentType: "full-time",
    description:
      "Minimum 1 year of experience specifically leading a real estate sales team required. Lead and mentor a team of sales executives to hit targets.",
    postedAt: "2026-08-01",
  },
  {
    id: "4",
    slug: "telecaller",
    title: "Telecaller",
    department: "Sales",
    location: "Greater Noida West",
    employmentType: "full-time",
    description:
      "Freshers and experienced candidates both welcome. Handle inbound and outbound calls to generate and qualify leads for our sales team.",
    postedAt: "2026-08-01",
  },
];
