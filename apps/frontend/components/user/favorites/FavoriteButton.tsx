"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import favoriteService from "@/services/favorite.service";

interface FavoriteButtonProps {
  announcementId: string;
  className?: string;
  iconOnly?: boolean;
  initialIsFavorite?: boolean;
  onChanged?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({
  announcementId,
  className,
  iconOnly = true,
  initialIsFavorite = false,
  onChanged,
}: FavoriteButtonProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (loading) {
        return;
      }

      if (user?.role !== "USER") {
        setIsFavorite(initialIsFavorite);
        return;
      }

      try {
        const response = await favoriteService.getStatus(announcementId);
        setIsFavorite(response.data.data.isFavorite);
      } catch (error) {
        console.error("Erreur lors du chargement du statut favori :", error);
      }
    };

    fetchStatus();
  }, [announcementId, initialIsFavorite, loading, user?.role]);

  const toggleFavorite = async () => {
    if (loading || isSubmitting) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "USER") {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isFavorite) {
        await favoriteService.remove(announcementId);
        setIsFavorite(false);
        onChanged?.(false);
      } else {
        await favoriteService.add(announcementId);
        setIsFavorite(true);
        onChanged?.(true);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du favori :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!loading && user && user.role !== "USER") {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={iconOnly ? "icon" : "default"}
      disabled={isSubmitting}
      onClick={toggleFavorite}
      className={className}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        className={
          isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
        }
      />
      {!iconOnly && (
        <span>{isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}</span>
      )}
    </Button>
  );
}
