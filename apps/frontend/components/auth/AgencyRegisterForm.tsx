"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterAgencyDto } from "@/types/auth";
import { registerSchema } from "@/validation/register.schema";
import authService  from "@/services/auth.service";

import InputField from "@/components/ui/InputField";

type RegisterFormData = RegisterAgencyDto & {
  confirmPassword: string;
};

export default function AgencyRegisterForm() {
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

    await authService.registerAgency(registerData as RegisterAgencyDto);

      router.push("/agency/login");
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || "Une erreur est survenue."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 rounded-lg border p-8 shadow">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Créer une agence
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          label="Email"
          type="email"
          registration={register("email")}
          error={errors.email?.message}
        />

        <InputField
          label="Téléphone"
          registration={register("phone")}
          error={errors.phone?.message}
        />

        <InputField
          label="Mot de passe"
          type="password"
          registration={register("password")}
          error={errors.password?.message}
        />

        <InputField
          label="Confirmer le mot de passe"
          type="password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {apiError && (
          <p className="text-sm text-red-500">{apiError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-black py-2 text-white"
        >
          {isSubmitting ? "Création..." : "Créer mon compte agence"}
        </button>
      </form>
    </div>
  );
}