import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Hand,
  Sparkles,
  Trophy,
  HardDrive,
  Headphones,
  Sunrise,
  MoreHorizontal,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { getAvatarUrl, getDisplayName, getInitial } from "@/lib/userProfile";

interface MobileHomeMenuProps {
  onShowMurottal: () => void;
  onOpenMore?: () => void;
  prayerLabel?: string;
}

const tiles = [
  { key: "murottal", label: "Murottal", icon: Headphones, bg: "bg-emerald-100 dark:bg-emerald-900/30", color: "text-emerald-700 dark:text-emerald-300" },
  { key: "quran-index", label: "Indeks Quran", icon: BookOpen, bg: "bg-amber-100 dark:bg-amber-900/30", color: "text-amber-700 dark:text-amber-300", to: "/quran-index" },
  { key: "prayer", label: "Jadwal Sholat", icon: Clock, bg: "bg-sky-100 dark:bg-sky-900/30", color: "text-sky-700 dark:text-sky-300", to: "/prayer-times" },
  { key: "dzikir", label: "Dzikir Counter", icon: Hand, bg: "bg-rose-100 dark:bg-rose-900/30", color: "text-rose-700 dark:text-rose-300", to: "/dzikir-counter" },
  { key: "dzikir-pp", label: "Pagi & Petang", icon: Sunrise, bg: "bg-violet-100 dark:bg-violet-900/30", color: "text-violet-700 dark:text-violet-300", to: "/dzikir-pagi-petang" },
  { key: "quiz", label: "Kuis Quran", icon: Trophy, bg: "bg-orange-100 dark:bg-orange-900/30", color: "text-orange-700 dark:text-orange-300", to: "/quran-quiz" },
  { key: "offline", label: "Offline", icon: HardDrive, bg: "bg-teal-100 dark:bg-teal-900/30", color: "text-teal-700 dark:text-teal-300", to: "/offline-storage" },
  { key: "fav", label: "Sparkles", icon: Sparkles, bg: "bg-yellow-100 dark:bg-yellow-900/30", color: "text-yellow-700 dark:text-yellow-300", to: "/quran-index" },
  { key: "more", label: "Lainnya", icon: MoreHorizontal, bg: "bg-muted", color: "text-muted-foreground" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 3 && h < 11) return "Selamat Pagi";
  if (h >= 11 && h < 15) return "Selamat Siang";
  if (h >= 15 && h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export function MobileHomeMenu({ onShowMurottal, onOpenMore, prayerLabel }: MobileHomeMenuProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Sahabat";

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleTile = (t: (typeof tiles)[number]) => {
    if (t.key === "murottal") return onShowMurottal();
    if (t.key === "more") return onOpenMore?.();
    if (t.to) navigate(t.to);
  };

  return (
    <div className="md:hidden space-y-5">
      {/* Greeting header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Assalamu'alaikum,</p>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            {displayName} <span className="inline-block">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {getGreeting()}, semoga harimu berkah
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/prayer-times")}
            className="relative h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Featured card */}
      <Card
        onClick={() => navigate("/prayer-times")}
        className="cursor-pointer relative overflow-hidden border-0 p-5 text-primary-foreground bg-primary"
      >
        <div className="relative z-10">
          <h2 className="text-xl font-bold">Jadwal Sholat Hari Ini</h2>
          <p className="text-sm opacity-90 mt-1 capitalize">{today}</p>
          {prayerLabel && (
            <p className="text-sm opacity-90 mt-0.5">{prayerLabel}</p>
          )}
          <button className="mt-4 inline-flex items-center gap-1 px-4 py-2 rounded-full bg-background/15 hover:bg-background/25 text-sm font-medium transition-colors">
            Lihat Jadwal <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-20">
          <Clock className="h-32 w-32" />
        </div>
      </Card>

      {/* Grid menu */}
      <div className="grid grid-cols-3 gap-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => handleTile(t)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`h-16 w-16 rounded-2xl ${t.bg} flex items-center justify-center shadow-sm group-active:scale-95 transition-transform`}
              >
                <Icon className={`h-7 w-7 ${t.color}`} />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ayah card */}
      <Card className="p-4 bg-primary/5 border-primary/20 flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm italic text-foreground leading-relaxed">
            "Dan katakanlah: Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan."
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            (QS. Ta-Ha: 114)
          </p>
        </div>
      </Card>
    </div>
  );
}
