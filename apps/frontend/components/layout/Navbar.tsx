"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          HomeMatch
        </Link>

        <nav className="flex items-center gap-6">

          <Link href="/">
            Accueil
          </Link>

          <Link href="/properties">
            Annonces
          </Link>
          
        {!isAuthenticated ? (
          <>
            <Link href="/login">
              Connexion
            </Link>

            <Link
              href="/agency-access"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Espace Agence
            </Link>
          </>
        ) : (
          <>
            <span className="font-medium">
              Bonjour {user?.firstName}
            </span>

            {user?.role === "AGENCY" && (
              <Link
                href="/agency"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Mon Agence
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="rounded-lg bg-red-500 px-4 py-2 text-white"
            >
              Déconnexion
            </button>
          </>
        )}
        </nav>
      </div>
    </header>
  );
}