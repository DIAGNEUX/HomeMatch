export type TypeAnnonce = "VENTE" | "LOCATION";

export type TypeBien =
  | "APPARTEMENT"
  | "MAISON"
  | "STUDIO"
  | "TERRAIN"
  | "LOCAL_COMMERCIAL"
  | "AUTRE";

export type StatutAnnonce = "BROUILLON" | "PUBLIEE";

export type Annonce = {
  id: string;
  titre: string;
  description: string;
  typeAnnonce: TypeAnnonce;
  typeBien: TypeBien;
  prix: number;
  surface: number;
  nombrePieces: number;
  nombreSallesBains: number;
  nombreChambres: number;
  etage: number | null;
  anneeConstruction: number | null;
  adresse: string;
  ville: string;
  statut: StatutAnnonce;
  agencyId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAnnonceDto = {
  titre: string;
  description: string;
  typeAnnonce: TypeAnnonce;
  typeBien: TypeBien;
  prix: number;
  surface: number;
  nombrePieces: number;
  nombreSallesBains: number;
  nombreChambres: number;
  etage?: number;
  anneeConstruction?: number;
  adresse: string;
  ville: string;
};

export type UpdateAnnonceDto = Partial<CreateAnnonceDto>;