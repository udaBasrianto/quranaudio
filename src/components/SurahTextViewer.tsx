import { useEffect, useRef } from "react";
import { useSurahDetail } from "@/hooks/useSurahDetail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, X, MapPin, FileText } from "lucide-react";

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

  // Bismillah component (shown for all surahs except At-Taubah)
  const showBismillah = surahNumber !== 9 && surahNumber !== 1;

  return (
    <div className="fixed inset-0 bg-background z-40 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-foreground text-lg">{surahName}</h2>
                {surahDetail && (
                  <span className="text-xl font-arabic text-primary">{surahDetail.nama}</span>
                )}
              </div>
              {surahDetail && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {surahDetail.jumlahAyat} Ayat
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {surahDetail.tempatTurun}
                  </span>
                  <span className="text-primary font-medium">{surahDetail.arti}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 pb-36">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-5 space-y-3 border border-border">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <p className="text-destructive font-medium">Gagal memuat teks surah</p>
              <p className="text-sm text-muted-foreground mt-1">Silakan coba lagi nanti</p>
            </div>
          )}

          {surahDetail && (
            <>
              {/* Bismillah */}
              {showBismillah && (
                <div className="text-center py-8 mb-6">
                  <p className="text-3xl font-arabic text-primary leading-loose">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
                  </p>
                </div>
              )}

              {/* Ayat list */}
              <div className="space-y-4">
                {surahDetail.ayat.map((ayah) => {
                  const isHighlighted = currentAyahIndex === ayah.nomorAyat;
                  
                  return (
                    <div
                      key={ayah.nomorAyat}
                      ref={(el) => {
                        if (el) {
                          ayahRefs.current.set(ayah.nomorAyat, el);
                        }
                      }}
                      className={`bg-card rounded-xl p-5 border transition-all duration-300 ${
                        isHighlighted 
                          ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10" 
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      {/* Ayah number badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`w-9 h-9 rounded-full text-sm font-semibold flex items-center justify-center transition-colors ${
                          isHighlighted 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-primary/10 text-primary"
                        }`}>
                          {ayah.nomorAyat}
                        </span>
                      </div>

                      {/* Arabic text */}
                      <p
                        className={`text-2xl md:text-3xl leading-[2.5] text-right font-arabic mb-5 transition-colors ${
                          isHighlighted ? "text-primary" : "text-foreground"
                        }`}
                        dir="rtl"
                        lang="ar"
                      >
                        {ayah.teksArab}
                      </p>

                      {/* Transliteration */}
                      <p className="text-sm text-muted-foreground italic mb-3 leading-relaxed">
                        {ayah.teksLatin}
                      </p>

                      {/* Indonesian translation */}
                      <p className="text-sm text-foreground/90 leading-relaxed border-t border-border pt-3">
                        <span className="text-primary font-medium">{ayah.nomorAyat}.</span>{" "}
                        {ayah.teksIndonesia}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* End decoration */}
              <div className="text-center py-8 mt-6">
                <div className="inline-flex items-center gap-3 text-muted-foreground">
                  <div className="h-px w-12 bg-border" />
                  <span className="text-2xl">۝</span>
                  <div className="h-px w-12 bg-border" />
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Akhir Surah {surahDetail.namaLatin}
                </p>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
