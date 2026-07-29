export type Role = "USER" | "AGENCY" | "ADMIN";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: Role;
};

export type AnnonceImage = {
  id: string;
  url: string;
  publicId?: string | null;
  annonceId: string;
  createdAt: string;
};

export type Agency = {
  id: string;
  name: string;
  description?: string | null;
  siret?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  logo?: string | null;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Annonce = {
  id: string;
  titre: string;
  description: string;
  typeAnnonce: "VENTE" | "LOCATION";
  typeBien:
    | "APPARTEMENT"
    | "MAISON"
    | "STUDIO"
    | "TERRAIN"
    | "LOCAL_COMMERCIAL"
    | "AUTRE";
  prix: number;
  surface: number;
  nombrePieces: number;
  nombreSallesBains: number;
  nombreChambres: number;
  etage: number | null;
  anneeConstruction: number | null;
  adresse: string;
  ville: string;
  statut: "BROUILLON" | "PUBLIEE";
  agencyId: string;
  agency?: Agency;
  images: AnnonceImage[];
  createdAt: string;
  updatedAt: string;
};

export type SearchAnnoncesResponse = {
  success: boolean;
  data: Annonce[];
  total: number;
  page: number;
  limit: number;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

export type Favorite = {
  id: string;
  userId: string;
  annonceId: string;
  createdAt: string;
  annonce: Annonce;
};

export type VisitRequestStatus =
  | "EN_ATTENTE"
  | "ACCEPTEE"
  | "REFUSEE"
  | "ANNULEE"
  | "TERMINEE";

export type VisitRequest = {
  id: string;
  dateDemande: string;
  dateVisiteSouhaitee: string;
  message: string;
  statut: VisitRequestStatus;
  annonceId: string;
  utilisateurId: string;
  updatedAt: string;
  annonce?: Annonce;
  utilisateur?: User;
};

export type ConversationCriteria = {
  propertyType?: string;
  typeAnnonce?: "VENTE" | "LOCATION";
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  surface?: number;
  bedrooms?: number;
  rooms?: number;
  bathrooms?: number;
  constructionYear?: number;
};

export type Recommendation = {
  annonce: Annonce;
  score?: number;
  highlights: string[];
  differences: string[];
};

export type RecommendationPayload = Recommendation | Annonce;

export type ConversationResponse = {
  conversationId: string;
  intent: "SEARCH_PROPERTY" | "SMALL_TALK" | "UNKNOWN";
  criteria: ConversationCriteria;
  missingCriteria?: string[];
  nextQuestion?: string;
  message?: string;
  annonces?: RecommendationPayload[];
  isAlternative?: boolean;
};
