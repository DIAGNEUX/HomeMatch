import Link from "next/link";
import { MapPin, BedDouble, Bath, Ruler, ImageOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import FavoriteButton from "@/components/user/favorites/FavoriteButton";
import type { Annonce } from "@/types/announcement";
import { getImageUrl } from "@/lib/image-url";

const typeBienLabel: Record<Annonce["typeBien"], string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  STUDIO: "Studio",
  TERRAIN: "Terrain",
  LOCAL_COMMERCIAL: "Local commercial",
  AUTRE: "Autre",
};

const typeAnnonceLabel: Record<Annonce["typeAnnonce"], string> = {
  VENTE: "Vente",
  LOCATION: "Location",
};

interface AnnonceCardProps {
  annonce: Annonce;
}

export default function AnnonceCard({ annonce }: AnnonceCardProps) {
  const firstImage = annonce.images?.[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
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
          className="absolute right-3 top-3 bg-white/95 shadow-sm"
        />
      </div>

      <Link
        href={`/annonces/${annonce.id}`}
        className="flex flex-1 flex-col gap-3 p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground line-clamp-1">
            {annonce.titre}
          </h3>
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
      </Link>
    </article>
  );
}
