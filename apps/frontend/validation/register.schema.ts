import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),

    lastName: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères"),

    email: z
      .string()
      .email("Adresse email invalide"),

    phone: z
      .string()
      .optional(),

      
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Les mots de passe ne correspondent pas.",
    }
  );

export type RegisterFormData = z.infer<typeof registerSchema>;