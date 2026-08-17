// Shared site-wide nav/contact/social constants — single source of truth for
// Navbar, MobileNavDrawer, and Footer so they can't drift out of sync.
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/icons/SocialIcons";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export const CONTACT = {
  address: "DPI Business Tower, Baner Road, Pune, Maharashtra 411045",
  phone: "+91 00000 00000",
  phoneHref: "tel:+910000000000",
  email: "info@dpi.com",
  emailHref: "mailto:info@dpi.com",
};

export const SOCIALS = [
  { href: "#", label: "Instagram", icon: InstagramIcon },
  { href: "#", label: "Facebook", icon: FacebookIcon },
  { href: "#", label: "LinkedIn", icon: LinkedinIcon },
  { href: "#", label: "YouTube", icon: YoutubeIcon },
];
