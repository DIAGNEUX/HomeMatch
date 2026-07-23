import { SelectHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  registration: UseFormRegisterReturn;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export default function Select({
  label,
  registration,
  options,
  placeholder,
  error,
  ...props
}: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>

      <select
        {...registration}
        {...props}
        defaultValue=""
        className={`w-full rounded-lg border px-4 py-3 outline-none transition bg-white

        ${
          error
            ? "border-red-500"
            : "border-gray-300 focus:border-primary"
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}