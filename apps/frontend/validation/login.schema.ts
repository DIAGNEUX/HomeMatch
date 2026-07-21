import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Veuillez saisir une adresse email valide"),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type LoginFormData = z.infer<typeof loginSchema>;