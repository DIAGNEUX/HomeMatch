import { MoreHorizontal, Plus } from "lucide-react";

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

import { propertyTableColumns } from "./columns";
import {
  propertiesTablePreviewData,
  type PropertyStatus,
} from "./properties-table-data";

const statusClassName: Record<PropertyStatus, string> = {
  "En cours": "border-blue-100 bg-blue-50 text-blue-700",
  Nouveau: "border-emerald-100 bg-emerald-50 text-emerald-700",
  Disponible: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function PropertiesTable() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mes annonces</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Apercu temporaire de la future table reutilisable.
          </p>
        </div>

        <Button
          type="button"
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
              {propertyTableColumns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {propertiesTablePreviewData.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium text-foreground">
                  {property.title}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {property.location}
                </TableCell>
                <TableCell>{property.price}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusClassName[property.status]}
                  >
                    {property.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Actions de l'annonce"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
