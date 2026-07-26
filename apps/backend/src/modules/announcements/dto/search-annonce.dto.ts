import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class SearchAnnonceDto {
  @IsOptional()
  @IsString()
  q?: string; // mot-clé de recherche libre

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsIn(['VENTE', 'LOCATION'])
  typeAnnonce?: 'VENTE' | 'LOCATION';

  @IsOptional()
  @IsIn(['APPARTEMENT', 'MAISON', 'STUDIO', 'TERRAIN', 'LOCAL_COMMERCIAL', 'AUTRE'])
  typeBien?: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  prixMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  prixMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  surfaceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nombrePiecesMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nombreChambresMin?: number;

  @IsOptional()
  @IsIn(['prix', 'surface', 'createdAt'])
  sortBy?: 'prix' | 'surface' | 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 12;
}