import { notFound } from "next/navigation";
import AdminFormShell from "@/components/admin/AdminFormShell";
import CareerListingForm from "@/components/admin/forms/CareerListingForm";
import { getCareerListingById } from "@/lib/queries";

export default async function EditCareerListingPage({ params }: PageProps<"/admin/careers/[id]/edit">) {
  const { id } = await params;
  const listing = await getCareerListingById(id);
  if (!listing) notFound();

  return (
    <AdminFormShell title={`Edit — ${listing.title}`} backHref="/admin/careers">
      <CareerListingForm listing={listing} />
    </AdminFormShell>
  );
}
