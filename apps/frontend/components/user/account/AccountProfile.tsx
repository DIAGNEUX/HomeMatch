"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import userService from "@/services/user.service";
import type { UpdateUserDto } from "@/types/auth";

export default function AccountProfile() {
  const { user, loading, isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<UpdateUserDto>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground">
        Chargement...
      </div>
    );
  }

  const handleChange = (field: keyof UpdateUserDto, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await userService.updateMe({
        ...formData,
        phone: formData.phone?.trim() || undefined,
      });
      await refreshUser();
      setSuccess("Vos informations ont bien été mises à jour.");
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil :", err);
      setError("Impossible de mettre à jour vos informations.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-[#0B162C]">Mon compte</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultez et modifiez vos informations personnelles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/account/visits">Mes demandes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/account/favorites">Mes favoris</Link>
          </Button>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Prénom
              </label>
              <Input
                value={formData.firstName ?? ""}
                onChange={(event) =>
                  handleChange("firstName", event.target.value)
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nom</label>
              <Input
                value={formData.lastName ?? ""}
                onChange={(event) =>
                  handleChange("lastName", event.target.value)
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                value={formData.email ?? ""}
                onChange={(event) => handleChange("email", event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Téléphone
              </label>
              <Input
                value={formData.phone ?? ""}
                onChange={(event) => handleChange("phone", event.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0B162C] text-white hover:bg-[#1C2942]"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
