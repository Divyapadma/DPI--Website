import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export default function AdminFormShell({
  title,
  backHref,
  children,
}: {
  title: string;
  backHref: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-taupe hover:text-terracotta">
        <ArrowLeft size={14} />
        Back
      </Link>
      <h1 className="font-display mt-3 text-xl text-charcoal sm:text-2xl">{title}</h1>
      <div className="mt-6 max-w-3xl sm:mt-8">{children}</div>
    </div>
  );
}
