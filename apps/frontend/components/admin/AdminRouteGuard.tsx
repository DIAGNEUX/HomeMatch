"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/homematch/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router, user?.role]);

  if (loading || !isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}