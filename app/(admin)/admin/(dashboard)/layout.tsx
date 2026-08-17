import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Applies to every page under this layout (dashboard, projects, blog,
// careers, settings) — a `dynamic` route segment config set on a layout
// cascades to all child pages. These pages read live Supabase data via
// the mutations in lib/mutations.ts, which the admin panel itself just
// wrote, so they must never serve a stale cached copy — force-dynamic
// guarantees a fresh render (and no client-side router-cache staleness
// window either) on every navigation.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: LayoutProps<"/admin">) {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

    if (!user) redirect("/admin/login");
  }

  return (
    <div className="min-h-screen lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        {!isSupabaseConfigured && (
          <div className="flex items-start gap-2 border-b border-terracotta/30 bg-terracotta/10 px-5 py-3 text-sm text-terracotta sm:items-center sm:px-6">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 sm:mt-0" />
            Supabase isn&apos;t configured yet — this panel is running unprotected with mock data. Set the env vars
            in .env.local.example to enable real auth and data.
          </div>
        )}
        <div className="p-5 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
