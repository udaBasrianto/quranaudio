import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Loader2, LogIn, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSurahQuiz, SurahQuizMode } from "@/hooks/useSurahQuiz";
import { JuzSurahSelector } from "@/components/quiz/JuzSurahSelector";
import { SurahQuizPlayer } from "@/components/quiz/SurahQuizPlayer";
import { QuizLeaderboard } from "@/components/quiz/QuizLeaderboard";
import { useAuth } from "@/hooks/useAuth";
import { saveQuizScore } from "@/hooks/useQuizLeaderboard";
import { useQueryClient } from "@tanstack/react-query";

const QuranQuiz = () => {
  const [activeTab, setActiveTab] = useState("quiz");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const {
    selectedJuz,
    setSelectedJuz,
    selectedSurah,
    setSelectedSurah,
    mode,
    setMode,
    quizStarted,
    quizState,
    surahDetail,
    isLoading,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    resetToSurahSelection,
    resetToJuzSelection,
    isQuizFinished,
  } = useSurahQuiz();

  // Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 max-w-lg space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-primary hover:underline">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Kuis Al-Quran</h1>
          </div>
          <Card className="p-8 text-center space-y-4">
            <div className="text-5xl">🔒</div>
            <h2 className="text-xl font-bold text-foreground">Login Diperlukan</h2>
            <p className="text-muted-foreground">
              Silakan login terlebih dahulu untuk mengakses fitur Kuis Al-Quran.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              <LogIn className="w-4 h-4" />
              Login / Daftar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Save score handler
  const handleQuizFinishAndSave = async () => {
    if (quizState && user && surahDetail) {
      await saveQuizScore({
        userId: user.id,
        surahNumber: selectedSurah ?? undefined,
        surahName: surahDetail.namaLatin,
        score: quizState.score,
        totalQuestions: quizState.totalAnswered,
        bestStreak: quizState.bestStreak,
        mode,
      });
      queryClient.invalidateQueries({ queryKey: ["quiz-leaderboard"] });
    }
  };

  // Quiz active
  if (quizStarted && quizState && surahDetail) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 max-w-lg space-y-4">
          <SurahQuizPlayer
            surahDetail={surahDetail}
            quizState={quizState}
            mode={mode}
            isQuizFinished={isQuizFinished}
            onAnswer={answerQuestion}
            onNext={nextQuestion}
            onReset={() => { resetQuiz(); startQuiz(); }}
            onBackToSurah={resetToSurahSelection}
            onFinish={handleQuizFinishAndSave}
          />
        </div>
      </div>
    );
  }

  // Surah selected - show quiz start screen
  if (selectedSurah && surahDetail) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 max-w-lg space-y-4">
          <button onClick={resetToSurahSelection} className="flex items-center gap-1 text-primary hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          <Card className="p-6 text-center space-y-4">
            <p className="text-4xl font-arabic text-foreground">{surahDetail.nama}</p>
            <h2 className="text-xl font-bold text-foreground">{surahDetail.namaLatin}</h2>
            <p className="text-sm text-muted-foreground">{surahDetail.arti} • {surahDetail.jumlahAyat} ayat • {surahDetail.tempatTurun}</p>

            <div className="pt-2">
              <label className="text-sm text-muted-foreground mb-1 block text-left">Mode Kuis</label>
              <Select value={mode} onValueChange={(v) => setMode(v as SurahQuizMode)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabic-to-indonesian">Arab → Indonesia</SelectItem>
                  <SelectItem value="indonesian-to-arabic">Indonesia → Arab</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" size="lg" onClick={startQuiz}>
              Mulai Kuis Kosakata (15 soal)
            </Button>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-foreground mb-1">💡 Cara Bermain</h3>
            <p className="text-sm text-muted-foreground">
              Anda akan diberikan kosakata Al-Quran, lalu pilih arti/kata yang benar dari 4 pilihan.
              Cocokkan kata dengan artinya untuk mendalami pemahaman kosakata Al-Quran!
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Loading surah detail
  if (selectedSurah && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Juz/Surah selection with leaderboard tabs
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 max-w-lg space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => (selectedJuz ? resetToJuzSelection() : navigate("/"))} className="text-primary hover:underline">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Kuis Al-Quran</h1>
            <p className="text-sm text-muted-foreground">Uji pemahaman kosakata Al-Quran</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quiz" className="gap-1">
              <BookOpen className="w-4 h-4" />
              Mulai Kuis
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-1">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quiz" className="mt-4">
            <JuzSurahSelector
              selectedJuz={selectedJuz}
              onSelectJuz={setSelectedJuz}
              onSelectSurah={setSelectedSurah}
              onBack={resetToJuzSelection}
            />
          </TabsContent>
          <TabsContent value="leaderboard" className="mt-4">
            <QuizLeaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuranQuiz;
