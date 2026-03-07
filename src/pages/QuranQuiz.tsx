import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Trophy, Flame, Check, X, RotateCcw, Star, GraduationCap, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuranQuiz, QuizMode } from "@/hooks/useQuranQuiz";
import { categories, levelNames, quranVocabulary } from "@/data/quranVocabulary";
import { cn } from "@/lib/utils";

const QuranQuiz = () => {
  const navigate = useNavigate();
  const {
    selectedLevel,
    setSelectedLevel,
    selectedCategory,
    setSelectedCategory,
    mode,
    setMode,
    quizStarted,
    quizState,
    masteredWords,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    filteredWordsCount,
  } = useQuranQuiz();

  const totalWords = quranVocabulary.length;
  const masteredPercent = Math.round((masteredWords.size / totalWords) * 100);

  if (!quizStarted || !quizState) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 max-w-lg space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-primary hover:underline">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kuis Kosakata Al-Quran</h1>
              <p className="text-sm text-muted-foreground">Kuasai bahasa Arab Al-Quran</p>
            </div>
          </div>

          {/* Stats */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Progres Belajar</span>
              </div>
              <Badge variant="secondary">{masteredWords.size}/{totalWords} kata</Badge>
            </div>
            <Progress value={masteredPercent} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Hafal 900 kata, pahami 80% Al-Quran. Anda sudah menguasai {masteredWords.size} kata.
            </p>
          </Card>

          {/* Settings */}
          <Card className="p-4 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Pengaturan Kuis
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Level</label>
                <Select value={String(selectedLevel)} onValueChange={v => setSelectedLevel(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(l => (
                      <SelectItem key={l} value={String(l)}>
                        Level {l} - {levelNames[l]} ({quranVocabulary.filter(w => w.level === l).length} kata)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Mencakup semua kata hingga level yang dipilih</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Kategori</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Mode Kuis</label>
                <Select value={mode} onValueChange={v => setMode(v as QuizMode)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arabic-to-indonesian">Arab → Indonesia</SelectItem>
                    <SelectItem value="indonesian-to-arabic">Indonesia → Arab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="w-full"
                size="lg"
                onClick={startQuiz}
                disabled={filteredWordsCount < 4}
              >
                <Star className="w-4 h-4 mr-2" />
                Mulai Kuis ({filteredWordsCount} kata)
              </Button>
              {filteredWordsCount < 4 && (
                <p className="text-xs text-destructive mt-1">Minimal 4 kata diperlukan. Coba ubah level atau kategori.</p>
              )}
            </div>
          </Card>

          {/* Info */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-foreground mb-2">💡 Tahukah Anda?</h3>
            <p className="text-sm text-muted-foreground">
              Al-Quran terdiri dari kata-kata yang sering diulang. Dengan menghafal sekitar 900 kata, 
              Anda bisa memahami 80% dari keseluruhan Al-Quran. Mulai dari kata-kata yang paling sering muncul!
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const { currentWord, options, correctAnswer, selectedAnswer, isCorrect, score, totalAnswered, streak, bestStreak } = quizState;
  const isArabicToIndo = mode === "arabic-to-indonesian";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 max-w-lg space-y-4">
        {/* Quiz Header */}
        <div className="flex items-center justify-between">
          <button onClick={resetQuiz} className="flex items-center gap-1 text-primary hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="flex items-center gap-3">
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

        {/* Progress */}
        <Progress value={totalAnswered > 0 ? (score / totalAnswered) * 100 : 0} className="h-2" />

        {/* Question Card */}
        <Card className="p-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            {isArabicToIndo ? "Apa arti kata ini?" : "Kata Arab untuk:"}
          </p>
          
          {isArabicToIndo ? (
            <div>
              <p className="text-5xl font-arabic leading-relaxed text-foreground">{currentWord.arabic}</p>
              <p className="text-sm text-muted-foreground mt-2">{currentWord.transliteration}</p>
            </div>
          ) : (
            <p className="text-2xl font-bold text-foreground">{currentWord.indonesian}</p>
          )}

          <Badge variant="outline" className="text-xs">{currentWord.category} • Level {currentWord.level}</Badge>
        </Card>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isThisCorrect = option === correctAnswer;
            const showResult = selectedAnswer !== null;

            return (
              <button
                key={index}
                onClick={() => answerQuestion(option)}
                disabled={selectedAnswer !== null}
                className={cn(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  "hover:border-primary/50 hover:bg-primary/5",
                  "disabled:cursor-default",
                  !showResult && "border-border bg-card",
                  showResult && isThisCorrect && "border-green-500 bg-green-500/10",
                  showResult && isSelected && !isThisCorrect && "border-destructive bg-destructive/10",
                  showResult && !isSelected && !isThisCorrect && "border-border bg-card opacity-50",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-medium",
                    isArabicToIndo ? "text-base text-foreground" : "text-2xl font-arabic text-foreground",
                  )}>
                    {option}
                  </span>
                  {showResult && isThisCorrect && <Check className="w-5 h-5 text-green-500" />}
                  {showResult && isSelected && !isThisCorrect && <X className="w-5 h-5 text-destructive" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Result & Next */}
        {selectedAnswer !== null && (
          <div className="space-y-3">
            <Card className={cn(
              "p-4",
              isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-destructive/10 border-destructive/30"
            )}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-destructive" />
                )}
                <span className={cn("font-semibold", isCorrect ? "text-green-600 dark:text-green-400" : "text-destructive")}>
                  {isCorrect ? "Benar! 🎉" : "Kurang tepat"}
                </span>
              </div>
              <p className="text-sm text-foreground">
                <span className="text-2xl font-arabic">{currentWord.arabic}</span>
                {" "}({currentWord.transliteration}) = <strong>{currentWord.indonesian}</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Muncul ~{currentWord.frequency}x dalam Al-Quran
              </p>
            </Card>

            <Button className="w-full" size="lg" onClick={nextQuestion}>
              Soal Berikutnya →
            </Button>
          </div>
        )}

        {/* Stats footer */}
        {totalAnswered >= 10 && (
          <Card className="p-3 text-center">
            <p className="text-sm text-muted-foreground">
              Skor: {score}/{totalAnswered} ({Math.round((score/totalAnswered)*100)}%) • 
              Streak terbaik: {bestStreak}🔥
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuranQuiz;
