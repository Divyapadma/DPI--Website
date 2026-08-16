"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import type { MutationResult } from "@/lib/mutations";

export default function DeleteButton({
  id,
  label,
  action,
}: {
  id: string;
  /** Shown in the confirm prompt, e.g. the project title. */
  label: string;
  action: (id: string) => Promise<MutationResult>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (!window.confirm(`Delete "${label}"? This can't be undone.`)) return;
    setError("");
    startTransition(async () => {
      const result = await action(id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <span className="relative">
      <button
        aria-label="Delete"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-lg p-2.5 transition-colors hover:bg-paper hover:text-red-400 active:bg-paper active:text-red-400 disabled:opacity-50"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
      {error && (
        <span className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-line bg-paper p-2 text-xs text-red-400 shadow-soft">
          {error}
        </span>
      )}
    </span>
  );
}
