import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { RotateCcw, Plus, Minus, Check, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface DzikirItem {
  id: string;
  arabic: string;
  latin: string;
  meaning: string;
  target: number;
}

const dzikirList: DzikirItem[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللهِ",
    latin: "Subhanallah",
    meaning: "Maha Suci Allah",
    target: 33,
  },
  {
    id: "alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    latin: "Alhamdulillah",
    meaning: "Segala Puji Bagi Allah",
    target: 33,
  },
  {
    id: "allahuakbar",
    arabic: "اللَّهُ أَكْبَرُ",
    latin: "Allahu Akbar",
    meaning: "Allah Maha Besar",
    target: 33,
  },
  {
    id: "lailahaillallah",
    arabic: "لَا إِلَٰهَ إِلَّا اللهُ",
    latin: "La ilaha illallah",
    meaning: "Tiada Tuhan Selain Allah",
    target: 100,
  },
  {
    id: "istighfar",
    arabic: "أَسْتَغْفِرُ اللهَ",
    latin: "Astaghfirullah",
    meaning: "Aku Memohon Ampun kepada Allah",
    target: 100,
  },
  {
    id: "shalawat",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
    latin: "Allahumma Shalli 'ala Muhammad",
    meaning: "Ya Allah, Curahkan Shalawat kepada Nabi Muhammad",
    target: 100,
  },
  {
    id: "hauqala",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
    latin: "La Hawla Wala Quwwata Illa Billah",
    meaning: "Tiada Daya dan Upaya Kecuali dengan Allah",
    target: 100,
  },
];

const DZIKIR_STORAGE_KEY = "dzikir_counts";

export function DzikirCounter() {
  const [selectedDzikir, setSelectedDzikir] = useState<DzikirItem>(dzikirList[0]);
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(DZIKIR_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [vibrate, setVibrate] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  const currentCount = counts[selectedDzikir.id] || 0;
  const progress = Math.min((currentCount / selectedDzikir.target) * 100, 100);
  const isCompleted = currentCount >= selectedDzikir.target;

  // Save to localStorage whenever counts change
  useEffect(() => {
    localStorage.setItem(DZIKIR_STORAGE_KEY, JSON.stringify(counts));
  }, [counts]);

  // Show completed animation
  useEffect(() => {
    if (isCompleted && currentCount === selectedDzikir.target) {
      setShowCompleted(true);
      setTimeout(() => setShowCompleted(false), 2000);
    }
  }, [isCompleted, currentCount, selectedDzikir.target]);

  const increment = useCallback(() => {
    if (vibrate && navigator.vibrate) {
      navigator.vibrate(30);
    }
    setCounts((prev) => ({
      ...prev,
      [selectedDzikir.id]: (prev[selectedDzikir.id] || 0) + 1,
    }));
  }, [selectedDzikir.id, vibrate]);

  const decrement = useCallback(() => {
    setCounts((prev) => ({
      ...prev,
      [selectedDzikir.id]: Math.max((prev[selectedDzikir.id] || 0) - 1, 0),
    }));
  }, [selectedDzikir.id]);

  const reset = useCallback(() => {
    setCounts((prev) => ({
      ...prev,
      [selectedDzikir.id]: 0,
    }));
  }, [selectedDzikir.id]);

  const resetAll = useCallback(() => {
    setCounts({});
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">Dzikir Counter</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setVibrate(!vibrate)}
          >
            {vibrate ? (
              <Volume2 className="w-4 h-4 text-primary" />
            ) : (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground"
            onClick={resetAll}
          >
            Reset Semua
          </Button>
        </div>
      </div>

      {/* Dzikir Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {dzikirList.map((dzikir) => {
          const count = counts[dzikir.id] || 0;
          const completed = count >= dzikir.target;
          return (
            <button
              key={dzikir.id}
              onClick={() => setSelectedDzikir(dzikir)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                selectedDzikir.id === dzikir.id
                  ? "bg-primary text-primary-foreground"
                  : completed
                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {dzikir.latin}
              {completed && <Check className="w-3 h-3 ml-1 inline" />}
            </button>
          );
        })}
      </div>

      {/* Main Counter Display */}
      <Card className="relative overflow-hidden p-6 text-center mb-4">
        {/* Progress Background */}
        <div
          className="absolute inset-0 bg-primary/10 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />

        {/* Completed Overlay */}
        {showCompleted && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-pulse">
            <Check className="w-16 h-16 text-green-500" />
          </div>
        )}

        <div className="relative z-10">
          <p className="text-3xl font-arabic text-foreground mb-2" dir="rtl">
            {selectedDzikir.arabic}
          </p>
          <p className="text-lg font-semibold text-foreground mb-1">
            {selectedDzikir.latin}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {selectedDzikir.meaning}
          </p>

          {/* Counter */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={decrement}
              disabled={currentCount === 0}
            >
              <Minus className="w-5 h-5" />
            </Button>

            <button
              onClick={increment}
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold transition-all active:scale-95",
                isCompleted
                  ? "bg-green-500 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {currentCount}
            </button>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={reset}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          {/* Target Info */}
          <p className="text-sm text-muted-foreground">
            Target: <span className="font-semibold">{currentCount}</span> /{" "}
            {selectedDzikir.target}
          </p>
        </div>
      </Card>

      {/* Quick Tap Area */}
      <button
        onClick={increment}
        className="w-full py-4 bg-primary/5 hover:bg-primary/10 rounded-lg text-center text-sm text-muted-foreground transition-all active:bg-primary/20"
      >
        Tap di sini untuk menambah hitungan
      </button>
    </div>
  );
}
