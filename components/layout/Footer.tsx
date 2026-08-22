import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, SOCIALS } from "./site-info";

const EXPLORE_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

// Real markets already named elsewhere on the site (Hero, IntroSection) —
// repeated here as their own footer column instead of buried in a
// paragraph, since a channel partner's footer credibility comes from
// exactly this: where we actually operate.
const MARKETS = ["Greater Noida West", "Noida Extension", "Jewar Airport Corridor", "Aligarh", "Ghaziabad", "Uttarakhand"];

/** A deliberate dark editorial band, not a lighter variant of the page above it.
 * Third pass on this component. The first two rounds fixed real problems
 * (tonal flatness, contrast) one property at a time — gradient, then a
 * bolder gradient — without ever addressing the layout itself, which is
 * why "add a gradient" alone kept reading as a checklist item rather than
 * a genuine redesign: four thin columns of short lists in a wide flex
 * container just leaves visible empty space no matter how rich the
 * background is. This pass treats layout, background, and typography as
 * one composition: an oversized watermark wordmark fills the dead space
 * behind the columns on its own terms (decorative, not more content
 * crammed in), vertical hairlines give the grid actual structure instead
 * of relying on gaps alone, and every column now carries a comparable
 * amount of real content instead of one thin column next to bulkier ones. */
export default function Footer() {
  return (
    <footer className="footer-gradient relative overflow-hidden text-cream">
      <div className="grain-texture absolute inset-0 opacity-[0.07]" aria-hidden="true" />
      {/* Thin terracotta seam marking the transition from the light page above. */}
      <div className="divider-terracotta absolute inset-x-0 top-0" />
      {/* Oversized wordmark watermark — the footer's own answer to "empty
          space": decorative weight behind the content rather than padding
          out the columns with more text than the site actually has to
          say. Sized/positioned in rem via clamp() and anchored with a
          positive bottom/right offset, not a negative one bleeding past
          the box — the earlier vw-sized, negative-offset version relied
          on the footer's own overflow-hidden to crop it, which is exactly
          what cut it off rather than containing it. This version is sized
          to fit inside the box at every breakpoint, verified by
          screenshot at 375–1920px. */}
      <p
        aria-hidden="true"
        className="font-display pointer-events-none absolute bottom-2 right-4 select-none text-[clamp(3.5rem,20vw,7rem)] leading-[0.85] text-cream/[0.045] sm:bottom-4 sm:right-6 lg:bottom-6 lg:right-10 lg:text-[clamp(6rem,11vw,10rem)]"
      >
        DPI.
      </p>

      <div className="relative mx-auto max-w-7xl px-5 pt-14 pb-10 sm:px-6 sm:pt-16 lg:px-10 lg:pt-20">
        {/* Below md this was a single-column stack of four full-width blocks
            — technically "responsive" (nothing overflowed) but not actually
            designed for mobile, just the desktop grid collapsed to its
            default. Explore and Markets We Serve are both short, same-
            shape lists (link labels / city names) with nothing that needs
            full width to read cleanly, so on mobile they pair up as their
            own 2-column row instead — real grouping instead of one long
            undifferentiated scroll. Brand (a paragraph + icon row) and
            Head Office (wrapping addresses + icons) keep the full width
            they actually need. From md up this reverts to plain siblings,
            giving the previously-established 2x2 (md) / 4-across (lg)
            layouts unchanged. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-14 sm:gap-x-8 sm:gap-y-12 sm:pb-16 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <p className="max-w-xs text-sm leading-relaxed text-cream/70">
              A real estate channel partner helping families find their next home — transparent guidance,
              trusted service, across every project we represent.
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-cream/45">Follow Us</p>
            <div className="mt-3 flex gap-3">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-all duration-300 hover:border-terracotta-light hover:bg-terracotta-light/10 hover:text-terracotta-light active:border-terracotta-light active:bg-terracotta-light/15 active:text-terracotta-light"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:border-l lg:border-cream/10 lg:pl-10">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/45 sm:tracking-[0.24em]">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 py-1 text-sm text-cream/70 transition-colors hover:text-terracotta-light"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:border-l lg:border-cream/10 lg:pl-10">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/45 sm:tracking-[0.24em]">
              Markets We Serve
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-cream/70">
              {MARKETS.map((market) => (
                <li key={market}>{market}</li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 lg:border-l lg:border-cream/10 lg:pl-10">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/45 sm:tracking-[0.24em]">
              Head Office
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-cream/70">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-terracotta-light" />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="shrink-0 text-terracotta-light" />
                <a href={CONTACT.phoneHref} className="inline-block py-1 hover:text-terracotta-light">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="shrink-0 text-terracotta-light" />
                <a href={CONTACT.emailHref} className="inline-block break-all py-1 hover:text-terracotta-light">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/12 pt-8 text-xs text-cream/55 md:flex-row">
          <p>&copy; {new Date().getFullYear()} DPI. All rights reserved.</p>
          <p>Crafted with intent, trusted for the long run.</p>
        </div>
      </div>
    </footer>
  );
}
