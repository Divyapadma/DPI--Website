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

// Fallback for getSiteSettings() when the DB row's privacy_policy is empty
// — also the real initial content, seeded verbatim into
// supabase/schema.sql so a fresh Supabase project and local dev (no
// Supabase configured yet) both show the same real policy rather than
// placeholder text. Edit via /admin/privacy-policy once Supabase is
// configured; editing this constant only changes the pre-DB fallback.
// "## Heading" lines and blank-line-separated paragraphs — see
// app/(site)/privacy-policy/page.tsx for how this is parsed.
export const defaultPrivacyPolicy = `Last updated: 25 August 2026

## Who We Are

DPI (Divya Padma Infosystem LLP) is a real estate channel partner helping families find their next home across Greater Noida West, Noida Extension, the Jewar Airport corridor, Aligarh, Ghaziabad, and Uttarakhand. We connect you with trusted developers — we do not build or sell the projects ourselves. This policy explains what information we collect through this website and how we use it.

## Information We Collect

We collect the information you choose to share with us through our forms — the Contact page, a project enquiry form, or a career application. This typically includes your name, phone number, email address, and any message or requirements you add.

We do not collect payment information, government ID numbers, or any other sensitive personal data through this website.

## How We Use Your Information

We use the details you submit to respond to your enquiry, share project and pricing information you've asked about, follow up on your interest by phone, WhatsApp, or email, and process career applications for open roles. If you enquire about a specific project, we may share your contact details with that project's developer solely to help fulfil your enquiry.

## What We Don't Do

We do not sell, rent, or trade your personal information to third parties for their own marketing purposes. We only share your details with the specific developer relevant to a project you've enquired about, or when required by law.

## Cookies & Analytics

This website does not currently use third-party advertising or analytics tracking cookies. The only cookies set are essential, functional cookies required to keep our admin panel login working — these do not track visitors to the public site.

## Data Retention & Security

We retain your information for as long as reasonably necessary to respond to your enquiry and maintain our business records, and take reasonable technical and organisational measures to keep it secure.

## Your Rights

You can ask us to access, correct, or delete the personal information we hold about you at any time by reaching out using the contact details below.

## Third-Party Links

Our website links to external sites, including our social media pages and the websites of developers we partner with. This policy does not cover how those sites handle your information — please review their own privacy policies.

## Changes to This Policy

We may update this policy from time to time as our services or applicable regulations change. The "Last updated" date above reflects the most recent revision.

## Contact Us

For any questions about this policy or your personal information, reach out to us at:

Divya Padma Infosystem LLP
Artha Mart, 4th Floor F-417, Techzone 4, Greater Noida West
Phone: +91 92209 07340
Email: info@divyapadma.com`;

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
