"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { homeHeroContent } from "./home-content";
import HomeSearchTabs from "./HomeSearchTabs";

const typeBienOptions = [
  { label: "Tous les biens", value: "" },
  { label: "Appartement", value: "APPARTEMENT" },
  { label: "Maison", value: "MAISON" },
  { label: "Studio", value: "STUDIO" },
  { label: "Terrain", value: "TERRAIN" },
  { label: "Local commercial", value: "LOCAL_COMMERCIAL" },
  { label: "Autre", value: "AUTRE" },
];

export default function HomeSearchCard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("assistant");
  const [ville, setVille] = useState("");
  const [typeBien, setTypeBien] = useState("");

  const handleClassicSearch = () => {
    const params = new URLSearchParams();
    if (ville) params.set("ville", ville);
    if (typeBien) params.set("typeBien", typeBien);

    router.push(`/recherche${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="rounded-xl border border-white/80 bg-white/95 p-4 shadow-[0_24px_70px_-28px_rgba(11,22,44,0.45),0_10px_24px_-18px_rgba(95,194,186,0.65)] ring-1 ring-gray-100/80 backdrop-blur">
      <HomeSearchTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "assistant" && (
        <>
          <label htmlFor="home-search" className="sr-only">
            Décrivez votre recherche immobilière
          </label>

          <textarea
            id="home-search"
            rows={3}
            placeholder={homeHeroContent.searchExample}
            className="mt-5 min-h-20 w-full resize-none border-0 bg-transparent text-sm text-[#0B162C] outline-none placeholder:text-[#9CA3AD]"
          />

          <div className="flex items-center justify-end border-t border-gray-100 pt-3">
            <Button
              type="button"
              className="h-9 cursor-pointer rounded-lg bg-[#5FC2BA] px-4 text-sm font-medium text-[#0B162C] hover:bg-[#4BB4AC]"
            >
              {homeHeroContent.searchButtonLabel}
            </Button>
          </div>
        </>
      )}

      {activeTab === "classic" && (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder="Ville"
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />

            <select
              value={typeBien}
              onChange={(e) => setTypeBien(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {typeBienOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end border-t border-gray-100 pt-3">
            <Button
              type="button"
              onClick={handleClassicSearch}
              className="h-9 cursor-pointer rounded-lg bg-[#5FC2BA] px-4 text-sm font-medium text-[#0B162C] hover:bg-[#4BB4AC]"
            >
              Lancer la recherche
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}