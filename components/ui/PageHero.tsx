import SplitHeading from "@/components/ui/SplitHeading";

export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="surface-gradient relative overflow-hidden border-b border-line">
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-28">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-terracotta sm:text-xs">{eyebrow}</p>
        <SplitHeading
          as="h1"
          text={title}
          splitType="words"
          trigger="mount"
          className="font-display max-w-3xl text-[clamp(1.875rem,6vw,3.75rem)] leading-tight text-charcoal break-words"
        />
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-taupe sm:mt-5 sm:text-base">{description}</p>
        )}
      </div>
    </section>
  );
}
