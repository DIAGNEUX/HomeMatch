import { TypeBien } from '@prisma/client';

export const propertyTypeMapper: Record<string, TypeBien> = {
  HOUSE: TypeBien.MAISON,
  APARTMENT: TypeBien.APPARTEMENT,
  STUDIO: TypeBien.STUDIO,
  LAND: TypeBien.TERRAIN,
  COMMERCIAL: TypeBien.LOCAL_COMMERCIAL,
};