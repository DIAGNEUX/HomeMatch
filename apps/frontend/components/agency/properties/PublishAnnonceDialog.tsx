"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import announcementService from "@/services/announcement.service";
import type { Annonce } from "@/types/announcement";

interface PublishAnnonceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  annonce: Annonce | null;
  onSuccess: () => void;
}

export default function PublishAnnonceDialog({
  open,
  onOpenChange,
  annonce,
  onSuccess,
}: PublishAnnonceDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!annonce) return;

    setIsPublishing(true);
    setError(null);
    try {
      await announcementService.publish(annonce.id);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error("Erreur lors de la publication de l'annonce :", err);
      setError(
        "Impossible de publier cette annonce. Vérifiez que tous les champs obligatoires sont renseignés."
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publier cette annonce ?</AlertDialogTitle>
          <AlertDialogDescription>
            {annonce
              ? `L'annonce "${annonce.titre}" sera visible publiquement sur la plateforme.`
              : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPublishing}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-[#0B162C] text-white hover:bg-[#1C2942]"
          >
            {isPublishing ? "Publication..." : "Publier"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}