"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/** Searchable, animated city dropdown — deliberately not a native <select>. */
export default function CityCombobox({
  cities,
  value,
  onChange,
}: {
  cities: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const filtered = cities.filter((c) => c.toLowerCase().includes(query.toLowerCase()));

  function select(v: string) {
    onChange(v);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() =>
          setOpen((v) => {
            if (v) setQuery("");
            return !v;
          })
        }
        className={cn(
          "focus-glow flex min-h-[44px] w-full min-w-[190px] items-center justify-between gap-3 rounded-xl border bg-ivory px-4 text-sm transition-colors sm:w-auto sm:rounded-full sm:px-5",
          value !== "all"
            ? "border-terracotta/50 text-terracotta"
            : "border-line text-charcoal hover:border-terracotta/30"
        )}
      >
        <span className="flex items-center gap-2">
          <MapPin size={15} className={value !== "all" ? "text-terracotta" : "text-taupe"} />
          {value === "all" ? "All Locations" : value}
        </span>
        <ChevronDown size={15} className={cn("shrink-0 text-taupe transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-[calc(100%+8px)] z-30 w-full min-w-[240px] overflow-hidden rounded-2xl border border-line bg-paper shadow-soft"
          >
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <Search size={15} className="shrink-0 text-taupe" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city..."
                className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-taupe/60"
              />
            </div>
            <ul className="max-h-60 overflow-y-auto py-1.5">
              <li>
                <button
                  onClick={() => select("all")}
                  className="flex min-h-[40px] w-full items-center justify-between px-4 text-sm text-charcoal transition-colors hover:bg-cream"
                >
                  All Locations
                  {value === "all" && <Check size={15} className="text-terracotta" />}
                </button>
              </li>
              {filtered.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => select(c)}
                    className="flex min-h-[40px] w-full items-center justify-between px-4 text-sm text-charcoal transition-colors hover:bg-cream"
                  >
                    {c}
                    {value === c && <Check size={15} className="text-terracotta" />}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && <li className="px-4 py-3 text-sm text-taupe">No matching cities</li>}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
