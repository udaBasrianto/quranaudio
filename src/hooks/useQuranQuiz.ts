import { useState, useCallback, useEffect } from "react";
import { quranVocabulary, QuranWord } from "@/data/quranVocabulary";

export type QuizMode = "arabic-to-indonesian" | "indonesian-to-arabic";

interface QuizState {
  currentWord: QuranWord;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  score: number;
  totalAnswered: number;
  streak: number;
  bestStreak: number;
}

function getRandomItems<T>(arr: T[], count: number, exclude?: T): T[] {
  const filtered = exclude !== undefined ? arr.filter(item => item !== exclude) : arr;
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function useQuranQuiz() {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mode, setMode] = useState<QuizMode>("arabic-to-indonesian");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [masteredWords, setMasteredWords] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("quran-quiz-mastered");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem("quran-quiz-mastered", JSON.stringify([...masteredWords]));
  }, [masteredWords]);

  const getFilteredWords = useCallback(() => {
    return quranVocabulary.filter(w => {
      if (w.level > selectedLevel) return false;
      if (selectedCategory !== "all" && w.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedLevel, selectedCategory]);

  const generateQuestion = useCallback(() => {
    const words = getFilteredWords();
    if (words.length < 4) return null;

    const word = words[Math.floor(Math.random() * words.length)];
    
    const isArabicToIndo = mode === "arabic-to-indonesian";
    const correctAnswer = isArabicToIndo ? word.indonesian : word.arabic;
    
    const wrongAnswers = getRandomItems(
      words.filter(w => w.id !== word.id).map(w => isArabicToIndo ? w.indonesian : w.arabic),
      3
    );

    const options = shuffle([correctAnswer, ...wrongAnswers]);

    return { currentWord: word, options, correctAnswer };
  }, [getFilteredWords, mode]);

  const startQuiz = useCallback(() => {
    const question = generateQuestion();
    if (!question) return;
    
    setQuizState({
      ...question,
      selectedAnswer: null,
      isCorrect: null,
      score: 0,
      totalAnswered: 0,
      streak: 0,
      bestStreak: 0,
    });
    setQuizStarted(true);
  }, [generateQuestion]);

  const answerQuestion = useCallback((answer: string) => {
    if (!quizState || quizState.selectedAnswer) return;

    const isCorrect = answer === quizState.correctAnswer;
    const newStreak = isCorrect ? quizState.streak + 1 : 0;

    if (isCorrect && newStreak >= 3) {
      setMasteredWords(prev => new Set([...prev, quizState.currentWord.id]));
    }

    setQuizState(prev => prev ? {
      ...prev,
      selectedAnswer: answer,
      isCorrect,
      score: prev.score + (isCorrect ? 1 : 0),
      totalAnswered: prev.totalAnswered + 1,
      streak: newStreak,
      bestStreak: Math.max(prev.bestStreak, newStreak),
    } : null);
  }, [quizState]);

  const nextQuestion = useCallback(() => {
    if (!quizState) return;
    const question = generateQuestion();
    if (!question) return;

    setQuizState(prev => prev ? {
      ...question,
      selectedAnswer: null,
      isCorrect: null,
      score: prev.score,
      totalAnswered: prev.totalAnswered,
      streak: prev.streak,
      bestStreak: prev.bestStreak,
    } : null);
  }, [quizState, generateQuestion]);

  const resetQuiz = useCallback(() => {
    setQuizStarted(false);
    setQuizState(null);
  }, []);

  return {
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
    filteredWordsCount: getFilteredWords().length,
  };
}
