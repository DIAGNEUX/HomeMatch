import { ApiProperty } from '@nestjs/swagger';
import { StatutDemandeVisite as VisitRequestStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateVisitRequestStatusDto {
  @ApiProperty({
    enum: VisitRequestStatus,
    example: VisitRequestStatus.ACCEPTEE,
  })
  @IsEnum(VisitRequestStatus)
  status!: VisitRequestStatus;
}
