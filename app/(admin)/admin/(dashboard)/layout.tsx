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
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        {!isSupabaseConfigured && (
          <div className="flex items-center gap-2 border-b border-gold/30 bg-gold/10 px-6 py-3 text-sm text-gold">
            <AlertTriangle size={16} />
            Supabase isn&apos;t configured yet — this panel is running unprotected with mock data. Set the env vars
            in .env.local.example to enable real auth and data.
          </div>
        )}
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
