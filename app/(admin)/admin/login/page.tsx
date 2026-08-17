"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setError("Admin login isn't configured yet — Supabase credentials are pending.");
      return;
    }

    setLoading(true);
    const form = new FormData(e.currentTarget);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  const inputClass =
    "focus-glow w-full min-h-[44px] rounded-xl border border-line bg-ivory px-4 py-3 text-base text-charcoal outline-none transition-colors placeholder:text-taupe/60";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5 sm:px-6">
      <div className="glass-card w-full max-w-sm rounded-2xl p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-terracotta/40 text-terracotta">
            <Lock size={20} />
          </div>
          <h1 className="font-display mt-4 text-2xl text-charcoal">Admin Sign In</h1>
          <p className="mt-1 text-sm text-taupe">DPI content management panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" required placeholder="Email Address" className={inputClass} />
          <input name="password" type="password" required placeholder="Password" className={inputClass} />
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-terracotta-soft via-terracotta to-terracotta-deep px-7 py-3 text-sm uppercase tracking-[0.15em] text-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_20px_-6px_rgba(168,95,66,0.5)] transition-all hover:brightness-105 active:brightness-95 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
        </form>

        <Link
          href="/admin/forgot-password"
          className="mt-5 block text-center text-sm text-taupe hover:text-terracotta"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
