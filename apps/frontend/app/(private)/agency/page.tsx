"use client";

import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/agency/common/PageHeader";
import QuickActions from "@/components/agency/dashboard/QuickActions";
import WelcomeCard from "@/components/agency/dashboard/WelcomeCard";
import DashboardListingCard from "@/components/agency/dashboard/DashboardListingCard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const listingItems = [
    {
      title: "Appartement 3 pièces - Lyon 3",
      location: "Lyon 3ème",
      price: "320 000 €",
      type: "Vente",
      status: "En cours",
    },
    {
      title: "Villa familiale - Annecy",
      location: "Annecy",
      price: "1 250 000 €",
      type: "Vente",
      status: "Nouveau",
    },
    {
      title: "Studio à louer - Grenoble",
      location: "Grenoble",
      price: "650 €/mois",
      type: "Location",
      status: "Disponible",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord"
        description="Bienvenue sur votre espace agence HomeMatch."
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <div className="min-w-0 space-y-6">
          <WelcomeCard firstName={user.firstName} />
          <DashboardListingCard title="Dernières annonces" items={listingItems} />
        </div>

        <QuickActions />
      </div>
    </div>
  );
}
