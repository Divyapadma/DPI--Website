import { Pencil, Plus, Trash2 } from "lucide-react";

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

export default function AdminListPage<T extends { id: string }>({
  title,
  description,
  items,
  columns,
}: {
  title: string;
  description: string;
  items: T[];
  columns: Column<T>[];
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-xl text-ivory sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-mist">{description}</p>
        </div>
        {/* TODO: wire up create/edit/delete once the Supabase schema + Storage buckets are in place. */}
        <button className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-ink transition-colors hover:bg-gold-soft active:bg-gold-soft sm:w-auto">
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* overflow-x-auto lets a wide table scroll horizontally on narrow
          screens instead of breaking the page layout; -webkit-overflow-scrolling
          isn't needed since modern mobile Safari/Chrome scroll this natively. */}
      <div className="glass-card mt-6 overflow-x-auto rounded-2xl sm:mt-8">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-[0.15em] text-mist">
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
                  <td key={col.header} className="px-4 py-4 whitespace-nowrap text-ivory/90 sm:px-6">
                    {col.render(item)}
                  </td>
                ))}
                <td className="px-4 py-4 sm:px-6">
                  <div className="flex gap-1 text-mist">
                    <button
                      aria-label="Edit"
                      className="rounded-lg p-2.5 transition-colors hover:bg-surface-2 hover:text-gold active:bg-surface-2 active:text-gold"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      aria-label="Delete"
                      className="rounded-lg p-2.5 transition-colors hover:bg-surface-2 hover:text-red-400 active:bg-surface-2 active:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && <p className="px-6 py-10 text-center text-sm text-mist">No records yet.</p>}
      </div>
    </div>
  );
}
