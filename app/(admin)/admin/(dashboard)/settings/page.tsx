"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function AdminSettingsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setError("Something went wrong — please try again.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSuccess(true);
    e.currentTarget.reset();
  }

  const inputClass =
    "focus-glow w-full min-h-[44px] rounded-xl border border-line bg-ivory px-4 py-3 text-base text-charcoal outline-none transition-colors placeholder:text-taupe/60";

  return (
    <div>
      <h1 className="font-display text-xl text-charcoal sm:text-2xl">Settings</h1>
      <p className="mt-1 text-sm text-taupe">Manage your admin account.</p>

      <div className="glass-card mt-6 max-w-md rounded-2xl p-6 sm:mt-8 sm:p-7">
        <div className="flex items-center gap-2">
          <KeyRound size={18} className="text-terracotta" />
          <h2 className="font-display text-lg text-charcoal">Change Password</h2>
        </div>
        <p className="mt-1 text-sm text-taupe">You&apos;re already signed in, so no current password is needed.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="New Password"
            className={inputClass}
          />
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            placeholder="Confirm New Password"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:bg-terracotta-soft disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Update Password
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-terracotta">Password updated.</p>}
        </form>
      </div>
    </div>
  );
}
