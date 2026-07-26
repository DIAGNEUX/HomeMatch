import { Module } from '@nestjs/common';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { OpenAiService } from './openai/openai.service';
import { ConversationManager } from './conversation/conversation.manager';
import { RecommendationService } from './recommendation/recommendation.service';
import { AnnouncementsModule } from '../announcements/announcements.module';
import { ConversationStore } from './conversation/conversation.store';
import { ConversationPromptBuilder } from './prompts/conversation-prompt.builder';

@Module({
  imports: [AnnouncementsModule],
  controllers: [AiController],
  providers: [
    AiService,
    OpenAiService,
    ConversationManager,
    ConversationStore,
    ConversationPromptBuilder,
    RecommendationService,
  ],
})
export class AiModule {}