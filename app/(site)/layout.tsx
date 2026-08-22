import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SiteChrome from "@/components/providers/SiteChrome";
import "../globals.css";

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

// Real logo (see app/icon.png, app/apple-icon.png, app/favicon.ico for the
// generated favicon set from this same source) — used directly here rather
// than a self-hosted copy since every other image on this site already
// goes through ImageKit URLs via lib/imagekit-loader.ts.
const LOGO_URL = "https://ik.imagekit.io/divyapadma07/DPI-Logo-PNG.webp";

export const metadata: Metadata = {
  title: {
    default: "DPI | Discovering Landmarks, Delivering Trust",
    template: "%s | DPI",
  },
  description:
    "DPI (Divya Padma Infosystem LLP) is a real estate channel partner helping you discover and secure landmark residential projects across Greater Noida, Ghaziabad, Aligarh, and Uttarakhand, backed by transparency and trust.",
  openGraph: {
    title: "DPI | Discovering Landmarks, Delivering Trust",
    description:
      "DPI (Divya Padma Infosystem LLP) is a real estate channel partner helping you discover and secure landmark residential projects across Greater Noida, Ghaziabad, Aligarh, and Uttarakhand.",
    images: [{ url: LOGO_URL, width: 500, height: 500, alt: "DPI — Divya Padma Infosystem LLP" }],
  },
  twitter: {
    card: "summary",
    title: "DPI | Discovering Landmarks, Delivering Trust",
    images: [LOGO_URL],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <Navbar />
        <main className="flex-1">
          <SiteChrome>{children}</SiteChrome>
        </main>
        <Footer />
      </body>
    </html>
  );
}
