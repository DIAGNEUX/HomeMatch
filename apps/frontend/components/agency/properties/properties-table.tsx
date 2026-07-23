"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Plus, Pencil, Trash2, Send } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { annonceTableColumns } from "./columns";
import announcementService from "@/services/announcement.service";
import type { Annonce, StatutAnnonce } from "@/types/announcement";
import AnnonceFormDialog from "./AnnonceFormDialog";
import DeleteAnnonceDialog from "./DeleteAnnonceDialog";
import PublishAnnonceDialog from "./PublishAnnonceDialog";

const statusClassName: Record<StatutAnnonce, string> = {
  BROUILLON: "border-slate-200 bg-slate-50 text-slate-700",
  PUBLIEE: "border-emerald-100 bg-emerald-50 text-emerald-700",
};

const statusLabel: Record<StatutAnnonce, string> = {
  BROUILLON: "Brouillon",
  PUBLIEE: "Publiée",
};

export default function PropertiesTable() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);

  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      const response = await announcementService.findAll();
      setAnnonces(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des annonces :", err);
      setError("Impossible de charger les annonces.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const handleAdd = () => {
    setSelectedAnnonce(null);
    setIsFormOpen(true);
  };

  const handleEdit = (annonce: Annonce) => {
    setSelectedAnnonce(annonce);
    setIsFormOpen(true);
  };

  const handleDelete = (annonce: Annonce) => {
    setSelectedAnnonce(annonce);
    setIsDeleteOpen(true);
  };

  const handlePublish = (annonce: Annonce) => {
    setSelectedAnnonce(annonce);
    setIsPublishOpen(true);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mes annonces</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les annonces publiées par votre agence.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          className="cursor-pointer gap-2 bg-[#0B162C] text-white hover:bg-[#1C2942]"
        >
          <Plus size={16} />
          Ajouter une annonce
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {annonceTableColumns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={annonceTableColumns.length + 1}
                  className="text-center text-muted-foreground"
                >
                  Chargement...
                </TableCell>
              </TableRow>
            )}

            {!loading && error && (
              <TableRow>
                <TableCell
                  colSpan={annonceTableColumns.length + 1}
                  className="text-center text-red-600"
                >
                  {error}
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && annonces.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={annonceTableColumns.length + 1}
                  className="text-center text-muted-foreground"
                >
                  Aucune annonce pour le moment.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              annonces.map((annonce) => (
                <TableRow key={annonce.id}>
                  <TableCell className="font-medium text-foreground">
                    {annonce.titre}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {annonce.ville}
                  </TableCell>
                  <TableCell>{annonce.prix.toLocaleString("fr-FR")} €</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusClassName[annonce.statut]}
                    >
                      {statusLabel[annonce.statut]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          aria-label="Actions de l'annonce"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {annonce.statut === "BROUILLON" && (
                          <DropdownMenuItem
                            onClick={() => handlePublish(annonce)}
                          >
                            <Send size={14} className="mr-2" />
                            Publier
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleEdit(annonce)}>
                          <Pencil size={14} className="mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(annonce)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <AnnonceFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={fetchAnnonces}
        annonce={selectedAnnonce}
      />

      <DeleteAnnonceDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        annonce={selectedAnnonce}
        onSuccess={fetchAnnonces}
      />

      <PublishAnnonceDialog
        open={isPublishOpen}
        onOpenChange={setIsPublishOpen}
        annonce={selectedAnnonce}
        onSuccess={fetchAnnonces}
      />
    </section>
  );
}