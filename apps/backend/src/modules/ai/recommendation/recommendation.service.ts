import { Injectable } from '@nestjs/common';

import { AnnouncementsService } from '@/modules/announcements/announcements.service';
import { ConversationContext } from '../conversation/conversation.context';
import { OpenAiService } from '../openai/openai.service';
import { propertyTypeMapper } from '../mappers/property-type.mapper';
import { ScoreCalculator } from './score-calculator';

const MIN_RECOMMENDATION_SCORE = 40;

const propertyTypeLabels: Record<string, string> = {
  HOUSE: 'maison',
  APARTMENT: 'appartement',
  STUDIO: 'studio',
  MAISON: 'maison',
  APPARTEMENT: 'appartement',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price);
}

function buildBudgetHint(
  context: ConversationContext,
  marketAnnonces: { prix: number }[],
) {
  if (marketAnnonces.length === 0) {
    return '';
  }

  const prices = [...new Set(marketAnnonces.map((annonce) => annonce.prix))]
    .sort((a, b) => a - b);

  if (prices.length === 0) {
    return '';
  }

  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];
  const listingLabel =
    context.typeAnnonce === 'LOCATION'
      ? 'les loyers disponibles'
      : 'les budgets disponibles';

  if (minPrice === maxPrice) {
    return ` Dans ce secteur, ${listingLabel} commencent autour de ${formatPrice(minPrice)} €.`;
  }

  return ` Dans ce secteur, ${listingLabel} pour ce type de bien vont environ de ${formatPrice(minPrice)} € à ${formatPrice(maxPrice)} €.`;
}

function buildNoAlternativeMessage(
  context: ConversationContext,
  marketAnnonces: { prix: number }[],
) {
  const propertyType = context.propertyType
    ? propertyTypeLabels[context.propertyType] ?? 'bien'
    : 'bien';
  const listingType =
    context.typeAnnonce === 'VENTE'
      ? 'à vendre'
      : context.typeAnnonce === 'LOCATION'
        ? 'à louer'
        : '';
  const city = context.city ? ` à ${context.city}` : '';
  const budget = context.maxPrice
    ? ` avec un budget maximum de ${formatPrice(context.maxPrice)} €`
    : '';
  const budgetHint = buildBudgetHint(context, marketAnnonces);

  return `Je n'ai pas trouvé de ${propertyType} ${listingType}${city}${budget} qui soit suffisamment proche de votre demande.${budgetHint} On peut ajuster la recherche à partir de ces montants, ou regarder un autre type de bien ou une ville proche.`;
}

@Injectable()
export class RecommendationService {
  constructor(
    private readonly announcementsService: AnnouncementsService,
    private readonly openAiService: OpenAiService,
  ) {}

  async findAlternatives(context: ConversationContext) {
    const annonces =
      await this.announcementsService.searchAnnonces({
        ville: context.city,
        typeAnnonce: context.typeAnnonce as 'VENTE' | 'LOCATION' | undefined,
      });

    const ranked = annonces
      .flatMap((annonce) => {
        const eligibility = ScoreCalculator.isEligible(
          annonce,
          context,
        );

        if (!eligibility.eligible) {
          return [];
        }

        const result = ScoreCalculator.calculate(
          annonce,
          context,
        );

        if (result.score < MIN_RECOMMENDATION_SCORE) {
          return [];
        }

        return [
          {
            annonce,
            score: result.score,
            highlights: result.highlights,
            differences: [
              ...eligibility.differences,
              ...result.differences,
            ],
          },
        ];
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (ranked.length === 0) {
      const marketAnnonces =
        await this.announcementsService.searchAnnonces({
          ville: context.city,
          typeAnnonce: context.typeAnnonce as 'VENTE' | 'LOCATION' | undefined,
          typeBien: context.propertyType
            ? propertyTypeMapper[context.propertyType]
            : undefined,
        });

      return {
        message: buildNoAlternativeMessage(context, marketAnnonces),
        annonces: [],
        isAlternative: true,
      };
    }

    const message =
      await this.openAiService.generateRecommendationMessage(
        context,
        ranked,
      );

    return {
      message,
      annonces: ranked,
      isAlternative: true,
    };
  }
}
