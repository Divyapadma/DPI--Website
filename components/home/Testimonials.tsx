import { Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/mock-data";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Testimonials() {
  return (
    <section className="border-y border-line bg-surface/60">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <ScrollReveal>
          <SectionHeading eyebrow="Testimonials" title="What Our Homeowners Say" />
        </ScrollReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.1}>
              <div className="glass-card h-full rounded-2xl p-7">
                <Quote className="text-gold" size={28} />
                <p className="mt-4 text-sm leading-relaxed text-ivory/90">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="font-display text-base text-ivory">{t.name}</p>
                    <p className="text-xs text-mist">{t.role}</p>
                  </div>
                  {t.rating && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} size={14} className="fill-gold text-gold" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
