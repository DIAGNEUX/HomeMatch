"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

import {
  createAnnonceSchema,
  CreateAnnonceFormValues,
} from "@/validation/announcement.schema";
import announcementService from "@/services/announcement.service";
import type { Annonce } from "@/types/announcement";

interface AnnonceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  annonce?: Annonce | null;
}

const typeAnnonceOptions = [
  { label: "Vente", value: "VENTE" },
  { label: "Location", value: "LOCATION" },
];

const typeBienOptions = [
  { label: "Appartement", value: "APPARTEMENT" },
  { label: "Maison", value: "MAISON" },
  { label: "Studio", value: "STUDIO" },
  { label: "Terrain", value: "TERRAIN" },
  { label: "Local commercial", value: "LOCAL_COMMERCIAL" },
  { label: "Autre", value: "AUTRE" },
];

export default function AnnonceFormDialog({
  open,
  onOpenChange,
  onSuccess,
  annonce = null,
}: AnnonceFormDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditMode = !!annonce;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAnnonceFormValues>({
    resolver: zodResolver(createAnnonceSchema),
  });

  // Pré-remplit le formulaire quand on ouvre en mode édition,
  // ou le vide quand on ouvre en mode création.
  useEffect(() => {
    if (open) {
      if (annonce) {
        reset({
          titre: annonce.titre,
          description: annonce.description,
          typeAnnonce: annonce.typeAnnonce,
          typeBien: annonce.typeBien,
          prix: annonce.prix,
          surface: annonce.surface,
          nombrePieces: annonce.nombrePieces,
          nombreSallesBains: annonce.nombreSallesBains,
          nombreChambres: annonce.nombreChambres,
          etage: annonce.etage ?? undefined,
          anneeConstruction: annonce.anneeConstruction ?? undefined,
          adresse: annonce.adresse,
          ville: annonce.ville,
        });
      } else {
        reset({});
      }
      setSubmitError(null);
    }
  }, [open, annonce, reset]);

  const onSubmit = async (values: CreateAnnonceFormValues) => {
    setSubmitError(null);

    try {
      if (isEditMode && annonce) {
        await announcementService.update(annonce.id, values);
      } else {
        await announcementService.create(values);
      }
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'annonce :", error);
      setSubmitError("Impossible d'enregistrer l'annonce. Vérifiez les champs.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier l'annonce" : "Ajouter une annonce"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Titre"
            registration={register("titre")}
            error={errors.titre?.message}
          />

          <Textarea
            label="Description"
            registration={register("description")}
            error={errors.description?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type d'annonce"
              registration={register("typeAnnonce")}
              options={typeAnnonceOptions}
              placeholder="Sélectionner"
              error={errors.typeAnnonce?.message}
            />

            <Select
              label="Type de bien"
              registration={register("typeBien")}
              options={typeBienOptions}
              placeholder="Sélectionner"
              error={errors.typeBien?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Prix (€)"
              type="number"
              registration={register("prix", { valueAsNumber: true })}
              error={errors.prix?.message}
            />

            <InputField
              label="Surface (m²)"
              type="number"
              registration={register("surface", { valueAsNumber: true })}
              error={errors.surface?.message}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="Pièces"
              type="number"
              registration={register("nombrePieces", { valueAsNumber: true })}
              error={errors.nombrePieces?.message}
            />

            <InputField
              label="Salles de bain"
              type="number"
              registration={register("nombreSallesBains", {
                valueAsNumber: true,
              })}
              error={errors.nombreSallesBains?.message}
            />

            <InputField
              label="Chambres"
              type="number"
              registration={register("nombreChambres", {
                valueAsNumber: true,
              })}
              error={errors.nombreChambres?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Étage (optionnel)"
              type="number"
              registration={register("etage", { valueAsNumber: true })}
              error={errors.etage?.message}
            />

            <InputField
              label="Année de construction (optionnel)"
              type="number"
              registration={register("anneeConstruction", {
                valueAsNumber: true,
              })}
              error={errors.anneeConstruction?.message}
            />
          </div>

          <InputField
            label="Adresse"
            registration={register("adresse")}
            error={errors.adresse?.message}
          />

          <InputField
            label="Ville"
            registration={register("ville")}
            error={errors.ville?.message}
          />

          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0B162C] text-white hover:bg-[#1C2942]"
            >
              {isSubmitting
                ? "Enregistrement..."
                : isEditMode
                ? "Enregistrer les modifications"
                : "Créer l'annonce"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}