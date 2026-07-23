"use client";

import { isAxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/button";

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

      const registerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      };

      await authService.register(registerData);

      router.push("/login");
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setApiError(
        message ?? "Une erreur est survenue."
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full cursor-pointer rounded-2xl bg-primary px-4 font-semibold text-white hover:bg-primary-800"
        >
          {isSubmitting
            ? "Création du compte..."
            : "Créer mon compte"}
        </Button>
      </form>
    </div>
  );
}
