"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bath, BedDouble, ImageOff, MapPin, Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FavoriteButton from "@/components/user/favorites/FavoriteButton";
import { useAuth } from "@/hooks/useAuth";
import { getImageUrl } from "@/lib/image-url";
import favoriteService from "@/services/favorite.service";
import type { Annonce } from "@/types/announcement";
import type { Favorite } from "@/types/favorite";

const typeAnnonceLabel: Record<Annonce["typeAnnonce"], string> = {
  VENTE: "Vente",
  LOCATION: "Location",
};

const typeBienLabel: Record<Annonce["typeBien"], string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  STUDIO: "Studio",
  TERRAIN: "Terrain",
  LOCAL_COMMERCIAL: "Local commercial",
  AUTRE: "Autre",
};

export default function UserFavoritesGrid() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (loading || !isAuthenticated) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await favoriteService.findMine();
        setFavorites(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des favoris :", err);
        setError("Impossible de charger vos favoris.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [loading, isAuthenticated]);

  const removeFromList = (announcementId: string) => {
    setFavorites((current) =>
      current.filter((favorite) => favorite.annonceId !== announcementId)
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-[#0B162C]">
            Mes favoris
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Retrouvez les annonces que vous avez sauvegardées.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/account">Mon compte</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/account/visits">Mes demandes</Link>
          </Button>
        </div>
      </div>

      {(loading || isLoading) && (
        <section className="rounded-2xl border border-border bg-white p-6 text-center text-sm text-muted-foreground shadow-sm">
          Chargement...
        </section>
      )}

      {!loading && !isLoading && error && (
        <section className="rounded-2xl border border-border bg-white p-6 text-center text-sm text-red-600 shadow-sm">
          {error}
        </section>
      )}

      {!loading && !isLoading && !error && favorites.length === 0 && (
        <section className="rounded-2xl border border-border bg-white p-6 text-center text-sm text-muted-foreground shadow-sm">
          Vous n'avez aucune annonce en favori pour le moment.
        </section>
      )}

      {!loading && !isLoading && !error && favorites.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((favorite) => {
            const annonce = favorite.annonce;
            const firstImage = annonce.images?.[0];

            return (
              <article
                key={favorite.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
              >
                <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gray-100">
                  <Link href={`/annonces/${annonce.id}`} className="h-full w-full">
                    {firstImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(firstImage.url)}
                        alt={annonce.titre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-1 text-sm text-muted-foreground">
                        <ImageOff size={20} />
                        Aucune image
                      </div>
                    )}
                  </Link>
                  <FavoriteButton
                    announcementId={annonce.id}
                    initialIsFavorite
                    className="absolute right-3 top-3 bg-white/95 shadow-sm"
                    onChanged={(isFavorite) => {
                      if (!isFavorite) removeFromList(annonce.id);
                    }}
                  />
                </div>

                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/annonces/${annonce.id}`}
                      className="line-clamp-2 text-base font-semibold text-foreground hover:underline"
                    >
                      {annonce.titre}
                    </Link>
                    <Badge
                      variant="outline"
                      className="shrink-0 border-gray-200 bg-gray-50 text-gray-700"
                    >
                      {typeAnnonceLabel[annonce.typeAnnonce]}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    {annonce.ville}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Ruler size={14} />
                      {annonce.surface} m²
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble size={14} />
                      {annonce.nombreChambres} ch.
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={14} />
                      {annonce.nombreSallesBains} sdb
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {typeBienLabel[annonce.typeBien]}
                    </span>
                    <span className="text-lg font-semibold text-[#0B162C]">
                      {annonce.prix.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
