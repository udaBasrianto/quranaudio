import { ArrowLeft, Trophy, Flame, Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { SurahQuizMode } from "@/hooks/useSurahQuiz";
import { SurahDetail } from "@/lib/quranTextApi";
import { QuranWord } from "@/data/quranVocabulary";

interface SurahQuizPlayerProps {
  surahDetail: SurahDetail;
  quizState: {
    currentQuestion: {
      word: QuranWord;
      options: string[];
      correctAnswer: string;
    };
    selectedAnswer: string | null;
    isCorrect: boolean | null;
    score: number;
    totalAnswered: number;
    streak: number;
    bestStreak: number;
    questionIndex: number;
    totalQuestions: number;
  };
  mode: SurahQuizMode;
  isQuizFinished: boolean;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onReset: () => void;
  onBackToSurah: () => void;
}

function QuizFinishedCard({
  surahDetail,
  score,
  totalAnswered,
  bestStreak,
  onReset,
  onBackToSurah,
}: {
  surahDetail: SurahDetail;
  score: number;
  totalAnswered: number;
  bestStreak: number;
  onReset: () => void;
  onBackToSurah: () => void;
}) {
  const percentage = Math.round((score / totalAnswered) * 100);
  return (
    <div className="space-y-4">
      <Card className="p-6 text-center space-y-4">
        <div className="text-5xl">
          {percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "💪"}
        </div>
        <h2 className="text-xl font-bold text-foreground">Kuis Selesai!</h2>
        <p className="text-lg text-foreground">
          {surahDetail.namaLatin} ({surahDetail.nama})
        </p>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{score}</p>
            <p className="text-xs text-muted-foreground">Benar</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{totalAnswered}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-500">{bestStreak}</p>
            <p className="text-xs text-muted-foreground">Streak 🔥</p>
          </div>
        </div>
        <p className="text-lg font-semibold text-foreground">{percentage}%</p>
      </Card>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Ulangi
        </Button>
        <Button className="flex-1" onClick={onBackToSurah}>
          Pilih Surah Lain
        </Button>
      </div>
    </div>
  );
}

export function SurahQuizPlayer({
  surahDetail,
  quizState,
  mode,
  isQuizFinished,
  onAnswer,
  onNext,
  onReset,
  onBackToSurah,
}: SurahQuizPlayerProps) {
  const { currentQuestion, selectedAnswer, isCorrect, score, totalAnswered, streak, questionIndex, totalQuestions } = quizState;
  const isArabicToIndo = mode === "arabic-to-indonesian";
  const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;
  const word = currentQuestion.word;

  if (isQuizFinished) {
    return (
      <QuizFinishedCard
        surahDetail={surahDetail}
        score={score}
        totalAnswered={totalAnswered}
        bestStreak={quizState.bestStreak}
        onReset={onReset}
        onBackToSurah={onBackToSurah}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBackToSurah} className="flex items-center gap-1 text-primary hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            {questionIndex + 1}/{totalQuestions}
          </Badge>
          <div className="flex items-center gap-1 text-sm">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{score}/{totalAnswered}</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-orange-500">{streak}🔥</span>
            </div>
          )}
        </div>
      </div>

      <Progress value={progressPercent} className="h-2" />

      {/* Question */}
      <Card className="p-5 text-center space-y-3">
        <p className="text-xs text-muted-foreground">
          {surahDetail.namaLatin} • Kosakata Al-Quran
        </p>
        <p className="text-sm text-muted-foreground">
          {isArabicToIndo ? "Apa arti kata ini?" : "Kata Arab untuk arti ini:"}
        </p>

        {isArabicToIndo ? (
          <div>
            <p className="text-4xl md:text-5xl font-arabic leading-loose text-foreground" dir="rtl">
              {word.arabic}
            </p>
            <p className="text-xs text-muted-foreground mt-2 italic">{word.transliteration}</p>
          </div>
        ) : (
          <div>
            <p className="text-2xl font-bold text-foreground">{word.indonesian}</p>
          </div>
        )}

        <Badge variant="outline" className="text-xs">{word.category}</Badge>
      </Card>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isThisCorrect = option === currentQuestion.correctAnswer;
          const showResult = selectedAnswer !== null;

          return (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              disabled={selectedAnswer !== null}
              className={cn(
                "w-full p-3 rounded-lg border-2 text-left transition-all",
                "hover:border-primary/50 hover:bg-primary/5",
                "disabled:cursor-default",
                !showResult && "border-border bg-card",
                showResult && isThisCorrect && "border-green-500 bg-green-500/10",
                showResult && isSelected && !isThisCorrect && "border-destructive bg-destructive/10",
                showResult && !isSelected && !isThisCorrect && "border-border bg-card opacity-50"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "text-sm leading-relaxed",
                    !isArabicToIndo ? "text-2xl font-arabic text-foreground text-right w-full" : "text-foreground"
                  )}
                  dir={!isArabicToIndo ? "rtl" : undefined}
                >
                  {option}
                </span>
                {showResult && isThisCorrect && <Check className="w-5 h-5 text-green-500 shrink-0" />}
                {showResult && isSelected && !isThisCorrect && <X className="w-5 h-5 text-destructive shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result */}
      {selectedAnswer !== null && (
        <div className="space-y-3">
          <Card
            className={cn(
              "p-4",
              isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-destructive/10 border-destructive/30"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-destructive" />}
              <span className={cn("font-semibold", isCorrect ? "text-green-600 dark:text-green-400" : "text-destructive")}>
                {isCorrect ? "Benar! 🎉" : "Kurang tepat"}
              </span>
            </div>
            <p className="text-3xl font-arabic text-foreground text-center mb-2" dir="rtl">
              {word.arabic}
            </p>
            <p className="text-sm text-foreground text-center font-semibold">{word.indonesian}</p>
            <p className="text-xs text-muted-foreground text-center mt-1 italic">{word.transliteration}</p>
          </Card>

          <Button className="w-full" size="lg" onClick={onNext}>
            {questionIndex + 1 >= totalQuestions ? "Lihat Hasil" : "Soal Berikutnya →"}
          </Button>
        </div>
      )}
    </div>
  );
}
