import { Annonce, TypeBien } from '@prisma/client';
import { ConversationContext } from '../conversation/conversation.context';
import { propertyTypeMapper } from '../mappers/property-type.mapper';

const MAX_PRICE_OVER_BUDGET_RATIO = 0.2;

function getRequestedPropertyType(context: ConversationContext) {
  return context.propertyType
    ? propertyTypeMapper[context.propertyType] ?? context.propertyType
    : undefined;
}

export class ScoreCalculator {
  static isEligible(annonce: Annonce, context: ConversationContext) {
    const differences: string[] = [];
    const requestedType = getRequestedPropertyType(context);

    if (context.typeAnnonce && annonce.typeAnnonce !== context.typeAnnonce) {
      return {
        eligible: false,
        differences: [`Type d'annonce différent : ${annonce.typeAnnonce}.`],
      };
    }

    if (context.maxPrice && annonce.prix > context.maxPrice) {
      const overBudgetRatio =
        (annonce.prix - context.maxPrice) / context.maxPrice;

      if (overBudgetRatio > MAX_PRICE_OVER_BUDGET_RATIO) {
        return {
          eligible: false,
          differences: [
            `Prix trop éloigné du budget : ${annonce.prix} € au lieu de ${context.maxPrice} € maximum.`,
          ],
        };
      }

      differences.push(
        `Prix supérieur au budget : ${annonce.prix} € au lieu de ${context.maxPrice} € maximum.`,
      );
    }

    if (
      requestedType &&
      annonce.typeBien !== requestedType &&
      !(
        requestedType === TypeBien.APPARTEMENT &&
        annonce.typeBien === TypeBien.STUDIO
      )
    ) {
      return {
        eligible: false,
        differences: [`Type de bien trop éloigné : ${annonce.typeBien}.`],
      };
    }

    return {
      eligible: true,
      differences,
    };
  }

  static calculate(annonce: Annonce, context: ConversationContext) {
    let score = 0;
    const differences: string[] = [];
    const highlights: string[] = [];
    const requestedType = getRequestedPropertyType(context);

    if (requestedType) {
      if (annonce.typeBien === requestedType) {
        score += 35;
        highlights.push('Même type de bien.');
      } else if (
        requestedType === TypeBien.APPARTEMENT &&
        annonce.typeBien === TypeBien.STUDIO
      ) {
        score += 18;
        highlights.push('Studio pouvant convenir comme alternative.');
        differences.push("Studio au lieu d'un appartement.");
      } else {
        differences.push(`Type de bien différent : ${annonce.typeBien}.`);
      }
    }

    if (context.maxPrice) {
      if (annonce.prix <= context.maxPrice) {
        const ratioUnderBudget =
          (context.maxPrice - annonce.prix) / context.maxPrice;

        if (ratioUnderBudget <= 0.05) {
          score += 35;
          highlights.push('Prix très proche de votre budget.');
        } else if (ratioUnderBudget <= 0.15) {
          score += 30;
          highlights.push('Prix inférieur et proche de votre budget.');
        } else {
          score += 24;
          highlights.push('Prix inférieur à votre budget.');
        }
      } else {
        const overBudgetRatio =
          (annonce.prix - context.maxPrice) / context.maxPrice;

        if (overBudgetRatio <= 0.1) {
          score += 14;
          differences.push(
            `Prix légèrement supérieur au budget : ${annonce.prix} € au lieu de ${context.maxPrice} € maximum.`,
          );
        } else if (overBudgetRatio <= MAX_PRICE_OVER_BUDGET_RATIO) {
          score += 6;
          differences.push(
            `Prix supérieur au budget : ${annonce.prix} € au lieu de ${context.maxPrice} € maximum.`,
          );
        }
      }
    }

    if (context.surface) {
      const diff = Math.abs(annonce.surface - context.surface) / context.surface;

      if (diff <= 0.1) {
        score += 12;
        highlights.push('Surface très proche.');
      } else if (diff <= 0.2) {
        score += 7;
        highlights.push('Surface proche.');
      } else {
        differences.push(
          `Surface : ${annonce.surface} m² au lieu de ${context.surface} m².`,
        );
      }
    }

    if (context.bedrooms) {
      const diff = Math.abs(annonce.nombreChambres - context.bedrooms);

      if (diff === 0) {
        score += 10;
        highlights.push('Même nombre de chambres.');
      } else if (diff === 1) {
        score += 6;
        highlights.push('Nombre de chambres proche.');
      } else {
        differences.push(
          `${annonce.nombreChambres} chambre(s) au lieu de ${context.bedrooms}.`,
        );
      }
    }

    return {
      score,
      highlights,
      differences,
    };
  }
}
