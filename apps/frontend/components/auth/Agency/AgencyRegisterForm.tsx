"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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

const optionalText = (value?: string) => {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : undefined;
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; error?: unknown }
      | undefined;
    const message = data?.message ?? data?.error;

    if (Array.isArray(message)) {
      return message.join("\n");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Une erreur est survenue.";
};

export default function AgencyRegisterForm() {
  const router = useRouter();

  const { login, user } = useAuth();

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [accountData, setAccountData] =
    useState<Step1Data | null>(null);

  useEffect(() => {
    if (user?.role === "AGENCY" && !accountData) {
      setStep(2);
    }
  }, [accountData, user?.role]);

  const handleNext = (data: Step1Data) => {
    setErrorMessage(null);
    setAccountData(data);
    setStep(2);
  };

  const handleBack = () => {
    setErrorMessage(null);
    setStep(1);
  };

  const handleFinish = async (
    agencyData: Step2Data
  ) => {
    if (!accountData && user?.role !== "AGENCY") return;

    try {
      setLoading(true);
      setErrorMessage(null);

      // Création du compte agence
      if (accountData) {
        const response =
          await authService.registerAgency({
            firstName: accountData.firstName,
            lastName: accountData.lastName,
            email: accountData.email,
            password: accountData.password,
            phone: accountData.phone,
          });

        // Connexion automatique
        login(response.data.user);
      }

      // Création de l'agence
      const agencyPayload: CreateAgencyDto = {
        name: agencyData.name.trim(),
        siret: agencyData.siret.trim(),
        address: agencyData.address.trim(),
        city: agencyData.city.trim(),
        postalCode: agencyData.postalCode.trim(),
        description: optionalText(agencyData.description),
        website: optionalText(agencyData.website),
      };

      await agencyService.create(agencyPayload);

      router.push("/agency");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage(getErrorMessage(error));
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

      {errorMessage && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

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
