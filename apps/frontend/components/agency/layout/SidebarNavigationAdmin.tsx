"use client";
import SidebarItem from "./SidebarItem";
import { adminNavigation } from "@/config/admin-navigation";

export default function SidebarNavigationAdmin() {
  return (
    <nav className="flex flex-1 flex-col gap-2 p-4">
      {adminNavigation.map((item) => (
        <SidebarItem key={item.href} {...item} />
      ))}
    </nav>
  );
}
