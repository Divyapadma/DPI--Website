import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import type { MutationResult } from "@/lib/mutations";

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

export default function AdminListPage<T extends { id: string }>({
  title,
  description,
  items,
  columns,
  addHref,
  editHref,
  deleteAction,
  deleteLabel,
}: {
  title: string;
  description: string;
  items: T[];
  columns: Column<T>[];
  /** Where "Add New" links to, e.g. "/admin/projects/new". */
  addHref: string;
  /** Per-row edit link, e.g. (item) => `/admin/projects/${item.id}/edit`. */
  editHref: (item: T) => string;
  /** Server action to delete a row by id — see lib/mutations.ts. */
  deleteAction: (id: string) => Promise<MutationResult>;
  /** Shown in the delete confirm prompt. */
  deleteLabel: (item: T) => string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-xl text-charcoal sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-taupe">{description}</p>
        </div>
        <Link
          href={addHref}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-cream transition-colors hover:bg-terracotta-soft active:bg-terracotta-soft sm:w-auto"
        >
          <Plus size={16} />
          Add New
        </Link>
      </div>

      {/* overflow-x-auto lets a wide table scroll horizontally on narrow
          screens instead of breaking the page layout; -webkit-overflow-scrolling
          isn't needed since modern mobile Safari/Chrome scroll this natively. */}
      <div className="glass-card mt-6 overflow-x-auto rounded-2xl sm:mt-8">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-[0.15em] text-taupe">
              {columns.map((col) => (
                <th key={col.header} className="whitespace-nowrap px-4 py-4 font-normal sm:px-6">
                  {col.header}
                </th>
              ))}
              <th className="whitespace-nowrap px-4 py-4 font-normal sm:px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-line/60 last:border-0">
                {columns.map((col) => (
                  <td key={col.header} className="px-4 py-4 whitespace-nowrap text-charcoal/90 sm:px-6">
                    {col.render(item)}
                  </td>
                ))}
                <td className="px-4 py-4 sm:px-6">
                  <div className="flex gap-1 text-taupe">
                    <Link
                      href={editHref(item)}
                      aria-label="Edit"
                      className="rounded-lg p-2.5 transition-colors hover:bg-paper hover:text-terracotta active:bg-paper active:text-terracotta"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteButton id={item.id} label={deleteLabel(item)} action={deleteAction} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-taupe">
            No records yet —{" "}
            <Link href={addHref} className="text-terracotta hover:underline">
              add the first one
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
