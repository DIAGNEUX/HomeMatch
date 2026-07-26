import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { ChatMessageDto } from './dto/chat-message.dto';
import { ConversationManager } from './conversation/conversation.manager';

@Injectable()
export class AiService {
  constructor(
    private readonly conversationManager: ConversationManager,
  ) {}

  async chat(dto: ChatMessageDto) {
    const conversationId = dto.conversationId ?? randomUUID();

    const result = await this.conversationManager.processMessage(
      conversationId,
      dto.message,
    );

    return {
      conversationId,
      ...result,
    };
  }
}