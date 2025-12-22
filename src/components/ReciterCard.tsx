import { Reciter } from "@/types/quran";
import { User, Heart } from "lucide-react";

interface ReciterCardProps {
  reciter: Reciter;
  onClick: () => void;
  isSelected?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function ReciterCard({ 
  reciter, 
  onClick, 
  isSelected, 
  isFavorite, 
  onToggleFavorite 
}: ReciterCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
        isSelected
          ? "bg-primary/10 border-primary shadow-md"
          : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        }`}>
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{reciter.name}</h3>
          <p className="text-sm text-muted-foreground">
            {reciter.moshaf[0]?.surah_total || 0} Surah
          </p>
        </div>
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(e);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
              }`} 
            />
          </button>
        )}
      </div>
    </button>
  );
}
