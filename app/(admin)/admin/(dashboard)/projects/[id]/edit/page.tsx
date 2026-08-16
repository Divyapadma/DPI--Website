import { notFound } from "next/navigation";
import AdminFormShell from "@/components/admin/AdminFormShell";
import ProjectForm from "@/components/admin/forms/ProjectForm";
import { getProjectById } from "@/lib/queries";

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]/edit">) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <AdminFormShell title={`Edit — ${project.title}`} backHref="/admin/projects">
      <ProjectForm project={project} />
    </AdminFormShell>
  );
}
