"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export default function SidebarItem({
  href,
  label,
  icon: Icon,
  exact = false,
}: SidebarItemProps) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-3 rounded-xl px-4 py-3
        text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-primary text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
      `}
    >
      <Icon
        size={20}
        className="transition-transform duration-200 group-hover:scale-110"
      />

      <span>{label}</span>
    </Link>
  );
}