import { z } from "zod";

export const agencyRegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom de l'agence est obligatoire"),

  siret: z
    .string()
    .length(14, "Le SIRET doit contenir 14 chiffres"),

  address: z
    .string()
    .min(2, "L'adresse est obligatoire"),

  city: z
    .string()
    .min(2, "La ville est obligatoire"),

  postalCode: z
    .string()
    .length(5, "Le code postal doit contenir 5 chiffres"),

  website: z.string().optional(),

  description: z.string().optional(),
});

export type AgencyRegisterData = z.infer<
  typeof agencyRegisterSchema
>;