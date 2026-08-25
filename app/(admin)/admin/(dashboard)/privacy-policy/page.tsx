import PrivacyPolicyForm from "@/components/admin/forms/PrivacyPolicyForm";
import { getSiteSettings } from "@/lib/queries";

export default async function AdminPrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-xl text-charcoal sm:text-2xl">Privacy Policy</h1>
      <p className="mt-1 text-sm text-taupe">
        Edit the text shown on the public Privacy Policy page — no code changes needed.
      </p>

      <div className="mt-6 max-w-3xl sm:mt-8">
        <PrivacyPolicyForm settings={settings} />
      </div>
    </div>
  );
}
