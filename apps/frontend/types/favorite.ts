import type { Annonce } from "./announcement";

export type Favorite = {
  id: string;
  userId: string;
  annonceId: string;
  createdAt: string;
  annonce: Annonce;
};

export type FavoriteStatus = {
  isFavorite: boolean;
};
