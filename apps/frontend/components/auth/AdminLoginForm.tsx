"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import { loginSchema, LoginFormData } from "@/validation/login.schema";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import adminAuthService from "@/services/admin-auth.service";

export default function AdminLoginForm() {
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
      const response = await adminAuthService.login(data);
      login(response.data.user);
      router.push("/homematch/intranet");
      router.refresh();
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setApiError(message ?? "Adresse email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
        Connexion admin
      </h1>
      <p className="mb-6 text-center text-sm text-slate-500">
        Accédez à l’intranet HomeMatch
      </p>

      {apiError && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Adresse email"
          type="email"
          placeholder="admin@homematch.com"
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-2xl bg-slate-900 font-semibold text-white hover:bg-slate-700"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
