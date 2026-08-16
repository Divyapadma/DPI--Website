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
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-28">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold sm:text-xs">{eyebrow}</p>
        <h1 className="font-display max-w-3xl text-[clamp(1.875rem,6vw,3.75rem)] leading-tight text-ivory break-words">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist sm:mt-5 sm:text-base">{description}</p>
        )}
      </div>
    </section>
  );
}
