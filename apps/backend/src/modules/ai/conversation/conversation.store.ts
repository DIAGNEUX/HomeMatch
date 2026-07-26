import { Injectable } from '@nestjs/common';
import { ConversationContext } from './conversation.context';

@Injectable()
export class ConversationStore {
  private conversations = new Map<string, ConversationContext>();

  get(userId: string): ConversationContext {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, new ConversationContext());
    }

    return this.conversations.get(userId)!;
  }

  save(userId: string, context: ConversationContext): void {
    this.conversations.set(userId, context);
  }

  clear(userId: string): void {
    this.conversations.delete(userId);
  }
}