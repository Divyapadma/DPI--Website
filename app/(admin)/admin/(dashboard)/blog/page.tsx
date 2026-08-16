import AdminListPage from "@/components/admin/AdminListPage";
import { blogPosts } from "@/lib/mock-data";

export default function AdminBlogPage() {
  return (
    <AdminListPage
      title="Blog Posts"
      description="Manage articles published to the DPI Journal."
      items={blogPosts}
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
