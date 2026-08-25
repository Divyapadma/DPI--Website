"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Building2, Heart, MapPin, type LucideIcon } from "lucide-react";
import { stats } from "@/lib/mock-data";

// Presentation-only mapping, kept out of the data layer (lib/mock-data.ts /
// StatItem) on purpose — which icon a stat gets is a display decision, not
// a fact about the stat itself. Falls back to MapPin for any future stat
// whose label isn't one of these four rather than rendering nothing.
const ICONS: Record<string, LucideIcon> = {
  "Cities Present": MapPin,
  "Projects Partnered": Building2,
  "Happy Families": Heart,
  "Years of Experience": Award,
};

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const numeric = Number(value.replace(/,/g, ""));
  const [display, setDisplay] = useState(() => (Number.isNaN(numeric) ? value : "0"));

  useEffect(() => {
    if (!inView || Number.isNaN(numeric)) return;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(numeric * eased).toLocaleString("en-IN"));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, numeric, value]);

  return <span ref={ref}>{display}</span>;
}

/**
 * Third pass on this component. The first pull-back (plain divided text
 * row) read as flat/boring; the second pass fixed that but overcorrected —
 * py-8/10 padding and a 5xl number made each tile bigger than it needed to
 * be for four numbers in a strip. This keeps the same devices (card, icon
 * badge, count-up) at a genuinely compact scale, and gives the section its
 * own .stats-gradient background specifically so it reads as visibly
 * warmer/deeper than each card's own near-white .glass-card gradient —
 * against a flat bg-ivory the two were close enough in tone that the cards
 * barely separated from the section behind them.
 */
export default function StatsBar() {
  return (
    <section className="stats-gradient border-y border-line">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = ICONS[stat.label] ?? MapPin;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center sm:gap-2.5 sm:px-4 sm:py-5"
              >
                {/* Soft radial glow behind the icon via a tinted box-shadow
                    (contained to this badge, not a section-wide blurred
                    blob) rather than a flat icon-on-white circle. */}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-terracotta/20 via-terracotta/10 to-transparent shadow-[0_0_14px_-3px_rgba(166,103,74,0.4)] sm:h-10 sm:w-10">
                  <Icon size={16} className="text-terracotta" strokeWidth={1.75} />
                </span>
                <p className="font-display text-[clamp(1.375rem,3.2vw,1.875rem)] leading-none text-terracotta">
                  <Counter value={stat.value} />
                  {stat.suffix}
                </p>
                <p className="text-[9.5px] font-medium uppercase leading-tight tracking-[0.15em] text-taupe sm:text-[10.5px]">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
