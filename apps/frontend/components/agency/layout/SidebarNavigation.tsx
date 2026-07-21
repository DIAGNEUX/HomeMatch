"use client";
import SidebarItem from "./SidebarItem";
import { agencyNavigation } from "@/config/agency-navigation";

export default function SidebarNavigation() {
  return (
    <nav className="flex flex-1 flex-col gap-2 p-4">
      {agencyNavigation.map((item) => (
        <SidebarItem
          key={item.href}
          {...item}
        />
      ))}
    </nav>
  );
}