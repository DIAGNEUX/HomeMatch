"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

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
import PageHeader from "@/components/agency/common/PageHeader";
import adminService from "@/services/admin.service";
import type { AgencyAdminDetail } from "@/types/admin";
import type { Annonce, StatutAnnonce } from "@/types/announcement";
import DeleteAnnonceAdminDialog from "./DeleteAnnonceAdminDialog";

const statusClassName: Record<StatutAnnonce, string> = {
  BROUILLON: "border-slate-200 bg-slate-50 text-slate-700",
  PUBLIEE: "border-emerald-100 bg-emerald-50 text-emerald-700",
};

const statusLabel: Record<StatutAnnonce, string> = {
  BROUILLON: "Brouillon",
  PUBLIEE: "Publiée",
};

interface AgencyDetailProps {
  id: string;
}

export default function AgencyDetail({ id }: AgencyDetailProps) {
  const [agency, setAgency] = useState<AgencyAdminDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchAgency = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAgencyById(id);
      setAgency(response.data.data);
      setNotFound(false);
    } catch (err) {
      console.error("Erreur lors du chargement de l'agence :", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDeleteClick = (annonce: Annonce) => {
    setSelectedAnnonce(annonce);
    setIsDeleteOpen(true);
  };

  if (loading) {
    return <p className="text-center text-muted">Chargement...</p>;
  }

  if (notFound || !agency) {
    return (
      <div className="space-y-4 text-center">
        <p className="font-medium text-primary">Agence introuvable.</p>
        <Link
          href="/homematch/intranet/agencies"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Retour aux agences
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/homematch/intranet/agencies"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary"
      >
        <ArrowLeft size={16} />
        Retour aux agences
      </Link>

      <PageHeader
        title={agency.name}
        description={`${agency.address}, ${agency.postalCode} ${agency.city} — SIRET : ${agency.siret}`}
      />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-surface">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Titre</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {agency.annonces.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted">
                  Cette agence n&apos;a publié aucune annonce.
                </TableCell>
              </TableRow>
            )}

            {agency.annonces.map((annonce) => (
              <TableRow key={annonce.id}>
                <TableCell className="font-medium text-primary">
                  {annonce.titre}
                </TableCell>
                <TableCell className="text-muted">{annonce.ville}</TableCell>
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
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(annonce)}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
                    aria-label="Supprimer cette annonce"
                  >
                    <Trash2 size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteAnnonceAdminDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        annonce={selectedAnnonce}
        onSuccess={fetchAgency}
      />
    </div>
  );
}