"use client";

import { useRef, useState } from "react";
import { Trash2, Upload, ImageOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import imageService from "@/services/image.service";
import type { Annonce } from "@/types/announcement";
import { getImageUrl } from "@/lib/image-url";

interface ManageImagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  annonce: Annonce | null;
  onSuccess: () => void;
}

export default function ManageImagesDialog({
  open,
  onOpenChange,
  annonce,
  onSuccess,
}: ManageImagesDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!annonce) return null;

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      await imageService.upload(annonce.id, file);
      onSuccess();
    } catch (err) {
      console.error("Erreur lors de l'upload de l'image :", err);
      setError("Impossible d'ajouter cette image (format ou taille invalide).");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId);
    setError(null);

    try {
      await imageService.remove(annonce.id, imageId);
      onSuccess();
    } catch (err) {
      console.error("Erreur lors de la suppression de l'image :", err);
      setError("Impossible de supprimer cette image.");
    } finally {
      setDeletingId(null);
    }
  };

  const images = annonce.images ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Images de l&apos;annonce</DialogTitle>
        </DialogHeader>

        {images.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 py-10 text-muted-foreground">
            <ImageOff size={24} />
            <p className="text-sm">Aucune image pour cette annonce</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(img.url)}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  disabled={deletingId === img.id}
                  className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-50"
                  aria-label="Supprimer cette image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload-input"
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full gap-2"
          >
            <Upload size={16} />
            {isUploading ? "Envoi en cours..." : "Ajouter une image"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Formats acceptés : JPEG, PNG, WEBP — 5 Mo maximum.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}