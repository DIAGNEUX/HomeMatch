import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatMessageDto {
  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}