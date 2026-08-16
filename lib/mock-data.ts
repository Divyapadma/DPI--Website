// Placeholder content so every page renders end-to-end before real data
// (Supabase tables + client photos/copy) is wired in. Replace page by page.

import type { BlogPost, CareerListing, Project, StatItem, Testimonial } from "./types";

export const stats: StatItem[] = [
  { label: "Business Delivered", value: "500", suffix: "+ Cr" },
  { label: "Projects Completed", value: "25", suffix: "+" },
  { label: "Cities Present", value: "6", suffix: "+" },
  { label: "Happy Families", value: "3,000", suffix: "+" },
];

export const projects: Project[] = [
  {
    id: "1",
    slug: "dpi-crown-heights",
    title: "DPI Crown Heights",
    location: { city: "Pune", area: "Baner" },
    status: "ongoing",
    priceFromLakhs: 85,
    priceToLakhs: 180,
    configuration: "2 & 3 BHK",
    description:
      "A landmark residential address offering skyline views, resort-style amenities, and effortless connectivity to Pune's business districts.",
    heroImage: "/images/placeholder-project.svg",
    gallery: ["/images/placeholder-project.svg"],
    amenities: ["Infinity Pool", "Clubhouse", "Landscaped Gardens", "24x7 Security", "EV Charging"],
    featured: true,
  },
  {
    id: "2",
    slug: "dpi-emerald-bay",
    title: "DPI Emerald Bay",
    location: { city: "Mumbai", area: "Thane West" },
    status: "ready-to-move",
    priceFromLakhs: 120,
    priceToLakhs: 260,
    configuration: "2, 3 & 4 BHK",
    description:
      "Waterfront-inspired living with curated interiors, private decks, and a wellness-first amenity deck overlooking the bay.",
    heroImage: "/images/placeholder-project.svg",
    gallery: ["/images/placeholder-project.svg"],
    amenities: ["Sky Lounge", "Spa & Wellness", "Kids' Play Zone", "Multipurpose Hall"],
    featured: true,
  },
  {
    id: "3",
    slug: "dpi-the-orchard",
    title: "DPI The Orchard",
    location: { city: "Nagpur", area: "Wardha Road" },
    status: "upcoming",
    priceFromLakhs: 55,
    priceToLakhs: 95,
    configuration: "2 & 3 BHK",
    description:
      "Low-density villas and mid-rise residences set within a private orchard — designed for families who want space without compromise.",
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
    role: "Homeowner, DPI Crown Heights",
    quote:
      "From the first site visit to handover, the DPI team made the entire process transparent and stress-free. The finish quality exceeded what we saw in the sample flat.",
    rating: 5,
  },
  {
    id: "2",
    name: "Ananya Kulkarni",
    role: "Homeowner, DPI Emerald Bay",
    quote:
      "We compared six builders before choosing DPI — the clarity on pricing and construction timelines was unmatched.",
    rating: 5,
  },
  {
    id: "3",
    name: "Vikram Singh",
    role: "Investor",
    quote:
      "Consistent appreciation across every DPI project I've invested in. Their location scouting is genuinely best-in-class.",
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

export const careerListings: CareerListing[] = [
  {
    id: "1",
    slug: "senior-sales-manager-pune",
    title: "Senior Sales Manager",
    department: "Sales",
    location: "Pune",
    employmentType: "full-time",
    description: "Lead a team of relationship managers driving residential sales across our Pune portfolio.",
    postedAt: "2026-08-01",
  },
  {
    id: "2",
    slug: "site-engineer-thane",
    title: "Site Engineer",
    department: "Construction",
    location: "Thane",
    employmentType: "full-time",
    description: "Oversee on-site execution quality and timelines for an ongoing residential tower.",
    postedAt: "2026-07-20",
  },
];
