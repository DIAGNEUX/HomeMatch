import { Injectable } from '@nestjs/common';
import { ConversationContext } from '../conversation/conversation.context';

@Injectable()
export class ConversationPromptBuilder {
  build(context: ConversationContext, message: string): string {
    return `
Tu assistes une conversation déjà commencée.

Critères déjà connus :

${JSON.stringify(context, null, 2)}

Nouveau message utilisateur :

${message}

Complète uniquement les critères manquants.

Ne modifie jamais les critères déjà connus sauf si l'utilisateur demande explicitement à les changer.

Si l'utilisateur dit qu'il change d'avis, qu'il veut "plutôt" un autre bien, ou qu'il donne explicitement un nouveau type de bien, un nouveau type d'annonce ou un nouveau budget, remplace le critère correspondant.

Exemples de corrections explicites :
- "je change d'avis, je veux une maison" remplace propertyType par "HOUSE".
- "une maison à vendre" remplace propertyType par "HOUSE" et typeAnnonce par "VENTE".
- "finalement à louer" remplace typeAnnonce par "LOCATION".
- "maximum 3000 euros" remplace maxPrice par 3000.

Retourne uniquement le JSON attendu.
`;
  }
}
