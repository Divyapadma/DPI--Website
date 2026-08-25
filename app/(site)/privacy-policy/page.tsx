import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { getSiteSettings } from "@/lib/queries";

// Content lives in the DB (site_settings.privacy_policy, editable at
// /admin/privacy-policy) — force-dynamic so an edit shows up immediately,
// same reasoning as the homepage (app/(site)/page.tsx) and every other
// admin-managed page in this app.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DPI (Divya Padma Infosystem LLP) collects, uses, and protects the information you share with us.",
};

/**
 * Deliberately not a Markdown renderer — just enough structure for a
 * non-technical admin to write in plain text: a blank line starts a new
 * paragraph, and a line starting with "## " becomes a section heading.
 * See lib/mock-data.ts defaultPrivacyPolicy for the format in practice.
 */
function renderPolicyContent(text: string) {
  const blocks = text.trim().split(/\n\s*\n/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display pt-4 text-xl text-charcoal first:pt-0 sm:text-2xl">
          {block.slice(3).trim()}
        </h2>
      );
    }
    return (
      <p key={i} className="whitespace-pre-line text-sm leading-relaxed text-taupe sm:text-base">
        {block}
      </p>
    );
  });
}

export default async function PrivacyPolicyPage() {
  const { privacyPolicy } = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How we collect, use, and protect the information you share with us."
      />

      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="space-y-5">{renderPolicyContent(privacyPolicy)}</div>
      </section>
    </>
  );
}
