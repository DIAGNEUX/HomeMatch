"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginFormData } from "@/validation/login.schema";
import authService from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import InputField from "@/components/ui/InputField";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError("");

      const response = await authService.login(data);

      login(response.data.access_token, response.data.user);

      router.push("/");
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ??
          "Adresse email ou mot de passe incorrect."
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Connexion
      </h1>

      {apiError && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {apiError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
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

        <div className="text-right">
          <a
            href="/register"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Pas encore de compte ? S'inscrire
          </a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}