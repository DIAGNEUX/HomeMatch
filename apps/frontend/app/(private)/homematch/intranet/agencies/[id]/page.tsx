import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import AgencyDetail from "@/components/admin/agencies/AgencyDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAgencyDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminRouteGuard>
      <AgencyDetail id={id} />
    </AdminRouteGuard>
  );
}