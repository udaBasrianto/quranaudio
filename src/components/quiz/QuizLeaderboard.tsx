import { Trophy, Flame, Target, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuizLeaderboard } from "@/hooks/useQuizLeaderboard";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const MEDAL = ["🥇", "🥈", "🥉"];

export function QuizLeaderboard() {
  const { data: entries, isLoading } = useQuizLeaderboard();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <Card className="p-8 text-center space-y-2">
        <div className="text-4xl">🏆</div>
        <p className="text-muted-foreground text-sm">
          Belum ada skor. Jadilah yang pertama menyelesaikan kuis!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top 3 podium */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 0, 2].map((idx) => {
            const e = entries[idx];
            if (!e) return null;
            const isMe = user?.id === e.user_id;
            return (
              <Card
                key={e.user_id}
                className={cn(
                  "p-3 text-center space-y-1",
                  idx === 0 && "border-yellow-500/50 bg-yellow-500/5 -mt-4",
                  idx === 1 && "border-gray-400/50",
                  idx === 2 && "border-amber-700/50",
                  isMe && "ring-2 ring-primary"
                )}
              >
                <p className="text-2xl">{MEDAL[idx]}</p>
                <p className="text-xs font-semibold text-foreground truncate">
                  {e.display_name}
                </p>
                <p className="text-lg font-bold text-primary">{e.total_score}</p>
                <p className="text-[10px] text-muted-foreground">{e.accuracy}% akurasi</p>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {entries.map((e, i) => {
          const isMe = user?.id === e.user_id;
          return (
            <Card
              key={e.user_id}
              className={cn(
                "p-3 flex items-center gap-3",
                isMe && "ring-2 ring-primary bg-primary/5"
              )}
            >
              <div className="w-8 text-center font-bold text-muted-foreground">
                {i < 3 ? MEDAL[i] : `#${i + 1}`}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {e.display_name}
                  {isMe && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">Kamu</Badge>
                  )}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> {e.total_score} poin
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" /> {e.accuracy}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3" /> {e.best_streak}🔥
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {e.games_played}x main
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
