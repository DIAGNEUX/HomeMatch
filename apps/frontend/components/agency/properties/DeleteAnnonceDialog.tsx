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

interface DeleteAnnonceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  annonce: Annonce | null;
  onSuccess: () => void;
}

export default function DeleteAnnonceDialog({
  open,
  onOpenChange,
  annonce,
  onSuccess,
}: DeleteAnnonceDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!annonce) return;

    setIsDeleting(true);
    try {
      await announcementService.remove(annonce.id);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'annonce :", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
          <AlertDialogDescription>
            {annonce
              ? `L'annonce "${annonce.titre}" sera définitivement supprimée. Cette action est irréversible.`
              : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}