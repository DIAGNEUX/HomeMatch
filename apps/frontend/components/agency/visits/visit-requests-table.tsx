"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  MoreHorizontal,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import visitRequestService from "@/services/visit-request.service";
import type {
  VisitRequest,
  VisitRequestStatus,
} from "@/types/visit-request";
import { visitRequestTableColumns } from "./columns";

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

function getVisitorName(visitRequest: VisitRequest) {
  const visitor = visitRequest.utilisateur;

  if (!visitor) {
    return "Utilisateur";
  }

  return `${visitor.firstName} ${visitor.lastName}`;
}

function getColumnClassName(key: string) {
  const classNames: Record<string, string> = {
    property: "w-[32%]",
    visitor: "w-[18%]",
    requestedDate: "w-[15%]",
    message: "w-[22%]",
    status: "w-[9%]",
  };

  return classNames[key] ?? "";
}

export default function VisitRequestsTable() {
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedVisitRequest, setSelectedVisitRequest] =
    useState<VisitRequest | null>(null);

  const fetchVisitRequests = async () => {
    setLoading(true);

    try {
      const response = await visitRequestService.findReceived();
      setVisitRequests(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des demandes de visite :", err);
      setError("Impossible de charger les demandes de visite.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitRequests();
  }, []);

  const updateStatus = async (
    visitRequest: VisitRequest,
    status: VisitRequestStatus
  ) => {
    setUpdatingId(visitRequest.id);
    setError(null);

    try {
      const response = await visitRequestService.updateStatus(
        visitRequest.id,
        status
      );

      setVisitRequests((current) =>
        current.map((item) =>
          item.id === visitRequest.id ? response.data.data : item
        )
      );
      setSelectedVisitRequest((current) =>
        current?.id === visitRequest.id ? response.data.data : current
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
      setError("Impossible de mettre à jour le statut de cette demande.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Demandes de visite
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consultez et gérez les demandes reçues pour vos annonces.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {visitRequestTableColumns.map((column) => (
                <TableHead
                  key={column.key}
                  className={getColumnClassName(column.key)}
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={visitRequestTableColumns.length + 1}
                  className="text-center text-muted-foreground"
                >
                  Chargement...
                </TableCell>
              </TableRow>
            )}

            {!loading && error && (
              <TableRow>
                <TableCell
                  colSpan={visitRequestTableColumns.length + 1}
                  className="text-center text-red-600"
                >
                  {error}
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && visitRequests.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={visitRequestTableColumns.length + 1}
                  className="text-center text-muted-foreground"
                >
                  Aucune demande de visite pour le moment.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              visitRequests.map((visitRequest) => {
                const isUpdating = updatingId === visitRequest.id;

                return (
                  <TableRow
                    key={visitRequest.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedVisitRequest(visitRequest)}
                  >
                    <TableCell className="truncate font-medium text-foreground">
                      <span className="block truncate">
                        {visitRequest.annonce?.titre ?? "Annonce supprimée"}
                      </span>
                    </TableCell>
                    <TableCell className="truncate">
                      <div className="truncate font-medium text-foreground">
                        {getVisitorName(visitRequest)}
                      </div>
                      {visitRequest.utilisateur?.email && (
                        <div className="truncate text-xs text-muted-foreground">
                          {visitRequest.utilisateur.email}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(visitRequest.dateVisiteSouhaitee)}
                    </TableCell>
                    <TableCell className="truncate text-muted-foreground">
                      <span className="block truncate">
                        {visitRequest.message || "Aucun message"}
                      </span>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                            aria-label="Actions de la demande"
                            disabled={isUpdating}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedVisitRequest(visitRequest)}
                          >
                            <Eye size={14} className="mr-2" />
                            Consulter
                          </DropdownMenuItem>

                          {visitRequest.statut === "EN_ATTENTE" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateStatus(visitRequest, "ACCEPTEE")
                                }
                              >
                                <CheckCircle2 size={14} className="mr-2" />
                                Accepter
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateStatus(visitRequest, "REFUSEE")
                                }
                                className="text-red-600 focus:text-red-600"
                              >
                                <XCircle size={14} className="mr-2" />
                                Refuser
                              </DropdownMenuItem>
                            </>
                          )}

                          {visitRequest.statut === "ACCEPTEE" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateStatus(visitRequest, "TERMINEE")
                              }
                            >
                              <Clock3 size={14} className="mr-2" />
                              Marquer terminée
                            </DropdownMenuItem>
                          )}

                          {["REFUSEE", "ANNULEE", "TERMINEE"].includes(
                            visitRequest.statut
                          ) && (
                            <DropdownMenuItem disabled>
                              Aucune action disponible
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedVisitRequest}
        onOpenChange={(open) => {
          if (!open) setSelectedVisitRequest(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Demande de visite</DialogTitle>
          </DialogHeader>

          {selectedVisitRequest && (
            <div className="space-y-5">
              <div className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Bien</p>
                  <p className="mt-1 font-medium text-foreground">
                    {selectedVisitRequest.annonce?.titre ?? "Annonce supprimée"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Statut</p>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${
                      statusClassName[selectedVisitRequest.statut]
                    }`}
                  >
                    {statusLabel[selectedVisitRequest.statut]}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Demandeur</p>
                  <p className="mt-1 font-medium text-foreground">
                    {getVisitorName(selectedVisitRequest)}
                  </p>
                  {selectedVisitRequest.utilisateur?.email && (
                    <p className="text-sm text-muted-foreground">
                      {selectedVisitRequest.utilisateur.email}
                    </p>
                  )}
                  {selectedVisitRequest.utilisateur?.phone && (
                    <p className="text-sm text-muted-foreground">
                      {selectedVisitRequest.utilisateur.phone}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Date souhaitée
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {formatDateTime(selectedVisitRequest.dateVisiteSouhaitee)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Demandée le {formatDateTime(selectedVisitRequest.dateDemande)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">Message</p>
                <p className="mt-2 whitespace-pre-line rounded-xl border border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
                  {selectedVisitRequest.message || "Aucun message"}
                </p>
              </div>
            </div>
          )}

          {selectedVisitRequest && (
            <DialogFooter className="gap-2">
              {selectedVisitRequest.statut === "EN_ATTENTE" && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updatingId === selectedVisitRequest.id}
                    onClick={() =>
                      updateStatus(selectedVisitRequest, "REFUSEE")
                    }
                  >
                    Refuser
                  </Button>
                  <Button
                    type="button"
                    disabled={updatingId === selectedVisitRequest.id}
                    className="bg-[#0B162C] text-white hover:bg-[#1C2942]"
                    onClick={() =>
                      updateStatus(selectedVisitRequest, "ACCEPTEE")
                    }
                  >
                    Accepter
                  </Button>
                </>
              )}

              {selectedVisitRequest.statut === "ACCEPTEE" && (
                <Button
                  type="button"
                  disabled={updatingId === selectedVisitRequest.id}
                  className="bg-[#0B162C] text-white hover:bg-[#1C2942]"
                  onClick={() => updateStatus(selectedVisitRequest, "TERMINEE")}
                >
                  Marquer terminée
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
