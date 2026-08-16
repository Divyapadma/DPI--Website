import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/icons/SocialIcons";

const EXPLORE_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  { href: "#", label: "Instagram", icon: InstagramIcon },
  { href: "#", label: "Facebook", icon: FacebookIcon },
  { href: "#", label: "LinkedIn", icon: LinkedinIcon },
  { href: "#", label: "YouTube", icon: YoutubeIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="font-display text-2xl text-ivory">
              DPI<span className="text-gold">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
              Building landmarks across cities — delivering homes defined by quality, transparency, and lasting
              trust.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg text-gold">Explore</h3>
            <ul className="mt-4 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-mist transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg text-gold">Head Office</h3>
            <ul className="mt-4 space-y-4 text-sm text-mist">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                <span>DPI Business Tower, Baner Road, Pune, Maharashtra 411045</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="shrink-0 text-gold" />
                <a href="tel:+910000000000" className="hover:text-gold">
                  +91 00000 00000
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="shrink-0 text-gold" />
                <a href="mailto:info@dpi.com" className="hover:text-gold">
                  info@dpi.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg text-gold">RERA</h3>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Registration numbers for each project are available on the respective project pages and on request.
            </p>
          </div>
        </div>

        <div className="divider-gold mt-14 opacity-40" />

        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-xs text-mist md:flex-row">
          <p>&copy; {new Date().getFullYear()} DPI. All rights reserved.</p>
          <p>Crafted with intent, built to last.</p>
        </div>
      </div>
    </footer>
  );
}
