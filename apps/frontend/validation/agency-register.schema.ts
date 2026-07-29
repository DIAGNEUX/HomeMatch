import { z } from "zod";

const optionalTrimmedText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const agencyRegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom de l'agence est obligatoire")
    .max(255, "Le nom de l'agence est trop long"),

  siret: z
    .string()
    .trim()
    .regex(/^\d{14}$/, "Le SIRET doit contenir 14 chiffres"),

  address: z
    .string()
    .trim()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(255, "L'adresse est trop longue"),

  city: z
    .string()
    .trim()
    .min(2, "La ville est obligatoire")
    .max(100, "La ville est trop longue"),

  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),

  website: optionalTrimmedText.pipe(
    z.url("Le site web doit être une URL valide").optional()
  ),

  description: optionalTrimmedText.pipe(
    z
      .string()
      .min(10, "La description doit contenir au moins 10 caractères")
      .max(1000, "La description est trop longue")
      .optional()
  ),
});

export type AgencyRegisterData = z.infer<
  typeof agencyRegisterSchema
>;
