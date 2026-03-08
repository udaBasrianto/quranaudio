import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, BookOpen, ChevronDown, ChevronUp, ExternalLink, Share2, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { quranIndex, QuranIndexCategory, QuranIndexEntry } from "@/data/quranIndex";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QuranIndexPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const filteredIndex = useMemo(() => {
    if (!searchQuery.trim()) return quranIndex;
    const q = searchQuery.toLowerCase();
    return quranIndex
      .map((cat) => ({
        ...cat,
        entries: cat.entries.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.surahName.toLowerCase().includes(q) ||
            (e.arabic && e.arabic.includes(searchQuery))
        ),
      }))
      .filter((cat) => cat.entries.length > 0);
  }, [searchQuery]);

  const totalEntries = useMemo(
    () => quranIndex.reduce((sum, cat) => sum + cat.entries.length, 0),
    []
  );

  // Auto-expand all when searching
  const displayCategories = searchQuery.trim()
    ? filteredIndex.map((c) => c.id)
    : expandedCategories;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <div>
              <h1 className="text-lg font-bold leading-tight">Indeks Al-Quran</h1>
              <p className="text-[11px] text-primary-foreground/70 leading-none">
                {totalEntries} referensi • {quranIndex.length} kategori
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 space-y-4 pb-20">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari doa, kisah, peristiwa, hukum..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quranIndex.slice(0, 4).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSearchQuery("");
                setExpandedCategories([cat.id]);
                document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="bg-card border border-border rounded-xl p-3 text-center hover:bg-muted transition-colors"
            >
              <span className="text-2xl">{cat.icon}</span>
              <p className="text-xs font-medium text-foreground mt-1 truncate">{cat.name.split(" ").slice(0, 2).join(" ")}</p>
              <p className="text-[10px] text-muted-foreground">{cat.entries.length} item</p>
            </button>
          ))}
        </div>

        {/* Categories */}
        {filteredIndex.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Tidak ditemukan</p>
            <p className="text-sm mt-1">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIndex.map((category) => {
              const isExpanded = displayCategories.includes(category.id);
              return (
                <div
                  key={category.id}
                  id={`cat-${category.id}`}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.entries.length} referensi</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border divide-y divide-border">
                      {category.entries.map((entry, idx) => (
                        <IndexEntryItem key={idx} entry={entry} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

function IndexEntryItem({ entry }: { entry: QuranIndexEntry }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const ayah = typeof entry.ayah === "number" ? entry.ayah : entry.ayah.toString().split("-")[0];
    navigate(`/surah/${entry.surah}?ayah=${entry.ayah}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{entry.title}</p>
          {entry.arabic && (
            <p className="text-lg font-arabic text-primary mt-1 leading-relaxed text-right" dir="rtl">
              {entry.arabic}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            📖 QS. {entry.surahName} ({entry.surah}): {entry.ayah}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
      </div>
    </button>
  );
}

export default QuranIndexPage;
