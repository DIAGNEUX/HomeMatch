import { Button } from "@/components/ui/button";

import { homeHeroContent } from "./home-content";
import HomeSearchTabs from "./HomeSearchTabs";

export default function HomeSearchCard() {
  return (
    <form className="rounded-xl border border-white/80 bg-white/95 p-4 shadow-[0_24px_70px_-28px_rgba(11,22,44,0.45),0_10px_24px_-18px_rgba(95,194,186,0.65)] ring-1 ring-gray-100/80 backdrop-blur">
      <HomeSearchTabs />

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
    </form>
  );
}
