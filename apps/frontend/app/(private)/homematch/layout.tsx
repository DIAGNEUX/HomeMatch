import Header from "@/components/agency/layout/Header";
import SidebarAdmin from "@/components/agency/layout/SidebarAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarAdmin />

      <div className="ml-64 flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
