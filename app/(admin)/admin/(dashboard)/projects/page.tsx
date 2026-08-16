import AdminListPage from "@/components/admin/AdminListPage";
import { projects } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export default function AdminProjectsPage() {
  return (
    <AdminListPage
      title="Projects"
      description="Manage residential projects across all locations."
      items={projects}
      columns={[
        { header: "Title", render: (p) => p.title },
        { header: "Location", render: (p) => `${p.location.area}, ${p.location.city}` },
        { header: "Status", render: (p) => <span className="capitalize">{p.status.replace(/-/g, " ")}</span> },
        { header: "Price From", render: (p) => formatINR(p.priceFromLakhs) },
      ]}
    />
  );
}
