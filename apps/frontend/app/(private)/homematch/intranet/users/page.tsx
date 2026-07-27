import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import UsersTable from "@/components/admin/users/UsersTable";

export default function AdminUsersPage() {
  return (
    <AdminRouteGuard>
      <UsersTable />
    </AdminRouteGuard>
  );
}