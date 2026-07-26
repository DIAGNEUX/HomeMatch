import { Injectable } from '@nestjs/common';

import { AnnouncementsService } from '@/modules/announcements/announcements.service';
import { ConversationContext } from '../conversation/conversation.context';
import { OpenAiService } from '../openai/openai.service';
import { ScoreCalculator } from './score-calculator';

const MIN_RECOMMENDATION_SCORE = 40;

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
      return {
        message:
          "Je n'ai pas trouvé d'alternative assez proche de votre recherche. Vous pouvez augmenter votre budget, élargir le type de bien ou essayer une autre ville.",
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
