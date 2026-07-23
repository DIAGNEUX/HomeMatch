"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "@/components/ui/InputField";
import { registerSchema } from "@/validation/register.schema";
import { RegisterDto } from "@/types/auth";

type AccountFormData = RegisterDto & {
  confirmPassword: string;
};

interface AccountFormProps {
  defaultValues?: Partial<AccountFormData>;
  onNext: (data: AccountFormData) => void;
}

export default function AccountForm({
  defaultValues,
  onNext,
}: AccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const submit = (data: AccountFormData) => {
    onNext(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-4"
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-black py-2 text-white"
      >
        Continuer
      </button>
    </form>
  );
}