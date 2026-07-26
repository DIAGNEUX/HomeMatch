"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, ImageOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import announcementService from "@/services/announcement.service";
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

interface AnnonceDetailProps {
  id: string;
}

export default function AnnonceDetail({ id }: AnnonceDetailProps) {
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const response = await announcementService.findOne(id);
        setAnnonce(response.data.data);
      } catch (err) {
        console.error("Erreur lors du chargement de l'annonce :", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonce();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (notFound || !annonce) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-lg font-medium text-foreground">
          Cette annonce est introuvable.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Elle a peut-être été supprimée ou dépubliée.
        </p>
        <Link
          href="/recherche"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#0B162C] hover:underline"
        >
          <ArrowLeft size={16} />
          Retour à la recherche
        </Link>
      </div>
    );
  }

  const images = annonce.images ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/recherche"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Retour aux résultats
      </Link>

      <div className="overflow-hidden rounded-2xl border border-border bg-gray-100">
        {images.length > 0 ? (
          <>
            <div className="h-80 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(images[activeImage].url)}
                alt={annonce.titre}
                className="h-full w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                      index === activeImage
                        ? "border-[#5FC2BA]"
                        : "border-transparent"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(img.url)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-80 flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff size={28} />
            Aucune image disponible
          </div>
        )}
      </div>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {annonce.titre}
          </h1>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} />
            {annonce.adresse}, {annonce.ville}
          </div>
        </div>
        <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
          {typeAnnonceLabel[annonce.typeAnnonce]}
        </Badge>
      </div>

      <p className="mt-4 text-2xl font-semibold text-[#0B162C]">
        {annonce.prix.toLocaleString("fr-FR")} €
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border p-5 sm:grid-cols-4">
        <div>
          <p className="text-xs text-muted-foreground">Type de bien</p>
          <p className="font-medium text-foreground">
            {typeBienLabel[annonce.typeBien]}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Surface</p>
          <p className="font-medium text-foreground">{annonce.surface} m²</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pièces</p>
          <p className="font-medium text-foreground">{annonce.nombrePieces}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Chambres</p>
          <p className="font-medium text-foreground">{annonce.nombreChambres}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Salles de bain</p>
          <p className="font-medium text-foreground">{annonce.nombreSallesBains}</p>
        </div>
        {annonce.etage != null && (
          <div>
            <p className="text-xs text-muted-foreground">Étage</p>
            <p className="font-medium text-foreground">{annonce.etage}</p>
          </div>
        )}
        {annonce.anneeConstruction != null && (
          <div>
            <p className="text-xs text-muted-foreground">Année de construction</p>
            <p className="font-medium text-foreground">
              {annonce.anneeConstruction}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-foreground">Description</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
          {annonce.description}
        </p>
      </div>
    </div>
  );
}