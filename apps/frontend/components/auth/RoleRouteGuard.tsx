"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/auth";

interface RoleRouteGuardProps {
  children: ReactNode;
  role: User["role"];
  loginPath: string;
}

export default function RoleRouteGuard({
  children,
  role,
  loginPath,
}: RoleRouteGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(loginPath);
      return;
    }

    if (user?.role !== role) {
      router.replace("/access-denied");
    }
  }, [isAuthenticated, loading, loginPath, role, router, user?.role]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== role) {
    return null;
  }

  return <>{children}</>;
}
