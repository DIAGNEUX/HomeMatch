"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function SidebarFooter() {
  const { user, logout } = useAuth();

  const router = useRouter();


  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="border-t p-4">
      <div className="mb-4">
        <p className="font-semibold">
          {user?.firstName} {user?.lastName}
        </p>

        <p className="text-sm text-gray-500">
          Agence
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={20} />

        Déconnexion
      </button>
    </div>
  );
}