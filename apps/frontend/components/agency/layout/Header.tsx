"use client";

import { Bell } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  const initials = `${user?.firstName?.charAt(0) ?? ""}${user?.lastName?.charAt(0) ?? ""}`;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <div>
        <h1 className="text-xl font-semibold">
          Bonjour {user?.firstName} 👋
        </h1>

        <p className="text-sm text-gray-500">
          Bienvenue sur votre espace agence
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="rounded-lg p-2 transition hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}