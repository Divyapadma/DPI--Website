"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

type Status = "checking" | "ready" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      // Deferred into a callback (not called synchronously in the effect
      // body) — same reasoning as the timer fallback below.
      const t = setTimeout(() => setStatus("invalid"), 0);
      return () => clearTimeout(t);
    }

    // The reset-link redirect carries the recovery session in the URL
    // hash, which Supabase's client parses and turns into a real session
    // as it initializes — signaled by a PASSWORD_RECOVERY auth event. As a
    // fallback (e.g. if the event already fired before this listener
    // attached), also check for an existing session directly.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStatus("ready");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus((s) => (s === "checking" ? "ready" : s));
    });

    const timer = setTimeout(() => {
      setStatus((s) => (s === "checking" ? "invalid" : s));
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

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
            <KeyRound size={20} />
          </div>
          <h1 className="font-display mt-4 text-2xl text-charcoal">Set New Password</h1>
        </div>

        {status === "checking" && (
          <p className="flex items-center justify-center gap-2 text-sm text-taupe">
            <Loader2 size={16} className="animate-spin" />
            Verifying your reset link&hellip;
          </p>
        )}

        {status === "invalid" && (
          <div className="text-center">
            <p className="text-sm text-red-400">
              This reset link is invalid or has expired — reset links only work once and expire after a while.
            </p>
            <Link
              href="/admin/forgot-password"
              className="mt-4 inline-block text-sm text-terracotta hover:underline"
            >
              Request a new link
            </Link>
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3 text-sm uppercase tracking-[0.15em] text-cream transition-all hover:bg-terracotta-soft active:bg-terracotta-soft disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Update Password
            </button>
            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
