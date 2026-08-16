"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

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
    const email = String(form.get("email") ?? "");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setLoading(false);

    // Always show the same "check your email" state regardless of whether
    // the address exists — doesn't leak which emails have admin accounts.
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  const inputClass =
    "focus-glow w-full min-h-[44px] rounded-xl border border-line bg-ivory px-4 py-3 text-base text-charcoal outline-none transition-colors placeholder:text-taupe/60";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5 sm:px-6">
      <div className="glass-card w-full max-w-sm rounded-2xl p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-terracotta/40 text-terracotta">
            <Mail size={20} />
          </div>
          <h1 className="font-display mt-4 text-2xl text-charcoal">Reset Password</h1>
          <p className="mt-1 text-sm text-taupe">We&apos;ll email you a link to set a new one.</p>
        </div>

        {sent ? (
          <p className="text-center text-sm text-charcoal">
            If an account exists for that email, a reset link is on its way — check your inbox (and spam folder).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="email" type="email" required placeholder="Email Address" className={inputClass} />
            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3 text-sm uppercase tracking-[0.15em] text-cream transition-all hover:bg-terracotta-soft active:bg-terracotta-soft disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Send Reset Link
            </button>
            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </form>
        )}

        <Link
          href="/admin/login"
          className="mt-5 flex items-center justify-center gap-1.5 text-sm text-taupe hover:text-terracotta"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
