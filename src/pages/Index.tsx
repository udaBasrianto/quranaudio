import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { TabNavigation } from "@/components/TabNavigation";
import { SearchInput } from "@/components/SearchInput";
import { ReciterCard } from "@/components/ReciterCard";
import { SurahCard } from "@/components/SurahCard";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SurahTextViewer } from "@/components/SurahTextViewer";
import { BookmarksList } from "@/components/BookmarksList";
import { AyahSearchResults } from "@/components/AyahSearchResults";
import { ReciterSkeleton, SurahSkeleton } from "@/components/LoadingSkeleton";
import { PrayerTimesWidget } from "@/components/PrayerTimesWidget";
import { DzikirCounter } from "@/components/DzikirCounter";
import { DzikirPagiPetang } from "@/components/DzikirPagiPetang";
import { useReciters, useSurahs } from "@/hooks/useQuranData";
import { useFavorites } from "@/hooks/useFavorites";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useOfflineAudio } from "@/hooks/useOfflineAudio";
import { useTheme, FontSize } from "@/hooks/useTheme";
import { Reciter, Surah, Moshaf } from "@/types/quran";
import { ArrowLeft, Users, Download, DownloadCloud, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { juzData, getSurahsInJuz } from "@/data/juzData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"reciters" | "surahs">("reciters");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [selectedMoshaf, setSelectedMoshaf] = useState<Moshaf | null>(null);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [showTextViewer, setShowTextViewer] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showAyahSearch, setShowAyahSearch] = useState(false);
  const [ayahSearchQuery, setAyahSearchQuery] = useState("");
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number | null>(null);
  const [totalAyahs, setTotalAyahs] = useState<number>(0);
  const [showDzikirCounter, setShowDzikirCounter] = useState(false);
  const [showDzikirPagiPetang, setShowDzikirPagiPetang] = useState(false);
  const [showPrayerTimes, setShowPrayerTimes] = useState(false);
  const [selectedJuz, setSelectedJuz] = useState<string>("all");

  const { data: recitersData, isLoading: isLoadingReciters } = useReciters();
  const { data: surahsData, isLoading: isLoadingSurahs } = useSurahs();
  const { isReciterFavorite, isSurahFavorite, toggleReciterFavorite, toggleSurahFavorite } = useFavorites();
  const { bookmarks, isBookmarked, toggleBookmark, removeBookmark } = useBookmarks();
  const {
    isDownloaded,
    getDownloadProgress,
    downloadAudio,
    getOfflineAudioUrl,
    deleteAudio,
    getDownloadedCount,
    batchProgress,
    downloadAllSurahs,
  } = useOfflineAudio();
  const {
    theme,
    toggleTheme,
    themeColor,
    setThemeColor,
    arabicFontSize,
    setArabicFontSize,
    getArabicFontStyle,
    autoNightMode,
    setAutoNightMode,
    customNightStart,
    setCustomNightStart,
    customNightEnd,
    setCustomNightEnd,
    prayerTimes,
  } = useTheme();

  const filteredReciters = useMemo(() => {
    if (!recitersData?.reciters) return [];
    if (!searchQuery) return recitersData.reciters;
    return recitersData.reciters.filter((reciter) =>
      reciter.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recitersData, searchQuery]);

  const filteredSurahs = useMemo(() => {
    if (!surahsData?.suwar) return [];
    let surahs = surahsData.suwar;

    // Filter by juz
    if (selectedJuz !== "all") {
      const juzNumber = parseInt(selectedJuz);
      const surahsInJuz = getSurahsInJuz(juzNumber);
      surahs = surahs.filter((s) => surahsInJuz.includes(s.id));
    }

    if (searchQuery) {
      surahs = surahs.filter((surah) =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return surahs;
  }, [surahsData, searchQuery, selectedJuz]);

  const availableSurahs = useMemo(() => {
    if (!selectedMoshaf) return [];
    return selectedMoshaf.surah_list.split(",").map(Number).filter(Boolean);
  }, [selectedMoshaf]);

  const handleReciterSelect = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    setSelectedMoshaf(reciter.moshaf[0] || null);
    setActiveTab("surahs");
    setSearchQuery("");
  };

  const handleSurahSelect = (surah: Surah) => {
    if (!selectedMoshaf || !availableSurahs.includes(surah.id)) return;
    setCurrentSurah(surah);
    setCurrentAyahIndex(null);
  };

  const handleBackToReciters = () => {
    setSelectedReciter(null);
    setSelectedMoshaf(null);
    setActiveTab("reciters");
    setSearchQuery("");
    setSelectedJuz("all");
  };

  const handleClosePlayer = () => {
    setCurrentSurah(null);
    setCurrentAyahIndex(null);
  };

  const handleTimeUpdate = useCallback((currentTime: number, duration: number) => {
    if (totalAyahs > 0 && duration > 0) {
      const progress = currentTime / duration;
      const estimatedAyah = Math.floor(progress * totalAyahs) + 1;
      setCurrentAyahIndex(Math.min(estimatedAyah, totalAyahs));
    }
  }, [totalAyahs]);

  const handleAyahsLoaded = useCallback((count: number) => {
    setTotalAyahs(count);
  }, []);

  const handleDownloadSurah = useCallback(async (surah: Surah) => {
    if (!selectedReciter || !selectedMoshaf) return;
    try {
      await downloadAudio(selectedReciter.id, selectedMoshaf.id, surah.id, selectedMoshaf.server);
      toast.success(`${surah.name} berhasil didownload untuk offline`);
    } catch (error) {
      toast.error(`Gagal mendownload ${surah.name}`);
    }
  }, [selectedReciter, selectedMoshaf, downloadAudio]);

  const handleDeleteDownload = useCallback(async (surah: Surah) => {
    if (!selectedReciter || !selectedMoshaf) return;
    try {
      await deleteAudio(selectedReciter.id, selectedMoshaf.id, surah.id);
      toast.success(`Download ${surah.name} dihapus`);
    } catch (error) {
      toast.error(`Gagal menghapus download ${surah.name}`);
    }
  }, [selectedReciter, selectedMoshaf, deleteAudio]);

  const handleDownloadAll = useCallback(async () => {
    if (!selectedReciter || !selectedMoshaf) return;
    try {
      await downloadAllSurahs(selectedReciter.id, selectedMoshaf.id, availableSurahs, selectedMoshaf.server);
      toast.success("Semua surah berhasil didownload!");
    } catch (error) {
      toast.error("Gagal mendownload beberapa surah");
    }
  }, [selectedReciter, selectedMoshaf, availableSurahs, downloadAllSurahs]);

  return (
    <div className="min-h-screen bg-background pb-32">
      <AppSidebar
        theme={theme}
        onToggleTheme={toggleTheme}
        bookmarkCount={bookmarks.length}
        onShowBookmarks={() => setShowBookmarks(true)}
        themeColor={themeColor}
        onColorChange={setThemeColor}
        arabicFontSize={arabicFontSize}
        onFontSizeChange={setArabicFontSize}
        onOpenSearch={() => setShowAyahSearch(true)}
        autoNightMode={autoNightMode}
        onAutoNightModeChange={setAutoNightMode}
        customNightStart={customNightStart}
        onCustomNightStartChange={setCustomNightStart}
        customNightEnd={customNightEnd}
        onCustomNightEndChange={setCustomNightEnd}
        prayerTimes={prayerTimes}
        onShowPrayerTimes={() => setShowPrayerTimes(!showPrayerTimes)}
        onShowDzikirCounter={() => setShowDzikirCounter(!showDzikirCounter)}
        onShowDzikirPagiPetang={() => setShowDzikirPagiPetang(!showDzikirPagiPetang)}
      />

      <main className="container mx-auto px-4 py-4 space-y-4">
        {/* Collapsible widgets */}
        {showPrayerTimes && <PrayerTimesWidget />}
        {showDzikirCounter && <DzikirCounter />}
        {showDzikirPagiPetang && <DzikirPagiPetang />}

        {/* Tab Navigation or Back Button */}
        {selectedReciter ? (
          <div className="space-y-3">
            <button
              onClick={handleBackToReciters}
              className="flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar Qari
            </button>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <h2 className="font-semibold text-foreground">{selectedReciter.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{selectedMoshaf?.name} • {selectedMoshaf?.surah_total} Surah</span>
                {selectedMoshaf && getDownloadedCount(selectedReciter.id, selectedMoshaf.id) > 0 && (
                  <span className="flex items-center gap-1 text-primary">
                    <Download className="w-3 h-3" />
                    {getDownloadedCount(selectedReciter.id, selectedMoshaf.id)} offline
                  </span>
                )}
              </div>

              {/* Download All */}
              <div className="flex flex-col gap-2 mt-3">
                {batchProgress.downloading ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mendownload {batchProgress.current}/{batchProgress.total} surah...
                      </span>
                      <span className="text-primary font-medium">
                        {Math.round((batchProgress.current / batchProgress.total) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleDownloadAll}
                    disabled={getDownloadedCount(selectedReciter.id, selectedMoshaf!.id) >= availableSurahs.length}
                  >
                    <DownloadCloud className="w-4 h-4 mr-2" />
                    {getDownloadedCount(selectedReciter.id, selectedMoshaf!.id) >= availableSurahs.length
                      ? "Semua surah sudah didownload"
                      : `Download Semua Surah (${availableSurahs.length - getDownloadedCount(selectedReciter.id, selectedMoshaf!.id)} tersisa)`}
                  </Button>
                )}
              </div>
            </div>

            {/* Juz Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedJuz} onValueChange={setSelectedJuz}>
                <SelectTrigger className="flex-1 h-9 rounded-xl">
                  <SelectValue placeholder="Filter per Juz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Juz</SelectItem>
                  {juzData.map((juz) => (
                    <SelectItem key={juz.juz} value={juz.juz.toString()}>
                      Juz {juz.juz} — {juz.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={
            activeTab === "reciters" || selectedReciter
              ? "Cari qari..."
              : "Cari surah..."
          }
        />

        {/* Content */}
        <div>
          {activeTab === "reciters" && !selectedReciter && (
            <>
              {isLoadingReciters ? (
                <ReciterSkeleton />
              ) : filteredReciters.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Tidak ada qari ditemukan</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredReciters.map((reciter) => (
                    <ReciterCard
                      key={reciter.id}
                      reciter={reciter}
                      onClick={() => handleReciterSelect(reciter)}
                      isSelected={selectedReciter?.id === reciter.id}
                      isFavorite={isReciterFavorite(reciter.id)}
                      onToggleFavorite={() => toggleReciterFavorite(reciter.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {(activeTab === "surahs" || selectedReciter) && (
            <>
              {!selectedReciter ? (
                <div className="text-center py-12 bg-card rounded-xl border">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground font-medium">Pilih Qari Terlebih Dahulu</p>
                  <p className="text-sm text-muted-foreground mt-2">Klik tab "Qari" untuk memilih qari</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab("reciters")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Pilih Qari
                  </Button>
                </div>
              ) : isLoadingSurahs ? (
                <SurahSkeleton />
              ) : filteredSurahs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Tidak ada surah ditemukan</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSurahs.map((surah) => (
                    <SurahCard
                      key={surah.id}
                      surah={surah}
                      onClick={() => handleSurahSelect(surah)}
                      isPlaying={currentSurah?.id === surah.id}
                      isDisabled={!availableSurahs.includes(surah.id)}
                      isFavorite={isSurahFavorite(surah.id)}
                      onToggleFavorite={() => toggleSurahFavorite(surah.id)}
                      isDownloaded={isDownloaded(selectedReciter.id, selectedMoshaf!.id, surah.id)}
                      downloadProgress={getDownloadProgress(selectedReciter.id, selectedMoshaf!.id, surah.id)}
                      onDownload={() => handleDownloadSurah(surah)}
                      onDeleteDownload={() => handleDeleteDownload(surah)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Ayah Search */}
      {showAyahSearch && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="container mx-auto px-4 py-4">
            <SearchInput
              value={ayahSearchQuery}
              onChange={setAyahSearchQuery}
              placeholder="Cari ayat (minimal 3 karakter)..."
            />
          </div>
          {ayahSearchQuery.length >= 3 && (
            <AyahSearchResults
              query={ayahSearchQuery}
              onClose={() => {
                setShowAyahSearch(false);
                setAyahSearchQuery("");
              }}
              onSelectAyah={(surahNumber, _ayahNumber) => {
                const surah = surahsData?.suwar.find((s) => s.id === surahNumber);
                if (surah) {
                  setCurrentSurah(surah);
                  setShowTextViewer(true);
                }
                setShowAyahSearch(false);
                setAyahSearchQuery("");
              }}
            />
          )}
          {ayahSearchQuery.length < 3 && (
            <div className="container mx-auto px-4 py-12 text-center">
              <p className="text-muted-foreground">Ketik minimal 3 karakter untuk mencari ayat</p>
              <button
                onClick={() => {
                  setShowAyahSearch(false);
                  setAyahSearchQuery("");
                }}
                className="mt-4 text-primary hover:underline"
              >
                Tutup Pencarian
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bookmarks List */}
      {showBookmarks && (
        <BookmarksList
          bookmarks={bookmarks}
          onClose={() => setShowBookmarks(false)}
          onRemove={removeBookmark}
        />
      )}

      {/* Surah Text Viewer */}
      {showTextViewer && currentSurah && (
        <SurahTextViewer
          surahNumber={currentSurah.id}
          surahName={currentSurah.name}
          onClose={() => setShowTextViewer(false)}
          currentAyahIndex={currentAyahIndex}
          onAyahsLoaded={handleAyahsLoaded}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          arabicFontSize={getArabicFontStyle()}
        />
      )}

      {/* Audio Player */}
      {currentSurah && selectedReciter && selectedMoshaf && surahsData?.suwar && (
        <AudioPlayer
          surah={currentSurah}
          reciter={selectedReciter}
          moshaf={selectedMoshaf}
          surahs={surahsData.suwar}
          availableSurahs={availableSurahs}
          onSurahChange={setCurrentSurah}
          onClose={handleClosePlayer}
          onShowText={() => setShowTextViewer(true)}
          onTimeUpdate={handleTimeUpdate}
          getOfflineAudioUrl={getOfflineAudioUrl}
        />
      )}
    </div>
  );
};

export default Index;
