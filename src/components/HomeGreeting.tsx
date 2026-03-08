import { Heart, Play, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reciter } from "@/types/quran";
import { useAuth } from "@/hooks/useAuth";

interface HomeGreetingProps {
  favoriteReciters: Reciter[];
  onReciterSelect: (reciter: Reciter) => void;
}

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 10) return { text: "Selamat Pagi", emoji: "🌅" };
  if (hour >= 10 && hour < 15) return { text: "Selamat Siang", emoji: "☀️" };
  if (hour >= 15 && hour < 18) return { text: "Selamat Sore", emoji: "🌤️" };
  return { text: "Selamat Malam", emoji: "🌙" };
}

function getMotivation(): string {
  const motivations = [
    "Yuk, perbanyak bacaan Al-Quran hari ini! 📖",
    "Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya ✨",
    "Jadikan Al-Quran sahabat harimu 💚",
    "Setiap huruf yang dibaca bernilai pahala 🌟",
    "Mari tadarus bersama Al-Quran hari ini 🤲",
  ];
  const dayIndex = new Date().getDate() % motivations.length;
  return motivations[dayIndex];
}

export function HomeGreeting({ favoriteReciters, onReciterSelect }: HomeGreetingProps) {
  const { user } = useAuth();
  const greeting = getGreeting();
  const motivation = getMotivation();

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "";

  return (
    <div className="space-y-4">
      {/* Greeting Card */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{greeting.emoji}</span>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">
              {greeting.text}{displayName ? `, ${displayName}` : ""}!
            </h2>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {motivation}
            </p>
          </div>
        </div>
      </Card>

      {/* Favorite Reciters */}
      {favoriteReciters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
            <h3 className="font-semibold text-foreground text-sm">Qari Favorit</h3>
            <Badge variant="secondary" className="text-xs">{favoriteReciters.length}</Badge>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {favoriteReciters.map((reciter) => (
              <button
                key={reciter.id}
                onClick={() => onReciterSelect(reciter)}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground whitespace-nowrap max-w-[120px] truncate">
                  {reciter.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
