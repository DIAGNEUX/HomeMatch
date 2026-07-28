import type { Agency } from "./agency";

export type TypeAnnonce = "VENTE" | "LOCATION";

export type TypeBien =
  | "APPARTEMENT"
  | "MAISON"
  | "STUDIO"
  | "TERRAIN"
  | "LOCAL_COMMERCIAL"
  | "AUTRE";

export type StatutAnnonce = "BROUILLON" | "PUBLIEE";

export type AnnonceImage = {
  id: string;
  url: string;
  publicId?: string | null;
  annonceId: string;
  createdAt: string;
};

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
  agency?: Agency;
  images: AnnonceImage[];
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

export type SearchAnnonceParams = {
  q?: string;
  ville?: string;
  typeAnnonce?: TypeAnnonce;
  typeBien?: TypeBien;
  prixMin?: number;
  prixMax?: number;
  surfaceMin?: number;
  nombrePiecesMin?: number;
  nombreChambresMin?: number;
  sortBy?: "prix" | "surface" | "createdAt";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type SearchAnnoncesResponse = {
  success: boolean;
  data: Annonce[];
  total: number;
  page: number;
  limit: number;
};
