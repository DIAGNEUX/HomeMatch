import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @Length(2, 100)
  firstName!: string;

  @IsString()
  @Length(2, 100)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 255)
  password!: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  phone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}