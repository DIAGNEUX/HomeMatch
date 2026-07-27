import { IsIn, IsOptional, IsString } from 'class-validator';

export class AdminSearchAnnonceDto {
  @IsOptional()
  @IsString()
  agencyId?: string;

  @IsOptional()
  @IsIn(['BROUILLON', 'PUBLIEE'])
  statut?: 'BROUILLON' | 'PUBLIEE';
}