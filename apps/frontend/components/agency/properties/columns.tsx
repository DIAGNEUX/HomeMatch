import type { Annonce } from "@/types/announcement";

export type AnnonceTableColumn = {
  key: keyof Pick<Annonce, "titre" | "ville" | "prix" | "statut">;
  label: string;
};

export const annonceTableColumns: AnnonceTableColumn[] = [
  {
    key: "titre",
    label: "Bien",
  },
  {
    key: "ville",
    label: "Ville",
  },
  {
    key: "prix",
    label: "Prix",
  },
  {
    key: "statut",
    label: "Statut",
  },
];