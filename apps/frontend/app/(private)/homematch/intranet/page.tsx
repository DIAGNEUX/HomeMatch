"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Users, House, ShieldCheck } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/agency/common/PageHeader";
import WelcomeCard from "@/components/agency/dashboard/WelcomeCard";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function AdminIntranetPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // wait for session restore

    if (!isAuthenticated) {
      router.replace("/homematch/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router, user?.role]);

  if (loading) return null;

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  const stats = [
    {
      title: "Utilisateurs",
      value: "128",
      label: "Comptes actifs",
      icon: Users,
      accent: true,
    },
    {
      title: "Agences",
      value: "24",
      label: "Partenaires enregistrés",
      icon: Building2,
    },
    {
      title: "Annonces",
      value: "341",
      label: "Biens en ligne",
      icon: House,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord admin"
        description="Supervision de la plateforme HomeMatch et gestion des utilisateurs, agences et annonces."
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <div className="min-w-0 space-y-6">
          <WelcomeCard firstName={user.firstName} />



          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-primary">Gestion rapide</p>
                <p className="text-sm text-muted">Accédez aux modules principaux de l’intranet.</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Link href="/homematch/intranet/users" className="rounded-2xl border border-gray-200 bg-surface p-4 transition hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-accent/10 p-2 text-primary">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Utilisateurs</p>
                    <p className="text-sm text-muted">Voir et gérer les comptes</p>
                  </div>
                </div>
              </Link>

              <Link href="/homematch/intranet/agencies" className="rounded-2xl border border-gray-200 bg-surface p-4 transition hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-accent/10 p-2 text-primary">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Agences</p>
                    <p className="text-sm text-muted">Suivre les partenaires</p>
                  </div>
                </div>
              </Link>

              <Link href="/homematch/intranet/announcements" className="rounded-2xl border border-gray-200 bg-surface p-4 transition hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-accent/10 p-2 text-primary">
                    <House size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Annonces</p>
                    <p className="text-sm text-muted">Modérer et superviser</p>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>

        <Card className="space-y-6 border-accent/20 shadow-[0_18px_45px_-20px_rgba(11,22,44,0.25)]">
          <div>
            <h2 className="text-lg font-semibold text-primary">Centre de sécurité</h2>
            <p className="mt-1 text-sm text-muted">Vérifiez l’état global de la plateforme.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-surface p-4">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="font-semibold text-primary">Accès administrateur</p>
                <p className="text-sm text-muted">Permissions actives sur l’intranet.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
