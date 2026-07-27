"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginFormData } from "@/validation/login.schema";
import authService from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  redirectTo?: string;
  registerHref?: string;
  registerLabel?: string;
}

export default function LoginForm({
  redirectTo = "/",
  registerHref = "/register",
  registerLabel = "Pas encore de compte ? S'inscrire",
}: LoginFormProps) {
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

      login(response.data.user);

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setApiError(
        message ?? "Adresse email ou mot de passe incorrect."
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
          <Link
            href={registerHref}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {registerLabel}
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full cursor-pointer rounded-2xl bg-primary px-4 font-semibold text-white hover:bg-primary-800"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
