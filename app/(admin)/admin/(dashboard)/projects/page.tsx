import AdminListPage from "@/components/admin/AdminListPage";
import { getProjects } from "@/lib/queries";
import { deleteProject } from "@/lib/mutations";
import { formatProjectPrice } from "@/lib/utils";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <AdminListPage
      title="Projects"
      description="Manage residential projects across all locations."
      items={projects}
      addHref="/admin/projects/new"
      editHref={(p) => `/admin/projects/${p.id}/edit`}
      deleteAction={deleteProject}
      deleteLabel={(p) => p.title}
      columns={[
        { header: "Title", render: (p) => p.title },
        { header: "Location", render: (p) => `${p.location.area}, ${p.location.city}` },
        { header: "Status", render: (p) => <span className="capitalize">{p.status.replace(/-/g, " ")}</span> },
        { header: "Price", render: (p) => formatProjectPrice(p) },
      ]}
    />
  );
}
