// Shared site-wide nav/contact/social constants — single source of truth for
// Navbar, MobileNavDrawer, and Footer so they can't drift out of sync.
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/SocialIcons";

// The real logo — replaces the "DPI." text wordmark everywhere it used to
// stand in as a placeholder (Navbar, Footer, admin sidebar, Preloader).
//
// This is a locally-hosted, cropped copy of the source ImageKit asset
// (https://ik.imagekit.io/divyapadma07/DPI-Logo-PNG.webp), not the URL
// itself. The source file is a 500x500 canvas where the actual mark (roof
// + "DPI" + "DIVYA PADMA INFOSYSTEM LLP") only fills 42% of its height —
// sizing an <img> box against that source, however large the box, put at
// most ~42% of the box's own height in real visible ink, which is what
// kept reading as "small" through two rounds of pure CSS-size increases.
// public/images/logo.png is the same source cropped to its visible bounds
// (+ a small 4% margin) via sharp — 84% ink-fill instead of 42%, generated
// by a one-off script, not a manual re-edit of the brand mark itself.
export const LOGO_URL = "/images/logo.png";
// Real aspect ratio of the cropped file (293x251) — used wherever a
// precise width needs deriving from a target height (see Footer.tsx).
export const LOGO_ASPECT_RATIO = 293 / 251;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export const CONTACT = {
  address: "Artha Mart, 4th Floor F-417, Techzone 4, Greater Noida West",
  phone: "+91 92209 07340",
  phoneHref: "tel:+919220907340",
  email: "info@divyapadma.com",
  emailHref: "mailto:info@divyapadma.com",
  // Same number as the phone above — no separate WhatsApp number was
  // provided, and using one number for both calls and WhatsApp is standard
  // practice, not a fabricated detail.
  whatsappHref: "https://wa.me/919220907340",
  // Real office coordinates — drives the embedded map on the Contact page.
  latitude: 28.5920999939545,
  longitude: 77.4359085332427,
};

// Real profiles. No LinkedIn URL was given — a "#" placeholder there would
// be the one dead link on an otherwise fully-wired row, so it's left out
// entirely rather than shipped broken; add it back once a real profile
// exists.
export const SOCIALS = [
  { href: "https://www.instagram.com/divyapadmainfosystemllp__/", label: "Instagram", icon: InstagramIcon },
  { href: "https://www.facebook.com/profile.php?id=61584234775153", label: "Facebook", icon: FacebookIcon },
  { href: "https://www.youtube.com/@divyapadmainfosystemllp_1", label: "YouTube", icon: YoutubeIcon },
];
