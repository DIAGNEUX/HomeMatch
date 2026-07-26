import { Annonce, TypeAnnonce, TypeBien } from "./announcement";

export type ChatMessageDto = {
  message: string;
  conversationId?: string;
};
export type ConversationIntent =
  | "SEARCH_PROPERTY"
  | "UNKNOWN";
export type ConversationResponse = {
  conversationId: string;
  intent: ConversationIntent;
  criteria: ConversationCriteria;
  missingCriteria?: string[];
  nextQuestion?: string;
  message?: string;
  annonces?: RecommendationPayload[];
  isAlternative?: boolean;
};
export type ConversationCriteria = {
  propertyType?: TypeBien | "HOUSE" | "APARTMENT";
  typeAnnonce?: TypeAnnonce;
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



export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
