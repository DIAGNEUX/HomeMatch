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
import adminService from "@/services/admin.service";
import type { AdminUser } from "@/types/admin";

interface DeactivateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
  onSuccess: () => void;
}

export default function DeactivateUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: DeactivateUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await adminService.deactivateUser(user.id);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la désactivation du compte :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Désactiver ce compte ?</AlertDialogTitle>
          <AlertDialogDescription>
            {user
              ? `${user.firstName} ${user.lastName} (${user.email}) ne pourra plus se connecter à la plateforme.`
              : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isSubmitting ? "Désactivation..." : "Désactiver"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}