import SidebarFooter from "./SidebarFooter";
import SidebarLogo from "./SidebarLogo";
import SidebarNavigation from "./SidebarNavigation";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <SidebarLogo />

      <SidebarNavigation />

      <SidebarFooter />
    </aside>
  );
}