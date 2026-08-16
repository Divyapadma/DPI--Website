import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-gold text-ink hover:bg-gold-soft",
  outline: "border border-gold/50 text-gold hover:border-gold hover:bg-gold/10",
  ghost: "text-ivory hover:text-gold",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm uppercase tracking-[0.15em] transition-all duration-300";

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variantStyles[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={cn(base, variantStyles[variant], className)}>
      {children}
    </Link>
  );
}
