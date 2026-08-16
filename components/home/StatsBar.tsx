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

export default function StatsBar() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-5 py-12 sm:gap-x-6 sm:px-6 sm:py-14 lg:grid-cols-4 lg:gap-8 lg:px-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="min-w-0 text-center"
          >
            <p className="font-display text-[clamp(1.5rem,5vw,3rem)] leading-tight text-gold">
              <Counter value={stat.value} />
              {stat.suffix}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-mist sm:text-xs sm:tracking-[0.2em]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
