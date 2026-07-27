import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/image-url";
import { Bath, BedDouble, Home, MapPin, Ruler } from "lucide-react";

import { Recommendation } from "@/types/assistant";

type RecommendationCardProps = {
  recommendation: Recommendation;
};

const propertyTypeLabels: Record<string, string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  STUDIO: "Studio",
  TERRAIN: "Terrain",
  LOCAL_COMMERCIAL: "Local commercial",
  AUTRE: "Bien",
};

function formatPrice(price: number, typeAnnonce: string) {
  const formattedPrice = new Intl.NumberFormat("fr-FR").format(price);

  return typeAnnonce === "LOCATION"
    ? `${formattedPrice} €/mois`
    : `${formattedPrice} €`;
}

export default function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const { annonce, highlights, differences, score } = recommendation;
  const rawImage = annonce.images?.[0]?.url;
  const imageUrl = rawImage ? getImageUrl(rawImage) : "";
  const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";
  const isAbsolute = /^https?:\/\//i.test(imageUrl);
  const isLocalBackend = isAbsolute && (
    imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1') || baseURL && imageUrl.startsWith(baseURL)
  );

  return (
    <Link
      href={`/annonces/${annonce.id}`}
      className="block overflow-hidden rounded-lg border border-gray-100 bg-white shadow-[0_18px_40px_-30px_rgba(11,22,44,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_46px_-28px_rgba(11,22,44,0.75)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#5FC2BA]/40"
      aria-label={`Voir le détail de l'annonce ${annonce.titre}`}
    >
      <div className="relative h-36 bg-[#F3F6F8]">
        {imageUrl ? (
          isLocalBackend ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={annonce.titre} className="object-cover w-full h-full" />
          ) : (
            <Image
              src={imageUrl}
              alt={annonce.titre}
              fill
              sizes="(min-width: 1024px) 260px, 90vw"
              className="object-cover"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-[#5B6F86]">
            <Home size={32} />
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-[#0B162C]">
          {propertyTypeLabels[annonce.typeBien] ?? annonce.typeBien}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-base font-bold text-[#0B162C]">
            {formatPrice(annonce.prix, annonce.typeAnnonce)}
          </p>
          <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#0B162C]">
            {annonce.titre}
          </h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-[#5B6F86]">
            <MapPin size={13} />
            {annonce.ville}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-[#3B556D]">
          <span className="flex items-center gap-1">
            <Ruler size={14} />
            {annonce.surface} m²
          </span>
          <span className="flex items-center gap-1">
            <BedDouble size={14} />
            {annonce.nombreChambres}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} />
            {annonce.nombreSallesBains}
          </span>
        </div>

        {typeof score === "number" && (
          <p className="text-xs font-semibold text-[#3B556D]">
            Compatibilité : {score}%
          </p>
        )}

        {[...highlights, ...differences].slice(0, 2).map((item) => (
          <p key={item} className="text-xs leading-5 text-[#5B6F86]">
            {item}
          </p>
        ))}
      </div>
    </Link>
  );
}
