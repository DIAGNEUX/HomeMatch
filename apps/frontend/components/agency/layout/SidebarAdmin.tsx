import SidebarFooter from "./SidebarFooter";
import SidebarLogo from "./SidebarLogo";
import SidebarNavigationAdmin from "./SidebarNavigationAdmin";

export default function SidebarAdmin() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex h-screen w-64 flex-col overflow-y-auto border-r border-surface bg-surface">
      <SidebarLogo href="/homematch/intranet" subtitle="Espace Admin" />

      <SidebarNavigationAdmin />

      <SidebarFooter />
    </aside>
  );
}