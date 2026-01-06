import { Surah } from "@/types/quran";
import { Play, BookOpen, Heart, Download, Check, Loader2, Trash2 } from "lucide-react";

interface SurahCardProps {
  surah: Surah;
  onClick: () => void;
  isPlaying?: boolean;
  isDisabled?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  isDownloaded?: boolean;
  downloadProgress?: number;
  onDownload?: (e: React.MouseEvent) => void;
  onDeleteDownload?: (e: React.MouseEvent) => void;
}

export function SurahCard({ 
  surah, 
  onClick, 
  isPlaying, 
  isDisabled,
  isFavorite,
  onToggleFavorite,
  isDownloaded,
  downloadProgress,
  onDownload,
  onDeleteDownload,
}: SurahCardProps) {
  const isDownloading = downloadProgress !== undefined && downloadProgress < 100;

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
            {isDownloaded && (
              <>
                <span>•</span>
                <span className="text-primary flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Offline
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Download button */}
        {onDownload && !isDisabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isDownloaded && onDeleteDownload) {
                onDeleteDownload(e);
              } else if (!isDownloading) {
                onDownload(e);
              }
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isDownloaded 
                ? "hover:bg-destructive/10 text-primary" 
                : isDownloading
                ? "bg-primary/10 text-primary"
                : "hover:bg-primary/10 text-muted-foreground"
            }`}
            title={isDownloaded ? "Hapus download" : isDownloading ? `Downloading ${downloadProgress}%` : "Download untuk offline"}
          >
            {isDownloading ? (
              <div className="relative">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium">
                  {downloadProgress}%
                </span>
              </div>
            ) : isDownloaded ? (
              <Trash2 className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        )}
        
        {onToggleFavorite && !isDisabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(e);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
              }`} 
            />
          </button>
        )}
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
