"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient();
    await supabase?.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-6 flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-taupe transition-colors hover:bg-paper hover:text-charcoal active:bg-paper active:text-charcoal"
    >
      <LogOut size={17} />
      Sign Out
    </button>
  );
}
