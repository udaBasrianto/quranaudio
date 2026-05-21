import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  LogOut,
  Mail,
  Shield,
  Calendar,
  Heart,
  BookOpen,
  Trophy,
  HardDrive,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  getAvatarUrl,
  getDisplayName,
  getInitial,
  getProvider,
} from "@/lib/userProfile";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Stats {
  bestQuizScore: number;
  quizCount: number;
}

interface TrendPoint {
  index: number;
  label: string;
  accuracy: number;
  score: number;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAdmin, signOut, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({ bestQuizScore: 0, quizCount: 0 });
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("quiz_scores")
        .select("score, total_questions, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (data) {
        const best = data.reduce((m, r) => Math.max(m, r.score || 0), 0);
        setStats({ bestQuizScore: best, quizCount: data.length });
        const points: TrendPoint[] = data.slice(-10).map((r, i) => {
          const d = new Date(r.created_at);
          return {
            index: i + 1,
            label: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
            score: r.score || 0,
            accuracy: r.total_questions
              ? Math.round(((r.score || 0) / r.total_questions) * 100)
              : 0,
          };
        });
        setTrend(points);
      }
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const name = getDisplayName(user);
  const avatar = getAvatarUrl(user);
  const provider = getProvider(user);
  const joined = new Date(user.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    toast.success("Berhasil keluar");
    navigate("/auth");
  };

  const menuLinks = [
    { label: "Indeks Al-Quran", icon: BookOpen, to: "/quran-index" },
    { label: "Kuis Al-Quran", icon: Trophy, to: "/quran-quiz" },
    { label: "Penyimpanan Offline", icon: HardDrive, to: "/offline-storage" },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header banner */}
      <div className="relative bg-gradient-to-br from-primary to-primary/70 text-primary-foreground pt-6 pb-20 px-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <h1 className="text-xl font-bold mt-2">Profil Saya</h1>
      </div>

      <main className="container mx-auto px-4 -mt-16 space-y-4 max-w-2xl">
        {/* Identity card */}
        <Card className="p-5 flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg -mt-12">
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback className="text-2xl bg-primary/15 text-primary font-semibold">
              {getInitial(name)}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-3 text-xl font-bold text-foreground">{name}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Mail className="w-3.5 h-3.5" />
            {user.email}
          </p>
          {isAdmin && (
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <Shield className="w-3 h-3" /> Admin
            </span>
          )}
        </Card>

        {/* Info card */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" /> Metode Login
            </span>
            <span className="font-medium text-foreground">{provider}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Bergabung
            </span>
            <span className="font-medium text-foreground">{joined}</span>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <Trophy className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-foreground">{stats.bestQuizScore}</p>
            <p className="text-xs text-muted-foreground">Skor Tertinggi</p>
          </Card>
          <Card className="p-4 text-center">
            <Heart className="w-5 h-5 mx-auto text-rose-500 mb-1" />
            <p className="text-2xl font-bold text-foreground">{stats.quizCount}</p>
            <p className="text-xs text-muted-foreground">Kuis Selesai</p>
          </Card>
        </div>

        {/* Quick links */}
        <Card className="overflow-hidden divide-y divide-border">
          {menuLinks.map((m) => (
            <button
              key={m.to}
              onClick={() => navigate(m.to)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <m.icon className="w-5 h-5 text-primary" />
              <span className="flex-1 text-sm font-medium text-foreground">
                {m.label}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <Shield className="w-5 h-5 text-amber-500" />
              <span className="flex-1 text-sm font-medium text-foreground">
                Dashboard Admin
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </Card>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          Keluar
        </Button>
      </main>
    </div>
  );
}
