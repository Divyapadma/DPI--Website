import { Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/mock-data";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-gradient-to-b from-ivory via-cream to-ivory">
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <ScrollReveal>
          <SectionHeading eyebrow="Testimonials" title="What Our Homeowners Say" />
        </ScrollReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.1}>
              <div className="glass-card h-full rounded-2xl p-7">
                <Quote className="text-terracotta" size={28} />
                <p className="mt-4 text-sm leading-relaxed text-charcoal/90">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="font-display text-base text-charcoal">{t.name}</p>
                    <p className="text-xs text-taupe">{t.role}</p>
                  </div>
                  {t.rating && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} size={14} className="fill-terracotta text-terracotta" />
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
