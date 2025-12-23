import { Bookmark } from "@/hooks/useBookmarks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookmarkIcon, X, Trash2 } from "lucide-react";

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onClose: () => void;
  onRemove: (surahNumber: number, ayahNumber: number) => void;
  onGoToAyah?: (surahNumber: number, ayahNumber: number, surahName: string) => void;
}

export function BookmarksList({ bookmarks, onClose, onRemove, onGoToAyah }: BookmarksListProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookmarkIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-lg">Bookmark Ayat</h2>
              <p className="text-xs text-muted-foreground">{bookmarks.length} ayat tersimpan</p>
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
          {bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <BookmarkIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">Belum ada bookmark</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ketuk ikon bookmark pada ayat untuk menyimpannya
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={`${bookmark.surahNumber}-${bookmark.ayahNumber}`}
                  className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <button
                      onClick={() => onGoToAyah?.(bookmark.surahNumber, bookmark.ayahNumber, bookmark.surahName)}
                      className="flex items-center gap-2 text-left hover:text-primary transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                        {bookmark.ayahNumber}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {bookmark.surahName} : {bookmark.ayahNumber}
                      </span>
                    </button>
                    <button
                      onClick={() => onRemove(bookmark.surahNumber, bookmark.ayahNumber)}
                      className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      aria-label="Hapus bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p
                    className="text-lg leading-[2] text-right font-arabic text-foreground mb-2"
                    dir="rtl"
                    lang="ar"
                  >
                    {bookmark.teksArab}
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {bookmark.teksIndonesia}
                  </p>

                  <p className="text-xs text-muted-foreground mt-2">
                    Disimpan: {new Date(bookmark.savedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
