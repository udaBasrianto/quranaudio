import { useEffect, useRef } from "react";
import { useSurahDetail } from "@/hooks/useSurahDetail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, X } from "lucide-react";

interface SurahTextViewerProps {
  surahNumber: number;
  surahName: string;
  onClose: () => void;
  currentAyahIndex?: number | null;
  onAyahsLoaded?: (count: number) => void;
}

export function SurahTextViewer({ 
  surahNumber, 
  surahName, 
  onClose,
  currentAyahIndex,
  onAyahsLoaded,
}: SurahTextViewerProps) {
  const { data: surahDetail, isLoading, error } = useSurahDetail(surahNumber);
  const ayahRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Notify parent of total ayahs when loaded
  useEffect(() => {
    if (surahDetail?.ayat && onAyahsLoaded) {
      onAyahsLoaded(surahDetail.ayat.length);
    }
  }, [surahDetail, onAyahsLoaded]);

  // Auto-scroll to current ayah
  useEffect(() => {
    if (currentAyahIndex && ayahRefs.current.has(currentAyahIndex)) {
      const element = ayahRefs.current.get(currentAyahIndex);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentAyahIndex]);

  return (
    <div className="fixed inset-0 bg-background z-40 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">{surahName}</h2>
            {surahDetail && (
              <p className="text-xs text-muted-foreground">
                {surahDetail.arti} • {surahDetail.jumlah_ayat} Ayat • {surahDetail.tempat_turun}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 pb-36">
        <div className="container mx-auto px-4 py-4 space-y-4">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-4 space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-destructive">
              <p>Gagal memuat teks surah. Silakan coba lagi.</p>
            </div>
          )}

          {surahDetail?.ayat.map((ayah) => {
            const isHighlighted = currentAyahIndex === ayah.nomor;
            
            return (
              <div
                key={ayah.nomor}
                ref={(el) => {
                  if (el) {
                    ayahRefs.current.set(ayah.nomor, el);
                  }
                }}
                className={`bg-card rounded-lg p-4 border space-y-3 transition-all duration-300 ${
                  isHighlighted 
                    ? "border-primary ring-2 ring-primary/30 shadow-lg" 
                    : "border-border"
                }`}
              >
                {/* Ayah number badge */}
                <div className="flex justify-end">
                  <span className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center transition-colors ${
                    isHighlighted 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    {ayah.nomor}
                  </span>
                </div>

                {/* Arabic text */}
                <p
                  className={`text-2xl leading-loose text-right font-arabic transition-colors ${
                    isHighlighted ? "text-primary" : "text-foreground"
                  }`}
                  dir="rtl"
                  lang="ar"
                >
                  {ayah.ar}
                </p>

                {/* Transliteration */}
                <p className="text-sm text-muted-foreground italic">
                  {ayah.tr}
                </p>

                {/* Indonesian translation */}
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {ayah.idn}
                </p>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
