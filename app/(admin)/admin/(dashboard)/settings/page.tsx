import ChangePasswordForm from "@/components/admin/forms/ChangePasswordForm";
import SiteSettingsForm from "@/components/admin/forms/SiteSettingsForm";
import { getSiteSettings } from "@/lib/queries";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-xl text-charcoal sm:text-2xl">Settings</h1>
      <p className="mt-1 text-sm text-taupe">Manage homepage content and your admin account.</p>

      <div className="mt-6 max-w-2xl sm:mt-8">
        <SiteSettingsForm settings={settings} />
      </div>

      <div className="mt-6 max-w-md sm:mt-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
