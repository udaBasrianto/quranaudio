import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSurahDetail } from "@/lib/quranTextApi";
import { quranVocabulary, QuranWord } from "@/data/quranVocabulary";

export type SurahQuizMode = "arabic-to-indonesian" | "indonesian-to-arabic";

interface QuizQuestion {
  word: QuranWord;
  options: string[];
  correctAnswer: string;
}

interface SurahQuizState {
  currentQuestion: QuizQuestion;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  score: number;
  totalAnswered: number;
  streak: number;
  bestStreak: number;
  questionIndex: number;
  totalQuestions: number;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateWordQuizQuestions(mode: SurahQuizMode, count = 15): QuizQuestion[] {
  const words = shuffle([...quranVocabulary]);
  const selectedWords = words.slice(0, Math.min(count, words.length));
  const isArabicToIndo = mode === "arabic-to-indonesian";

  return selectedWords.map((word) => {
    const correctAnswer = isArabicToIndo ? word.indonesian : word.arabic;

    const otherWords = quranVocabulary.filter((w) => w.id !== word.id);
    const wrongAnswers = shuffle(otherWords)
      .slice(0, 3)
      .map((w) => (isArabicToIndo ? w.indonesian : w.arabic));

    const options = shuffle([correctAnswer, ...wrongAnswers]);
    return { word, options, correctAnswer };
  });
}

export function useSurahQuiz() {
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [mode, setMode] = useState<SurahQuizMode>("arabic-to-indonesian");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizState, setQuizState] = useState<SurahQuizState | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const { data: surahDetail, isLoading } = useQuery({
    queryKey: ["surahDetail", selectedSurah],
    queryFn: () => fetchSurahDetail(selectedSurah!),
    enabled: !!selectedSurah,
    staleTime: Infinity,
  });

  const startQuiz = useCallback(() => {
    if (!surahDetail) return;

    const generated = generateWordQuizQuestions(mode, 15);
    if (generated.length === 0) return;

    setQuestions(generated);
    setQuizState({
      currentQuestion: generated[0],
      selectedAnswer: null,
      isCorrect: null,
      score: 0,
      totalAnswered: 0,
      streak: 0,
      bestStreak: 0,
      questionIndex: 0,
      totalQuestions: generated.length,
    });
    setQuizStarted(true);
  }, [surahDetail, mode]);

  const answerQuestion = useCallback(
    (answer: string) => {
      if (!quizState || quizState.selectedAnswer) return;

      const isCorrect = answer === quizState.currentQuestion.correctAnswer;
      const newStreak = isCorrect ? quizState.streak + 1 : 0;

      setQuizState((prev) =>
        prev
          ? {
              ...prev,
              selectedAnswer: answer,
              isCorrect,
              score: prev.score + (isCorrect ? 1 : 0),
              totalAnswered: prev.totalAnswered + 1,
              streak: newStreak,
              bestStreak: Math.max(prev.bestStreak, newStreak),
            }
          : null
      );
    },
    [quizState]
  );

  const nextQuestion = useCallback(() => {
    if (!quizState) return;

    const nextIdx = quizState.questionIndex + 1;
    if (nextIdx >= questions.length) return;

    setQuizState((prev) =>
      prev
        ? {
            ...prev,
            currentQuestion: questions[nextIdx],
            selectedAnswer: null,
            isCorrect: null,
            questionIndex: nextIdx,
          }
        : null
    );
  }, [quizState, questions]);

  const isQuizFinished = quizState
    ? quizState.questionIndex >= questions.length - 1 && quizState.selectedAnswer !== null
    : false;

  const resetQuiz = useCallback(() => {
    setQuizStarted(false);
    setQuizState(null);
    setQuestions([]);
  }, []);

  const resetToSurahSelection = useCallback(() => {
    setQuizStarted(false);
    setQuizState(null);
    setQuestions([]);
    setSelectedSurah(null);
  }, []);

  const resetToJuzSelection = useCallback(() => {
    setQuizStarted(false);
    setQuizState(null);
    setQuestions([]);
    setSelectedSurah(null);
    setSelectedJuz(null);
  }, []);

  return {
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
  };
}
