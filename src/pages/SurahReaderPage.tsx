import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { SurahTextViewer } from "@/components/SurahTextViewer";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useTheme } from "@/hooks/useTheme";
import { useSurahs } from "@/hooks/useQuranData";

const SurahReaderPage = () => {
  const { surahId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const surahNumber = parseInt(surahId || "1", 10);
  const ayahParam = searchParams.get("ayah");
  const initialAyah = ayahParam ? parseInt(ayahParam.split("-")[0], 10) : null;

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { getArabicFontStyle } = useTheme();
  const { data: surahsData } = useSurahs();

  const surahName =
    surahsData?.suwar?.find((s) => s.id === surahNumber)?.name ||
    `Surah ${surahNumber}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <div>
              <h1 className="text-lg font-bold leading-tight">{surahName}</h1>
              <p className="text-[11px] text-primary-foreground/70 leading-none">
                Surah ke-{surahNumber}
                {initialAyah ? ` • Ayat ${ayahParam}` : ""}
              </p>
            </div>
          </div>
        </div>
      </header>

      <SurahTextViewer
        surahNumber={surahNumber}
        surahName={surahName}
        onClose={() => navigate(-1)}
        currentAyahIndex={initialAyah}
        isBookmarked={(sn, an) => isBookmarked(sn, an)}
        onToggleBookmark={toggleBookmark}
        arabicFontSize={getArabicFontStyle()}
      />
    </div>
  );
};

export default SurahReaderPage;
