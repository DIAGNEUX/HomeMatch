"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  Heart,
  LogOut,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const publicLinks = [
  {
    href: "/",
    label: "Accueil",
  },
  {
    href: "/#about",
    label: "À propos",
  },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="flex h-20 w-full items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Accueil HomeMatch">
          <Image
            src="/images/logos/homematch-logo.png"
            alt="HomeMatch"
            width={104}
            height={58}
            priority
            className="navbar-logo"
          />
        </Link>

        <nav className="hidden items-center gap-10 text-base font-medium text-[#3B556D] md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#0B162C]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isAuthenticated ? (
            <>
              <Button
                asChild
                variant="outline"
                className="h-10 cursor-pointer rounded-2xl border-[#0B162C] bg-white px-4 text-sm font-medium text-[#3B556D] hover:bg-gray-50 hover:text-[#0B162C]"
              >
                <Link href="/login">Se connecter</Link>
              </Button>

              <Button
                asChild
                className="h-10 cursor-pointer rounded-2xl bg-[#0B162C] px-4 text-sm font-semibold text-white hover:bg-[#1C2942]"
              >
                <Link href="/agency-access">Espace Agence</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 cursor-pointer rounded-2xl border-gray-200 bg-white px-4 text-sm font-medium text-[#3B556D] hover:bg-gray-50 hover:text-[#0B162C]"
                >
                  Bonjour {user?.firstName}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user?.role === "USER" && (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/account")}>
                      <UserRound size={14} className="mr-2" />
                      Mon compte
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/account/visits")}
                    >
                      <CalendarDays size={14} className="mr-2" />
                      Mes demandes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/account/favorites")}
                    >
                      <Heart size={14} className="mr-2" />
                      Mes favoris
                    </DropdownMenuItem>
                  </>
                )}

                {user?.role === "AGENCY" && (
                  <DropdownMenuItem onClick={() => router.push("/agency")}>
                    <Building2 size={14} className="mr-2" />
                    Mon agence
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut size={14} className="mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
