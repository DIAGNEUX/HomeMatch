import { Search, Sparkles } from "lucide-react";

import { homeSearchTabs } from "./home-content";

const tabIcons = {
  assistant: Sparkles,
  classic: Search,
};

export default function HomeSearchTabs() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {homeSearchTabs.map((tab) => {
        const Icon = tabIcons[tab.id as keyof typeof tabIcons];

        return (
          <button
            key={tab.id}
            type="button"
            className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
              tab.active
                ? "border border-gray-200 bg-white text-[#0B162C] shadow-sm"
                : "text-[#3B556D] hover:bg-gray-50 hover:text-[#0B162C]"
            }`}
          >
            <Icon
              size={16}
              className={tab.active ? "text-[#5FC2BA]" : "text-[#3B556D]"}
            />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
