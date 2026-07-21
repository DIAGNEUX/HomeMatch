"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "@/components/ui/InputField";

import authService from "@/services/auth.service";

import {
  registerSchema,
  RegisterFormData,
} from "@/validation/register.schema";

export default function RegisterForm() {
  const router = useRouter();

  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setApiError("");

      const { confirmPassword, ...registerData } = data;

      await authService.register(registerData);

      router.push("/login");
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ??
          "Une erreur est survenue."
      );
    }
  };

  return (
    <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Créer un compte
      </h1>

      {apiError && (
        <div className="rounded-lg bg-red-100 p-3 text-red-700">
          {apiError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
      >
        <InputField
          label="Prénom"
          registration={register("firstName")}
          error={errors.firstName?.message}
        />

        <InputField
          label="Nom"
          registration={register("lastName")}
          error={errors.lastName?.message}
        />

        <InputField
          label="Adresse email"
          type="email"
          placeholder="exemple@email.com"
          registration={register("email")}
          error={errors.email?.message}
        />

        <InputField
          label="Téléphone"
          placeholder="06 00 00 00 00"
          registration={register("phone")}
          error={errors.phone?.message}
        />

        <InputField
          label="Mot de passe"
          type="password"
          placeholder="********"
          registration={register("password")}
          error={errors.password?.message}
        />

        <InputField
          label="Confirmer le mot de passe"
          type="password"
          placeholder="********"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting
            ? "Création du compte..."
            : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}