import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVisitRequestDto {
  @ApiPropertyOptional({
    example: 'Bonjour, je souhaite visiter ce bien en fin de journee.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;

  @ApiProperty({
    example: '2026-08-05T14:00:00.000Z',
    description: 'Requested visit date and time, in ISO format.',
  })
  @IsDateString()
  requestedVisitDate!: string;
}
