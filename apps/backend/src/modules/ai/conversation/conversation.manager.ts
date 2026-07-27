import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../openai/openai.service';
import { AnnouncementsService } from '@/modules/announcements/announcements.service';
import { ConversationStore } from './conversation.store';
import { ConversationPromptBuilder } from '../prompts/conversation-prompt.builder';
import { RecommendationService } from '../recommendation/recommendation.service';
import { ConversationContext } from './conversation.context';
import { propertyTypeMapper } from '../mappers/property-type.mapper';

const REQUIRED_CRITERIA = [
  'city',
  'propertyType',
  'typeAnnonce',
  'maxPrice',
] as const;

const NEXT_QUESTIONS: Record<(typeof REQUIRED_CRITERIA)[number], string> = {
  city: 'Dans quelle ville recherchez-vous votre bien ?',
  propertyType: 'Quel type de bien recherchez-vous : maison, appartement ou studio ?',
  typeAnnonce: 'Souhaitez-vous acheter ou louer ce bien ?',
  maxPrice: 'Quel est votre budget maximum ?',
};

function normalizeMessage(message: string) {
  return message
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getSmallTalkResponse(message: string) {
  const normalizedMessage = normalizeMessage(message);
  const hasThanks = /\b(merci|remerciements?)\b/.test(normalizedMessage);
  const hasSearchSignal =
    /\b(cherche|recherche|acheter|achat|vendre|vente|louer|location|appartement|appart|maison|villa|studio|budget|max|maximum|prix|euros?)\b/.test(
      normalizedMessage,
    );

  if (hasThanks && !hasSearchSignal) {
    return 'Avec plaisir. Je reste disponible si vous souhaitez affiner votre recherche.';
  }

  if (/^(bonjour|salut|hello|bonsoir)[.! ]*$/.test(normalizedMessage)) {
    return 'Bonjour, décrivez-moi le bien que vous recherchez et je vous aiderai à trouver les annonces les plus adaptées.';
  }

  return null;
}

function buildAnnonceFilters(context: ConversationContext) {
  return {
    ville: context.city,
    typeAnnonce: context.typeAnnonce as 'VENTE' | 'LOCATION' | undefined,
    typeBien: context.propertyType
      ? propertyTypeMapper[context.propertyType]
      : undefined,
    prixMin: context.minPrice,
    prixMax: context.maxPrice,
    surfaceMin: context.surface,
    nombrePiecesMin: context.rooms,
    nombreChambresMin: context.bedrooms,
  };
}

function extractExplicitCriteria(message: string): Partial<ConversationContext> {
  const normalizedMessage = normalizeMessage(message);

  const criteria: Partial<ConversationContext> = {};

  if (
    /\b(acheter|achat|vendre|vente|a vendre)\b/.test(normalizedMessage)
  ) {
    criteria.typeAnnonce = 'VENTE';
  }

  if (/\b(louer|location|a louer)\b/.test(normalizedMessage)) {
    criteria.typeAnnonce = 'LOCATION';
  }

  if (/\b(maison|villa|pavillon)\b/.test(normalizedMessage)) {
    criteria.propertyType = 'HOUSE';
  }

  if (/\b(appartement|appart|t2|t3|t4|t5)\b/.test(normalizedMessage)) {
    criteria.propertyType = 'APARTMENT';
  }

  if (/\b(studio)\b/.test(normalizedMessage)) {
    criteria.propertyType = 'STUDIO';
  }

  const priceMatch = normalizedMessage.match(
    /(?:budget|max|maximum|jusqu'a|moins de|prix)\D*(\d[\d\s]*)/,
  );

  if (priceMatch?.[1]) {
    criteria.maxPrice = Number(priceMatch[1].replace(/\s/g, ''));
  }

  return criteria;
}

@Injectable()
export class ConversationManager {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly announcementsService: AnnouncementsService,
    private readonly recommendationService: RecommendationService,
    private readonly conversationStore: ConversationStore,
    private readonly conversationPromptBuilder: ConversationPromptBuilder,
  ) {}

async processMessage(
  conversationId: string,
  message: string,
) {

  const context = this.conversationStore.get(conversationId);
  const smallTalkResponse = getSmallTalkResponse(message);

  if (smallTalkResponse) {
    return {
      intent: 'SMALL_TALK',
      criteria: context,
      missingCriteria: [],
      message: smallTalkResponse,
    };
  }

    console.log(context);

    const prompt = this.conversationPromptBuilder.build(
    context,
    message,
  );

  console.log(prompt);

  const aiResponse = JSON.parse(
    await this.openAiService.sendMessage(prompt),
  );

  Object.assign(context, aiResponse.criteria);
  Object.assign(context, extractExplicitCriteria(message));

  this.conversationStore.save(conversationId, context);

  console.log(context);
  const missingCriteria = REQUIRED_CRITERIA.filter(
    (criterion) => !context[criterion],
  );

  if (missingCriteria.length > 0) {
    return {
      ...aiResponse,
      criteria: context,
      missingCriteria,
      nextQuestion: NEXT_QUESTIONS[missingCriteria[0]],
    };
  }

  const annonces =
  await this.announcementsService.searchAnnonces(
    buildAnnonceFilters(context),
  );

  if (annonces.length > 0) {
    return {
      criteria: context,
      annonces: annonces.slice(0, 5),
    };
  }


  const alternativeResult =
    await this.recommendationService.findAlternatives(context);

  return {
    criteria: context,
    message: alternativeResult.message,
    annonces: alternativeResult.annonces,
    isAlternative: true,
  };
}
}
