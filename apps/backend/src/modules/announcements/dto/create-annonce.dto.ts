import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
    MaxLength,
  } from 'class-validator';
  import { TypeAnnonce, TypeBien } from '@prisma/client';
  
  export class CreateAnnonceDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    titre!: string;
  
    @IsString()
    @IsNotEmpty()
    description!: string;
  
    @IsEnum(TypeAnnonce)
    typeAnnonce!: TypeAnnonce;
  
    @IsEnum(TypeBien)
    typeBien!: TypeBien;
  
    @IsNumber()
    @IsPositive()
    prix!: number;
  
    @IsNumber()
    @IsPositive()
    surface!: number;
  
    @IsInt()
    @Min(0)
    nombrePieces!: number;
  
    @IsInt()
    @Min(0)
    nombreSallesBains!: number;
  
    @IsOptional()
    @IsInt()
    etage?: number;
  
    @IsOptional()
    @IsInt()
    @Min(1800)
    anneeConstruction?: number;
  
    @IsInt()
    @Min(0)
    nombreChambres!: number;
  
    @IsString()
    @IsNotEmpty()
    adresse!: string;
  
    @IsString()
    @IsNotEmpty()
    ville!: string;
  }