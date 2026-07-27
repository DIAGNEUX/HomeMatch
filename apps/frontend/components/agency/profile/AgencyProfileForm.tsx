"use client";

import { type FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import agencyService from "@/services/agency.service";
import type { Agency, UpdateAgencyDto } from "@/types/agency";

type AgencyProfileFormData = Required<
  Pick<UpdateAgencyDto, "name" | "description" | "phone" | "website" | "address" | "city" | "postalCode">
>;

const emptyFormData: AgencyProfileFormData = {
  name: "",
  description: "",
  phone: "",
  website: "",
  address: "",
  city: "",
  postalCode: "",
};

export default function AgencyProfileForm() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [formData, setFormData] = useState<AgencyProfileFormData>(emptyFormData);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const response = await agencyService.me();
        const agencyData = response.data;

        setAgency(agencyData);
        setFormData({
          name: agencyData.name,
          description: agencyData.description ?? "",
          phone: agencyData.phone ?? "",
          website: agencyData.website ?? "",
          address: agencyData.address,
          city: agencyData.city,
          postalCode: agencyData.postalCode,
        });
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du profil agence :", err);
        setError("Impossible de charger le profil de votre agence.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, []);

  const handleChange = (field: keyof AgencyProfileFormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: UpdateAgencyDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        website: formData.website.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
      };

      const response = await agencyService.update(payload);
      const updatedAgency = response.data;

      setAgency(updatedAgency);
      setFormData({
        name: updatedAgency.name,
        description: updatedAgency.description ?? "",
        phone: updatedAgency.phone ?? "",
        website: updatedAgency.website ?? "",
        address: updatedAgency.address,
        city: updatedAgency.city,
        postalCode: updatedAgency.postalCode,
      });
      setSuccess("Le profil de votre agence a bien été mis à jour.");
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil agence :", err);
      setError("Impossible de mettre à jour le profil de votre agence.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </section>
    );
  }

  if (error && !agency) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Profil agence
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consultez et modifiez les informations publiques de votre agence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Nom de l'agence
            </label>
            <Input
              value={formData.name}
              onChange={(event) => handleChange("name", event.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">SIRET</label>
            <Input value={agency?.siret ?? ""} disabled />
            <p className="text-xs text-muted-foreground">
              Le SIRET est conservé en lecture seule.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Téléphone
            </label>
            <Input
              value={formData.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              minLength={8}
              maxLength={20}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Site web
            </label>
            <Input
              type="url"
              value={formData.website}
              onChange={(event) => handleChange("website", event.target.value)}
              placeholder="https://www.votre-agence.fr"
            />
          </div>

          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Adresse
            </label>
            <Input
              value={formData.address}
              onChange={(event) => handleChange("address", event.target.value)}
              required
              minLength={5}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Ville</label>
            <Input
              value={formData.city}
              onChange={(event) => handleChange("city", event.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Code postal
            </label>
            <Input
              value={formData.postalCode}
              onChange={(event) =>
                handleChange("postalCode", event.target.value)
              }
              required
              minLength={4}
            />
          </div>

          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              rows={5}
              className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/50"
              placeholder="Décrivez votre agence, vos spécialités et votre zone d'intervention."
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
  );
}
