"use client";

import { useState, type FormEvent } from "react";
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
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ivory outline-none transition-colors placeholder:text-mist/60 focus:border-gold";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="glass-card w-full max-w-sm rounded-2xl p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
            <Lock size={20} />
          </div>
          <h1 className="font-display mt-4 text-2xl text-ivory">Admin Sign In</h1>
          <p className="mt-1 text-sm text-mist">DPI content management panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" required placeholder="Email Address" className={inputClass} />
          <input name="password" type="password" required placeholder="Password" className={inputClass} />
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm uppercase tracking-[0.15em] text-ink transition-all hover:bg-gold-soft disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
        </form>
      </div>
    </div>
  );
}
