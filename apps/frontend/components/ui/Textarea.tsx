import { TextareaHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

export default function Textarea({
  label,
  registration,
  error,
  ...props
}: TextareaFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>

      <textarea
        {...registration}
        {...props}
        rows={4}
        className={`w-full rounded-lg border px-4 py-3 outline-none transition

        ${
          error
            ? "border-red-500"
            : "border-gray-300 focus:border-primary"
        }`}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}