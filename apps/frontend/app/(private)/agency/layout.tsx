import RoleRouteGuard from "@/components/auth/RoleRouteGuard";
import Header from "@/components/agency/layout/Header";
import Sidebar from "@/components/agency/layout/Sidebar";

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleRouteGuard role="AGENCY" loginPath="/agency-access/login">
      <div className="min-h-screen bg-gray-50">
        <Sidebar />

        <div className="ml-64 flex min-h-screen flex-col">
          <Header />

          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </RoleRouteGuard>
  );
}
