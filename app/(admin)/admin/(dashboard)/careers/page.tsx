import AdminListPage from "@/components/admin/AdminListPage";
import { getCareerListings } from "@/lib/queries";
import { deleteCareerListing } from "@/lib/mutations";

export default async function AdminCareersPage() {
  const careerListings = await getCareerListings();

  return (
    <AdminListPage
      title="Career Listings"
      description="Manage open positions shown on the Careers page."
      items={careerListings}
      addHref="/admin/careers/new"
      editHref={(c) => `/admin/careers/${c.id}/edit`}
      deleteAction={deleteCareerListing}
      deleteLabel={(c) => c.title}
      columns={[
        { header: "Title", render: (c) => c.title },
        { header: "Department", render: (c) => c.department },
        { header: "Location", render: (c) => c.location },
        { header: "Type", render: (c) => <span className="capitalize">{c.employmentType.replace("-", " ")}</span> },
      ]}
    />
  );
}
