import { z } from "zod";

export const createAnnonceSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").max(150),
  description: z.string().min(1, "La description est requise"),
  typeAnnonce: z.enum(["VENTE", "LOCATION"], {
    error: "Le type d'annonce est requis",
  }),
  typeBien: z.enum(
    ["APPARTEMENT", "MAISON", "STUDIO", "TERRAIN", "LOCAL_COMMERCIAL", "AUTRE"],
    { error: "Le type de bien est requis" }
  ),
  prix: z.number().positive("Le prix doit être positif"),
  surface: z.number().positive("La surface doit être positive"),
  nombrePieces: z.number().int().min(0),
  nombreSallesBains: z.number().int().min(0),
  nombreChambres: z.number().int().min(0),
  etage: z.number().int().optional(),
  anneeConstruction: z.number().int().min(1800).optional(),
  adresse: z.string().min(1, "L'adresse est requise"),
  ville: z.string().min(1, "La ville est requise"),
});

export type CreateAnnonceFormValues = z.infer<typeof createAnnonceSchema>;