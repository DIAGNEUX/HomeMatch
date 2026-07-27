"use client";

import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = `${user?.firstName?.charAt(0) ?? ""}${user?.lastName?.charAt(0) ?? ""}`;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div></div>

      <div className="flex items-center gap-5">
        <button className="rounded-lg p-2 transition hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <div className="group relative">
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {initials}
          </div>

          <div className="invisible absolute right-0 top-full z-40 w-48 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
            <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              <div className="px-3 py-2 text-sm">
                <p className="font-medium text-primary">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              <div className="my-1 h-px bg-gray-100" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}