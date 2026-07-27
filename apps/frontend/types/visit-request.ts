import type { Annonce } from "./announcement";
import type { User } from "./auth";

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
  utilisateur?: Pick<
    User,
    "id" | "firstName" | "lastName" | "email" | "phone" | "role"
  >;
};

export type CreateVisitRequestDto = {
  message?: string;
  requestedVisitDate: string;
};
