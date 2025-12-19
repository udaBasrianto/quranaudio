import { Surah } from "@/types/quran";
import { Play, BookOpen } from "lucide-react";

interface SurahCardProps {
  surah: Surah;
  onClick: () => void;
  isPlaying?: boolean;
  isDisabled?: boolean;
}

export function SurahCard({ surah, onClick, isPlaying, isDisabled }: SurahCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
        isPlaying
          ? "bg-primary/10 border-primary shadow-md"
          : isDisabled
          ? "bg-muted/50 border-border opacity-50 cursor-not-allowed"
          : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
          isPlaying 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        }`}>
          {surah.id}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{surah.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-3 h-3" />
            <span>{surah.makkia === 1 ? "Makkiyah" : "Madaniyah"}</span>
            <span>•</span>
            <span>Hal. {surah.start_page}-{surah.end_page}</span>
          </div>
        </div>
        {!isDisabled && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isPlaying ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}>
            <Play className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
          </div>
        )}
      </div>
    </button>
  );
}
