import { Search, Sparkles } from "lucide-react";

import { homeSearchTabs } from "./home-content";

const tabIcons = {
  assistant: Sparkles,
  classic: Search,
};

interface HomeSearchTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function HomeSearchTabs({
  activeTab,
  onTabChange,
}: HomeSearchTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {homeSearchTabs.map((tab) => {
        const Icon = tabIcons[tab.id as keyof typeof tabIcons];
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
              isActive
                ? "border border-gray-200 bg-white text-[#0B162C] shadow-sm"
                : "text-[#3B556D] hover:bg-gray-50 hover:text-[#0B162C]"
            }`}
          >
            <Icon
              size={16}
              className={isActive ? "text-[#5FC2BA]" : "text-[#3B556D]"}
            />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
