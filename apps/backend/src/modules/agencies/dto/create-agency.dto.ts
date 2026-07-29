import {
  IsOptional,
  IsString,
  Length,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const emptyStringToUndefined = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export class CreateAgencyDto {
  @Transform(trimString)
  @IsString()
  @Length(2, 255)
  name!: string;

  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsString()
  @Length(10, 1000)
  description?: string;

  @Transform(trimString)
  @IsString()
  @Length(14, 14)
  siret!: string;

  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone?: string;

  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsUrl()
  website?: string;

  @Transform(trimString)
  @IsString()
  @Length(5, 255)
  address!: string;

  @Transform(trimString)
  @IsString()
  @Length(2, 100)
  city!: string;

  @Transform(trimString)
  @IsString()
  @Length(4, 20)
  postalCode!: string;

  @Transform(emptyStringToUndefined)
  @IsOptional()
  @IsString()
  logo?: string;
}
