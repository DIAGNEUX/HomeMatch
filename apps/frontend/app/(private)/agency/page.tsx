"use client";

import { useAuth } from "@/hooks/useAuth";

import PageHeader from "@/components/agency/common/PageHeader";
import QuickActions from "@/components/agency/dashboard/QuickActions";
import WelcomeCard from "@/components/agency/dashboard/WelcomeCard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null; 

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Bienvenue sur votre espace agence."
      />

      <WelcomeCard firstName={user.firstName} />

      <QuickActions />
    </>
  );
}