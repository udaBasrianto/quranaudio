import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PrayerTimesWidget } from "@/components/PrayerTimesWidget";

const PrayerTimesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Waktu Sholat</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-4">
        <PrayerTimesWidget />
      </main>
    </div>
  );
};

export default PrayerTimesPage;
