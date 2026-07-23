import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-[28px] border border-surface bg-white p-6 shadow-[0_18px_45px_-20px_rgba(11,22,44,0.25)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
