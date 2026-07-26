import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Annonce } from '@prisma/client';

import { SYSTEM_PROMPT } from '../prompts/system.prompt';
import { ConversationContext } from '../conversation/conversation.context';
import { RECOMMENDATION_SYSTEM_PROMPT } from '../prompts/recommendation-system.prompt';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async sendMessage(message: string): Promise<string> {
    const response = await this.openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return response.output_text;
  }

  async generateRecommendationMessage(
    criteria: ConversationContext,
    recommendations: {
      annonce: Annonce;
      score: number;
      highlights: string[];
      differences: string[];
    }[],
  ): Promise<string> {
    const recommendationsForAI = recommendations.map((r) => ({
      titre: r.annonce.titre,
      typeBien: r.annonce.typeBien,
      typeAnnonce: r.annonce.typeAnnonce,
      ville: r.annonce.ville,
      prix: r.annonce.prix,
      surface: r.annonce.surface,
      chambres: r.annonce.nombreChambres,
      score: r.score,
      highlights: r.highlights,
      differences: r.differences,
    }));

    const prompt = `
    L'utilisateur recherchait :

    ${JSON.stringify(criteria, null, 2)}

    Aucune annonce ne correspond exactement à sa recherche.

    Voici les meilleures alternatives :

    ${JSON.stringify(recommendationsForAI, null, 2)}

    Explique :

    - pourquoi ces annonces sont proposées ;
    - quels sont leurs principaux points forts (highlights) ;
    - quelles sont leurs principales différences (differences) ;
    - rappelle qu'il s'agit d'alternatives à la recherche initiale ;
    - rédige une réponse naturelle, professionnelle et concise (3 à 5 phrases).
    `;

    const response = await this.openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: RECOMMENDATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.output_text;
  }
}