"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarX2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import visitRequestService from "@/services/visit-request.service";
import type {
  VisitRequest,
  VisitRequestStatus,
} from "@/types/visit-request";

const statusClassName: Record<VisitRequestStatus, string> = {
  EN_ATTENTE: "border-amber-100 bg-amber-50 text-amber-700",
  ACCEPTEE: "border-emerald-100 bg-emerald-50 text-emerald-700",
  REFUSEE: "border-red-100 bg-red-50 text-red-700",
  ANNULEE: "border-slate-200 bg-slate-50 text-slate-700",
  TERMINEE: "border-blue-100 bg-blue-50 text-blue-700",
};

const statusLabel: Record<VisitRequestStatus, string> = {
  EN_ATTENTE: "En attente",
  ACCEPTEE: "Acceptée",
  REFUSEE: "Refusée",
  ANNULEE: "Annulée",
  TERMINEE: "Terminée",
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function UserVisitRequestsTable() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const fetchVisitRequests = async () => {
    setIsLoading(true);

    try {
      const response = await visitRequestService.findMine();
      setVisitRequests(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des demandes :", err);
      setError("Impossible de charger vos demandes de visite.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      fetchVisitRequests();
    }
  }, [loading, isAuthenticated]);

  const cancelVisitRequest = async (visitRequest: VisitRequest) => {
    setCancelingId(visitRequest.id);
    setError(null);

    try {
      const response = await visitRequestService.cancel(visitRequest.id);
      setVisitRequests((current) =>
        current.map((item) =>
          item.id === visitRequest.id ? response.data.data : item
        )
      );
    } catch (err) {
      console.error("Erreur lors de l'annulation de la demande :", err);
      setError("Impossible d'annuler cette demande.");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-[#0B162C]">
            Mes demandes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Suivez l'état de vos demandes de visite.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/account">Mon compte</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/account/favorites">Mes favoris</Link>
          </Button>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[34%]">Bien</TableHead>
              <TableHead className="w-[18%]">Agence</TableHead>
              <TableHead className="w-[18%]">Date souhaitée</TableHead>
              <TableHead className="w-[14%]">Statut</TableHead>
              <TableHead className="w-[16%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(loading || isLoading) && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Chargement...
                </TableCell>
              </TableRow>
            )}

            {!loading && !isLoading && error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-600">
                  {error}
                </TableCell>
              </TableRow>
            )}

            {!loading && !isLoading && !error && visitRequests.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Vous n'avez aucune demande de visite pour le moment.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !isLoading &&
              !error &&
              visitRequests.map((visitRequest) => (
                <TableRow key={visitRequest.id}>
                  <TableCell className="truncate font-medium text-foreground">
                    <span className="block truncate">
                      {visitRequest.annonce?.titre ?? "Annonce supprimée"}
                    </span>
                    {visitRequest.annonce?.ville && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {visitRequest.annonce.ville}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="truncate text-muted-foreground">
                    {visitRequest.annonce?.agency?.name ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(visitRequest.dateVisiteSouhaitee)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusClassName[visitRequest.statut]}
                    >
                      {statusLabel[visitRequest.statut]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {["EN_ATTENTE", "ACCEPTEE"].includes(
                      visitRequest.statut
                    ) ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={cancelingId === visitRequest.id}
                        onClick={() => cancelVisitRequest(visitRequest)}
                      >
                        <CalendarX2 className="size-4" />
                        Annuler
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
