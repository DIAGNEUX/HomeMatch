import type { PropertyTableItem } from "./properties-table-data";

export type PropertyTableColumn = {
  key: keyof Pick<PropertyTableItem, "title" | "location" | "price" | "status">;
  label: string;
};

export const propertyTableColumns: PropertyTableColumn[] = [
  {
    key: "title",
    label: "Bien",
  },
  {
    key: "location",
    label: "Ville",
  },
  {
    key: "price",
    label: "Prix",
  },
  {
    key: "status",
    label: "Statut",
  },
];
