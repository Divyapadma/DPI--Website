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

export const metadata: Metadata = {
  title: {
    default: "DPI | Building Landmarks, Delivering Trust",
    template: "%s | DPI",
  },
  description:
    "DPI is a multi-city real estate developer delivering landmark residential projects built on quality, transparency, and trust.",
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
