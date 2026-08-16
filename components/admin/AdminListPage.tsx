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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ivory">{title}</h1>
          <p className="mt-1 text-sm text-mist">{description}</p>
        </div>
        {/* TODO: wire up create/edit/delete once the Supabase schema + Storage buckets are in place. */}
        <button className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-ink transition-colors hover:bg-gold-soft">
          <Plus size={16} />
          Add New
        </button>
      </div>

      <div className="glass-card mt-8 overflow-x-auto rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-[0.15em] text-mist">
              {columns.map((col) => (
                <th key={col.header} className="px-6 py-4 font-normal">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-line/60 last:border-0">
                {columns.map((col) => (
                  <td key={col.header} className="px-6 py-4 text-ivory/90">
                    {col.render(item)}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <div className="flex gap-3 text-mist">
                    <button aria-label="Edit" className="transition-colors hover:text-gold">
                      <Pencil size={16} />
                    </button>
                    <button aria-label="Delete" className="transition-colors hover:text-red-400">
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
