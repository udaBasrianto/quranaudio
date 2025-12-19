import { Users, BookMarked } from "lucide-react";

interface TabNavigationProps {
  activeTab: "reciters" | "surahs";
  onTabChange: (tab: "reciters" | "surahs") => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex bg-secondary rounded-lg p-1 gap-1">
      <button
        onClick={() => onTabChange("reciters")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
          activeTab === "reciters"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Users className="w-4 h-4" />
        Qari
      </button>
      <button
        onClick={() => onTabChange("surahs")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
          activeTab === "surahs"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <BookMarked className="w-4 h-4" />
        Surah
      </button>
    </div>
  );
}
