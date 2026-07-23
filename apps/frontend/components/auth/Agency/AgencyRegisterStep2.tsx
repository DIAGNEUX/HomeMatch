"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "@/components/ui/InputField";
import { agencyRegisterSchema } from "@/validation/agency-register.schema";
import { AgencyRegisterFormData } from "@/types/auth";

type AgencyFormData = Pick<
  AgencyRegisterFormData,
  | "name"
  | "description"
  | "siret"
  | "website"
  | "address"
  | "city"
  | "postalCode"
>;

interface AgencyFormProps {
  defaultValues?: Partial<AgencyFormData>;
  onBack: () => void;
  onSubmit: (data: AgencyFormData) => void;
  loading: boolean;
}

export default function AgencyForm({
  defaultValues,
  onBack,
  onSubmit,
}: AgencyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AgencyFormData>({
    resolver: zodResolver(agencyRegisterSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <InputField
        label="Nom de l'agence"
        registration={register("name")}
        error={errors.name?.message}
      />

      <InputField
        label="SIRET"
        registration={register("siret")}
        error={errors.siret?.message}
      />

      <InputField
        label="Adresse"
        registration={register("address")}
        error={errors.address?.message}
      />

      <InputField
        label="Ville"
        registration={register("city")}
        error={errors.city?.message}
      />

      <InputField
        label="Code postal"
        registration={register("postalCode")}
        error={errors.postalCode?.message}
      />

      <InputField
        label="Site web"
        registration={register("website")}
        error={errors.website?.message}
      />

      <InputField
        label="Description"
        registration={register("description")}
        error={errors.description?.message}
      />

      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-md border border-gray-300 py-2 hover:bg-gray-100"
        >
          Retour
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-md bg-black py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Créer mon agence
        </button>
      </div>
    </form>
  );
}