"use client";

import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-800 focus:ring-primary-700",
  secondary:
    "bg-accent/10 text-primary border border-accent text-primary hover:bg-accent/20 focus:ring-accent/40",
  outline:
    "border border-gray-200 bg-white text-primary hover:bg-gray-50 focus:ring-accent/40",
  ghost:
    "bg-transparent text-primary hover:bg-gray-100 focus:ring-accent/40",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-700",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
