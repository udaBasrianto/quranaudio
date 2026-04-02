import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  total_score: number;
  total_questions: number;
  best_streak: number;
  games_played: number;
  accuracy: number;
}

export function useQuizLeaderboard() {
  return useQuery({
    queryKey: ["quiz-leaderboard"],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      // Get all scores
      const { data: scores, error: scoresError } = await supabase
        .from("quiz_scores")
        .select("user_id, score, total_questions, best_streak");

      if (scoresError) throw scoresError;
      if (!scores || scores.length === 0) return [];

      // Aggregate by user
      const userMap = new Map<string, {
        total_score: number;
        total_questions: number;
        best_streak: number;
        games_played: number;
      }>();

      for (const s of scores) {
        const existing = userMap.get(s.user_id);
        if (existing) {
          existing.total_score += s.score;
          existing.total_questions += s.total_questions;
          existing.best_streak = Math.max(existing.best_streak, s.best_streak);
          existing.games_played += 1;
        } else {
          userMap.set(s.user_id, {
            total_score: s.score,
            total_questions: s.total_questions,
            best_streak: s.best_streak,
            games_played: 1,
          });
        }
      }

      // Get profiles for display names
      const userIds = Array.from(userMap.keys());
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, email")
        .in("user_id", userIds);

      const profileMap = new Map<string, { display_name: string | null; email: string | null }>();
      if (profiles) {
        for (const p of profiles) {
          profileMap.set(p.user_id, { display_name: p.display_name, email: p.email });
        }
      }

      const entries: LeaderboardEntry[] = Array.from(userMap.entries()).map(([userId, data]) => {
        const profile = profileMap.get(userId);
        return {
          user_id: userId,
          display_name: profile?.display_name || profile?.email?.split("@")[0] || "Anonim",
          total_score: data.total_score,
          total_questions: data.total_questions,
          best_streak: data.best_streak,
          games_played: data.games_played,
          accuracy: data.total_questions > 0 ? Math.round((data.total_score / data.total_questions) * 100) : 0,
        };
      });

      // Sort by total_score desc, then accuracy desc
      entries.sort((a, b) => b.total_score - a.total_score || b.accuracy - a.accuracy);

      return entries;
    },
    staleTime: 30_000,
  });
}

export async function saveQuizScore(params: {
  userId: string;
  surahNumber?: number;
  surahName?: string;
  score: number;
  totalQuestions: number;
  bestStreak: number;
  mode: string;
}) {
  const { error } = await supabase.from("quiz_scores").insert({
    user_id: params.userId,
    surah_number: params.surahNumber ?? null,
    surah_name: params.surahName ?? null,
    score: params.score,
    total_questions: params.totalQuestions,
    best_streak: params.bestStreak,
    mode: params.mode,
  });
  return { error };
}
