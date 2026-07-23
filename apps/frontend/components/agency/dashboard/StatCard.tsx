"use client";

import { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: string;
  label: string;
  icon: LucideIcon;
  accent?: boolean;
}

export default function StatCard({
  title,
  value,
  label,
  icon: Icon,
  accent = false,
}: StatCardProps) {
  return (
    <Card
      className={`flex items-center justify-between gap-4 p-5 ${
        accent ? "bg-accent/10 border-accent/20" : "bg-surface"
      }`}
    >
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
          {title}
        </p>
        <p className="text-3xl font-semibold text-primary">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>

      <div
        className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl ${
          accent ? "bg-primary/10 text-primary" : "bg-gray-100 text-primary"
        }`}
      >
        <Icon size={24} />
      </div>
    </Card>
  );
}
