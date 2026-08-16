import AdminFormShell from "@/components/admin/AdminFormShell";
import BlogPostForm from "@/components/admin/forms/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <AdminFormShell title="New Blog Post" backHref="/admin/blog">
      <BlogPostForm />
    </AdminFormShell>
  );
}
