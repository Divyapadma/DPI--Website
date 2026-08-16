import AdminListPage from "@/components/admin/AdminListPage";
import { getBlogPosts } from "@/lib/queries";
import { deleteBlogPost } from "@/lib/mutations";

export default async function AdminBlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <AdminListPage
      title="Blog Posts"
      description="Manage articles published to the DPI Journal."
      items={blogPosts}
      addHref="/admin/blog/new"
      editHref={(p) => `/admin/blog/${p.id}/edit`}
      deleteAction={deleteBlogPost}
      deleteLabel={(p) => p.title}
      columns={[
        { header: "Title", render: (p) => p.title },
        { header: "Author", render: (p) => p.author },
        {
          header: "Published",
          render: (p) => new Date(p.publishedAt).toLocaleDateString("en-IN"),
        },
        { header: "Tags", render: (p) => p.tags.join(", ") },
      ]}
    />
  );
}
