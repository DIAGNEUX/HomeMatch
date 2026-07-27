"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Users, House, ShieldCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/agency/common/PageHeader";
//import WelcomeCard from "@/components/agency/dashboard/WelcomeCard";
import Card from "@/components/ui/Card";
import adminService from "@/services/admin.service";
import type { AdminStats } from "@/types/admin";

export default function AdminIntranetPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

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

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") return;

    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.data.data);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques :", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user?.role]);

  if (loading) return null;
  if (!isAuthenticated || user?.role !== "ADMIN") return null;

  const publishedPercent = stats
    ? Math.round((stats.publishedCount / (stats.totalAnnonces || 1)) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord admin"
        description="Supervision de la plateforme HomeMatch et gestion des utilisateurs, agences et annonces."
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <div className="min-w-0 space-y-6">

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="space-y-2">
              <div className="flex items-center gap-2 text-muted">
                <Users size={16} />
                <p className="text-sm">Utilisateurs</p>
              </div>
              <p className="text-2xl font-semibold text-primary">
                {statsLoading ? "…" : stats?.totalUsers}
              </p>
            </Card>

            <Card className="space-y-2">
              <div className="flex items-center gap-2 text-muted">
                <Building2 size={16} />
                <p className="text-sm">Agences</p>
              </div>
              <p className="text-2xl font-semibold text-primary">
                {statsLoading ? "…" : stats?.totalAgencies}
              </p>
            </Card>

            <Card className="space-y-2">
              <div className="flex items-center gap-2 text-muted">
                <House size={16} />
                <p className="text-sm">Annonces</p>
              </div>
              <p className="text-2xl font-semibold text-primary">
                {statsLoading ? "…" : stats?.totalAnnonces}
              </p>
            </Card>
          </div>

          <Card className="space-y-4">
            <p className="text-lg font-semibold text-primary">Dernières agences inscrites</p>

            {statsLoading && <p className="text-sm text-muted">Chargement...</p>}

            {!statsLoading && stats?.recentAgencies.length === 0 && (
              <p className="text-sm text-muted">Aucune agence enregistrée.</p>
            )}

            {!statsLoading && stats && stats.recentAgencies.length > 0 && (
              <div className="space-y-2">
                {stats.recentAgencies.slice(0, 3).map((agency) => (
                  <Link
                    key={agency.id}
                    href={`/homematch/intranet/agencies/${agency.id}`}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-surface p-3 transition hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-primary">{agency.name}</p>
                      <p className="text-sm text-muted">{agency.city}</p>
                    </div>
                    <span className="text-sm text-muted">
                      {agency._count.annonces} annonce
                      {agency._count.annonces > 1 ? "s" : ""}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-6 border-accent/20 shadow-[0_18px_45px_-20px_rgba(11,22,44,0.25)]">
            <div>
              <h2 className="text-lg font-semibold text-primary">Centre de sécurité</h2>
              <p className="mt-1 text-sm text-muted">Vérifiez l'état global de la plateforme.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-surface p-4">
                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-semibold text-primary">Accès administrateur</p>
                  <p className="text-sm text-muted">Permissions actives sur l'intranet.</p>
                </div>
              </div>

              {!statsLoading && (stats?.inactiveUsers ?? 0) > 0 && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                  <div className="rounded-xl bg-red-100 p-2 text-red-700">
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-red-700">
                      {stats?.inactiveUsers} compte
                      {(stats?.inactiveUsers ?? 0) > 1 ? "s" : ""} désactivé
                      {(stats?.inactiveUsers ?? 0) > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-red-600">
                      Suivi de la modération des comptes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <p className="text-lg font-semibold text-primary">Modération des annonces</p>

            {statsLoading ? (
              <p className="text-sm text-muted">Chargement...</p>
            ) : (
              <>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-[#5FC2BA]"
                    style={{ width: `${publishedPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">
                    {stats?.publishedCount} publiée
                    {(stats?.publishedCount ?? 0) > 1 ? "s" : ""}
                  </span>
                  <span className="text-muted">
                    {stats?.draftCount} brouillon
                    {(stats?.draftCount ?? 0) > 1 ? "s" : ""}
                  </span>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}