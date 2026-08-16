import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
          <div className="flex items-start gap-2 border-b border-gold/30 bg-gold/10 px-5 py-3 text-sm text-gold sm:items-center sm:px-6">
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
