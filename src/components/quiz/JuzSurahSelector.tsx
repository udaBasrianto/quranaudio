import { ArrowLeft, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { juzData } from "@/data/juzData";
import { useSurahs } from "@/hooks/useQuranData";
import { cn } from "@/lib/utils";

interface JuzSurahSelectorProps {
  selectedJuz: number | null;
  onSelectJuz: (juz: number) => void;
  onSelectSurah: (surahId: number) => void;
  onBack: () => void;
}

export function JuzSurahSelector({ selectedJuz, onSelectJuz, onSelectSurah, onBack }: JuzSurahSelectorProps) {
  const { data: surahs } = useSurahs();

  if (selectedJuz !== null) {
    const juz = juzData.find((j) => j.juz === selectedJuz);
    if (!juz) return null;

    const surahsInJuz = surahs?.suwar?.filter((s) => juz.surahs.includes(s.id)) || [];

    return (
      <div className="space-y-4">
        <button onClick={onBack} className="flex items-center gap-1 text-primary hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Juz
        </button>

        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground text-lg">Juz {selectedJuz} - {juz.name}</h2>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {surahsInJuz.map((surah) => (
            <button
              key={surah.id}
              onClick={() => onSelectSurah(surah.id)}
              className="w-full text-left"
            >
              <Card className="p-3 hover:border-primary/50 hover:bg-primary/5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {surah.id}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{surah.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {surah.makkia === 1 ? "Makkiyah" : "Madaniyah"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Pilih</Badge>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Juz selection grid
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-foreground text-lg">Pilih Juz</h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {juzData.map((juz) => (
          <button key={juz.juz} onClick={() => onSelectJuz(juz.juz)} className="text-left">
            <Card className="p-3 hover:border-primary/50 hover:bg-primary/5 transition-all h-full">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {juz.juz}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{juz.name}</p>
                  <p className="text-xs text-muted-foreground">{juz.surahs.length} surah</p>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
