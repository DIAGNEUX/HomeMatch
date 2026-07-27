"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
import type { AgencyAdmin } from "@/types/admin";

export default function AgenciesTable() {
  const [agencies, setAgencies] = useState<AgencyAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await adminService.getAgencies();
        setAgencies(response.data.data);
      } catch (err) {
        console.error("Erreur lors du chargement des agences :", err);
        setError("Impossible de charger les agences.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agences & annonces"
        description="Supervisez les comptes professionnels et le contenu publié."
      />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-surface">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Agence</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>SIRET</TableHead>
              <TableHead>Annonces</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted">
                  Chargement...
                </TableCell>
              </TableRow>
            )}

            {!loading && error && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-600">
                  {error}
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && agencies.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted">
                  Aucune agence enregistrée.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              agencies.map((agency) => (
                <TableRow key={agency.id}>
                  <TableCell className="font-medium text-primary">
                    <Link
                      href={`/homematch/intranet/agencies/${agency.id}`}
                      className="hover:underline"
                    >
                      {agency.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted">{agency.city}</TableCell>
                  <TableCell className="text-muted">{agency.siret}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-gray-200 bg-gray-50 text-gray-700"
                    >
                      {agency._count.annonces}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}