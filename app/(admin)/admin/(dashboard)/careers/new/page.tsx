import AdminFormShell from "@/components/admin/AdminFormShell";
import CareerListingForm from "@/components/admin/forms/CareerListingForm";

export default function NewCareerListingPage() {
  return (
    <AdminFormShell title="New Career Listing" backHref="/admin/careers">
      <CareerListingForm />
    </AdminFormShell>
  );
}
