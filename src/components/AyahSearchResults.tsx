import { useAyahSearch } from "@/hooks/useAyahSearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X, BookOpen } from "lucide-react";

interface AyahSearchResultsProps {
  query: string;
  onClose: () => void;
  onSelectAyah: (surahNumber: number, ayahNumber: number) => void;
}

export function AyahSearchResults({ query, onClose, onSelectAyah }: AyahSearchResultsProps) {
  const { data, isLoading, error } = useAyahSearch(query);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-lg">Hasil Pencarian</h2>
              <p className="text-sm text-muted-foreground">
                Kata kunci: "{query}" {data?.count ? `• ${data.count} hasil` : ""}
              </p>
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
      <ScrollArea className="flex-1">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-5 space-y-3 border border-border">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <p className="text-destructive font-medium">Gagal mencari ayat</p>
              <p className="text-sm text-muted-foreground mt-1">Silakan coba lagi nanti</p>
            </div>
          )}

          {data && data.matches.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">Tidak ada hasil ditemukan</p>
              <p className="text-sm text-muted-foreground mt-1">
                Coba kata kunci lain atau gunakan minimal 3 karakter
              </p>
            </div>
          )}

          {data && data.matches.length > 0 && (
            <div className="space-y-4">
              {data.matches.map((match, index) => (
                <button
                  key={`${match.surah.number}-${match.numberInSurah}-${index}`}
                  onClick={() => onSelectAyah(match.surah.number, match.numberInSurah)}
                  className="w-full text-left bg-card rounded-xl p-5 border border-border hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                      {match.surah.number}
                    </span>
                    <div>
                      <span className="font-medium text-foreground">
                        {match.surah.englishName}
                      </span>
                      <span className="text-muted-foreground mx-2">•</span>
                      <span className="text-sm text-muted-foreground">
                        Ayat {match.numberInSurah}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    <HighlightedText text={match.text} query={query} />
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-primary">
                    <BookOpen className="w-3 h-3" />
                    <span>Klik untuk membuka surah</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-primary/20 text-primary rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
