import AdminListPage from "@/components/admin/AdminListPage";
import { careerListings } from "@/lib/mock-data";

export default function AdminCareersPage() {
  return (
    <AdminListPage
      title="Career Listings"
      description="Manage open positions shown on the Careers page."
      items={careerListings}
      columns={[
        { header: "Title", render: (c) => c.title },
        { header: "Department", render: (c) => c.department },
        { header: "Location", render: (c) => c.location },
        { header: "Type", render: (c) => <span className="capitalize">{c.employmentType.replace("-", " ")}</span> },
      ]}
    />
  );
}
