"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import authService from "@/services/auth.service";
import agencyService from "@/services/agency.service";
import { useAuth } from "@/hooks/useAuth";

import AgencyRegisterStep1 from "./AgencyRegisterStep1";
import AgencyRegisterStep2 from "./AgencyRegisterStep2";

import { AgencyRegisterFormData } from "@/types/auth";
import { CreateAgencyDto } from "@/types/agency";

type Step1Data = Pick<
  AgencyRegisterFormData,
  | "firstName"
  | "lastName"
  | "email"
  | "password"
  | "phone"
  | "confirmPassword"
>;

type Step2Data = CreateAgencyDto;

export default function AgencyRegisterForm() {
  const router = useRouter();

  const { login } = useAuth();

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [accountData, setAccountData] =
    useState<Step1Data | null>(null);

  const handleNext = (data: Step1Data) => {
    setAccountData(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleFinish = async (
    agencyData: Step2Data
  ) => {
    if (!accountData) return;

    try {
      setLoading(true);

      // Création du compte agence
      const response =
        await authService.registerAgency({
          firstName: accountData.firstName,
          lastName: accountData.lastName,
          email: accountData.email,
          password: accountData.password,
          phone: accountData.phone,
        });

      // Connexion automatique
      login(
        response.data.access_token,
        response.data.user
      );

      // Création de l'agence
      await agencyService.create(agencyData);

      router.push("/agency");
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 shadow">
      {/* Stepper */}

      <div className="mb-8">
        <p className="mb-4 text-center text-sm text-gray-500">
          Étape {step} sur 2
        </p>

        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              step >= 1
                ? "bg-black"
                : "bg-gray-300"
            }`}
          />

          <div
            className={`h-1 flex-1 ${
              step >= 2
                ? "bg-black"
                : "bg-gray-300"
            }`}
          />

          <div
            className={`h-3 w-3 rounded-full ${
              step >= 2
                ? "bg-black"
                : "bg-gray-300"
            }`}
          />
        </div>
      </div>

      {step === 1 && (
        <AgencyRegisterStep1
          defaultValues={accountData ?? undefined}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <AgencyRegisterStep2
          onBack={handleBack}
          onSubmit={handleFinish}
          loading={loading}
        />
      )}
    </div>
  );
}