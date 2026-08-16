import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";

// Separate root layout for the /admin section — deliberately excludes the
// public Navbar/Footer (see app/(site)/layout.tsx) since the CMS shouldn't
// look like the marketing site. Route groups let both layouts share the
// `app/` tree without one wrapping the other.

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DPI Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-ink text-ivory">{children}</body>
    </html>
  );
}
