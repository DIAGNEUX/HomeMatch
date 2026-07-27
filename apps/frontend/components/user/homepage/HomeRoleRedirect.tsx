"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

interface HomeRoleRedirectProps {
  children: React.ReactNode;
}

export default function HomeRoleRedirect({ children }: HomeRoleRedirectProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user?.role === "AGENCY") {
      router.replace("/agency");
      return;
    }

    if (user?.role === "ADMIN") {
      router.replace("/homematch/intranet");
    }
  }, [loading, router, user?.role]);

  if (loading || user?.role === "AGENCY" || user?.role === "ADMIN") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return <>{children}</>;
}
