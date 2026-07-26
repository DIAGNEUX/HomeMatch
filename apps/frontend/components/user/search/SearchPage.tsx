"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import announcementService from "@/services/announcement.service";
import type { Annonce, SearchAnnonceParams } from "@/types/announcement";
import AnnonceCard from "./AnnonceCard";

const typeBienOptions = [
  { label: "Tous les biens", value: "" },
  { label: "Appartement", value: "APPARTEMENT" },
  { label: "Maison", value: "MAISON" },
  { label: "Studio", value: "STUDIO" },
  { label: "Terrain", value: "TERRAIN" },
  { label: "Local commercial", value: "LOCAL_COMMERCIAL" },
  { label: "Autre", value: "AUTRE" },
];

const typeAnnonceOptions = [
  { label: "Tous types", value: "" },
  { label: "Vente", value: "VENTE" },
  { label: "Location", value: "LOCATION" },
];

const sortOptions = [
  { label: "Plus récent", value: "createdAt-desc" },
  { label: "Prix croissant", value: "prix-asc" },
  { label: "Prix décroissant", value: "prix-desc" },
  { label: "Surface croissante", value: "surface-asc" },
  { label: "Surface décroissante", value: "surface-desc" },
];

const LIMIT = 12;

export default function SearchPage() {
  const searchParams = useSearchParams();

  const [q, setQ] = useState("");
  const [ville, setVille] = useState(searchParams.get("ville") ?? "");
  const [typeAnnonce, setTypeAnnonce] = useState("");
  const [typeBien, setTypeBien] = useState(searchParams.get("typeBien") ?? "");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [sort, setSort] = useState("createdAt-desc");
  const [page, setPage] = useState(1);

  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    const [sortBy, order] = sort.split("-") as [
      SearchAnnonceParams["sortBy"],
      SearchAnnonceParams["order"]
    ];

    const params: SearchAnnonceParams = {
      q: q || undefined,
      ville: ville || undefined,
      typeAnnonce: (typeAnnonce || undefined) as SearchAnnonceParams["typeAnnonce"],
      typeBien: (typeBien || undefined) as SearchAnnonceParams["typeBien"],
      prixMin: prixMin ? Number(prixMin) : undefined,
      prixMax: prixMax ? Number(prixMax) : undefined,
      sortBy,
      order,
      page,
      limit: LIMIT,
    };

    try {
      const response = await announcementService.search(params);
      setAnnonces(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      console.error("Erreur lors de la recherche :", err);
      setError("Impossible de charger les résultats.");
    } finally {
      setLoading(false);
    }
  };

  // Recherche automatique au montage (avec ville/typeBien préremplis depuis la homepage)
  // et à chaque changement de tri ou de page
  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchResults();
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">
        Recherche classique
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Utilisez les filtres pour affiner votre recherche.
      </p>

      <form
        onSubmit={handleSearchSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher par mot-clé (titre, ville, description...)"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <Button
            type="submit"
            className="bg-[#0B162C] text-white hover:bg-[#1C2942]"
          >
            Rechercher
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <input
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Ville"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <select
            value={typeAnnonce}
            onChange={(e) => setTypeAnnonce(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {typeAnnonceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={typeBien}
            onChange={(e) => setTypeBien(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {typeBienOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={prixMin}
            onChange={(e) => setPrixMin(e.target.value)}
            placeholder="Prix min"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <input
            type="number"
            value={prixMax}
            onChange={(e) => setPrixMax(e.target.value)}
            placeholder="Prix max"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className="mt-6">
        {loading && (
          <p className="py-10 text-center text-muted-foreground">
            Chargement des résultats...
          </p>
        )}

        {!loading && error && (
          <p className="py-10 text-center text-red-600">{error}</p>
        )}

        {!loading && !error && annonces.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">
            Aucune annonce ne correspond à votre recherche.
          </p>
        )}

        {!loading && !error && annonces.length > 0 && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {total} résultat{total > 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {annonces.map((annonce) => (
                <AnnonceCard key={annonce.id} annonce={annonce} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Précédent
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} / {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}