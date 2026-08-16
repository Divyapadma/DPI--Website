import AdminFormShell from "@/components/admin/AdminFormShell";
import ProjectForm from "@/components/admin/forms/ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminFormShell title="New Project" backHref="/admin/projects">
      <ProjectForm />
    </AdminFormShell>
  );
}
