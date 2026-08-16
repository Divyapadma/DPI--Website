import { notFound } from "next/navigation";
import AdminFormShell from "@/components/admin/AdminFormShell";
import BlogPostForm from "@/components/admin/forms/BlogPostForm";
import { getBlogPostById } from "@/lib/queries";

export default async function EditBlogPostPage({ params }: PageProps<"/admin/blog/[id]/edit">) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <AdminFormShell title={`Edit — ${post.title}`} backHref="/admin/blog">
      <BlogPostForm post={post} />
    </AdminFormShell>
  );
}
