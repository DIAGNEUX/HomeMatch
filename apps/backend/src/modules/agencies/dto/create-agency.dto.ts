import {
  IsOptional,
  IsString,
  Length,
  IsUrl,
} from 'class-validator';

export class CreateAgencyDto {
  @IsString()
  @Length(2, 255)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(10, 1000)
  description?: string;

  @IsString()
  @Length(14, 14)
  siret!: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsString()
  @Length(5, 255)
  address!: string;

  @IsString()
  @Length(2, 100)
  city!: string;

  @IsString()
  @Length(4, 20)
  postalCode!: string;

  @IsOptional()
  @IsString()
  logo?: string;
}