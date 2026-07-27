import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import AgenciesTable from "@/components/admin/agencies/AgenciesTable";

export default function AdminAgenciesPage() {
  return (
    <AdminRouteGuard>
      <AgenciesTable />
    </AdminRouteGuard>
  );
}