export type PropertyStatus = "En cours" | "Nouveau" | "Disponible";

export type PropertyTableItem = {
  id: string;
  title: string;
  location: string;
  price: string;
  status: PropertyStatus;
};

export const propertiesTablePreviewData: PropertyTableItem[] = [
  {
    id: "property-1",
    title: "Appartement 3 pieces",
    location: "Lyon 3eme",
    price: "320 000 EUR",
    status: "En cours",
  },
  {
    id: "property-2",
    title: "Villa familiale",
    location: "Annecy",
    price: "1 250 000 EUR",
    status: "Nouveau",
  },
  {
    id: "property-3",
    title: "Studio a louer",
    location: "Grenoble",
    price: "650 EUR/mois",
    status: "Disponible",
  },
];
