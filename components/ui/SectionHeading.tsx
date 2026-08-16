import { cn } from "@/lib/utils";
import SplitHeading from "@/components/ui/SplitHeading";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl px-1", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-terracotta sm:text-xs sm:tracking-[0.3em]">
          {eyebrow}
        </p>
      )}
      <SplitHeading
        as="h2"
        text={title}
        splitType="words"
        className="font-display text-[clamp(1.5rem,5vw,3rem)] leading-tight text-charcoal break-words"
      />
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-taupe sm:mt-4 sm:text-base">{description}</p>
      )}
    </div>
  );
}
