"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/lib/mock-data";

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
 * A clean, minimal credibility strip — confident typography and generous
 * whitespace, not a decorated dashboard widget. Pulled back from an earlier
 * pass (gradient card backgrounds, icon badges, gradient-fill numbers) that
 * read as "SaaS dashboard" rather than editorial. Thin dividers between
 * each stat is the one structural device, in keeping with a classic
 * editorial "by the numbers" convention.
 */
export default function StatsBar() {
  return (
    <section className="border-y border-line bg-ivory">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-line px-5 py-14 sm:px-6 sm:py-16 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:px-10 lg:py-20">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex flex-col items-center gap-2 px-4 py-8 text-center lg:py-0"
          >
            <p className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-none text-terracotta">
              <Counter value={stat.value} />
              {stat.suffix}
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-taupe sm:text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
