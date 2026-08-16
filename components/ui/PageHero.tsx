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
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
        <h1 className="font-display max-w-3xl text-4xl leading-tight text-ivory sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist">{description}</p>}
      </div>
    </section>
  );
}
