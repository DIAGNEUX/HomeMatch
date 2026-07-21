"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { LoginDto } from "@/types/auth";
import { loginSchema } from "@/validation/login.schema";

import  authService  from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

import InputField from "@/components/ui/InputField";

export default function AgencyLoginForm() {
  const router = useRouter();

  const { login } = useAuth();

  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      setApiError("");

      const response = await authService.login(data);

      login(
        response.data.access_token,
        response.data.user
      );

      switch (response.data.user.role) {
      case "AGENCY":
        router.push("/agency");
        break;

      case "ADMIN":
        router.push("/admin");
        break;

      default:
        router.push("/");
    }
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || "Email ou mot de passe incorrect."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 rounded-lg border p-8 shadow">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Connexion Agence
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Adresse email"
          type="email"
          registration={register("email")}
          error={errors.email?.message}
        />

        <InputField
          label="Mot de passe"
          type="password"
          registration={register("password")}
          error={errors.password?.message}
        />

        {apiError && (
          <p className="text-sm text-red-500">{apiError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-black py-2 text-white"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}