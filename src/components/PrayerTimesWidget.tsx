import { usePrayerTimes, PrayerTimes } from "@/hooks/usePrayerTimes";
import { Clock, Sun, Sunrise, Sunset, Moon, MapPin, Loader2 } from "lucide-react";
import { useMemo } from "react";

interface PrayerTimeItemProps {
  name: string;
  time: string;
  icon: React.ReactNode;
  isActive: boolean;
  isNext: boolean;
}

const PrayerTimeItem = ({ name, time, icon, isActive, isNext }: PrayerTimeItemProps) => (
  <div
    className={`flex flex-col items-center p-2 rounded-lg transition-all ${
      isNext
        ? "bg-primary text-primary-foreground scale-105"
        : isActive
        ? "bg-primary/20 text-primary"
        : "bg-muted/50"
    }`}
  >
    <div className="mb-1">{icon}</div>
    <span className="text-xs font-medium">{name}</span>
    <span className={`text-sm font-bold ${isNext ? "" : "text-foreground"}`}>{time}</span>
  </div>
);

export function PrayerTimesWidget() {
  const { prayerTimes, loading } = usePrayerTimes();

  const { currentPrayer, nextPrayer } = useMemo(() => {
    if (!prayerTimes) return { currentPrayer: null, nextPrayer: null };

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const prayers = [
      { name: "Fajr", time: prayerTimes.Fajr },
      { name: "Sunrise", time: prayerTimes.Sunrise },
      { name: "Dhuhr", time: prayerTimes.Dhuhr },
      { name: "Asr", time: prayerTimes.Asr },
      { name: "Maghrib", time: prayerTimes.Maghrib },
      { name: "Isha", time: prayerTimes.Isha },
    ];

    let current: string | null = null;
    let next: string | null = null;

    for (let i = 0; i < prayers.length; i++) {
      const prayerMinutes = parseTime(prayers[i].time);
      const nextPrayerMinutes = i < prayers.length - 1 ? parseTime(prayers[i + 1].time) : parseTime(prayers[0].time) + 24 * 60;

      if (currentMinutes >= prayerMinutes && currentMinutes < nextPrayerMinutes) {
        current = prayers[i].name;
        next = prayers[(i + 1) % prayers.length].name;
        break;
      }
    }

    // Handle case before Fajr
    if (!current) {
      current = "Isha";
      next = "Fajr";
    }

    return { currentPrayer: current, nextPrayer: next };
  }, [prayerTimes]);

  const getPrayerIcon = (name: string) => {
    const iconClass = "w-4 h-4";
    switch (name) {
      case "Fajr":
        return <Sunrise className={iconClass} />;
      case "Sunrise":
        return <Sun className={iconClass} />;
      case "Dhuhr":
        return <Sun className={iconClass} />;
      case "Asr":
        return <Sunset className={iconClass} />;
      case "Maghrib":
        return <Sunset className={iconClass} />;
      case "Isha":
        return <Moon className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const getPrayerNameIndonesian = (name: string) => {
    switch (name) {
      case "Fajr":
        return "Subuh";
      case "Sunrise":
        return "Terbit";
      case "Dhuhr":
        return "Dzuhur";
      case "Asr":
        return "Ashar";
      case "Maghrib":
        return "Maghrib";
      case "Isha":
        return "Isya";
      default:
        return name;
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Memuat waktu shalat...</span>
        </div>
      </div>
    );
  }

  if (!prayerTimes) {
    return null;
  }

  const prayers = [
    { name: "Fajr", time: prayerTimes.Fajr },
    { name: "Dhuhr", time: prayerTimes.Dhuhr },
    { name: "Asr", time: prayerTimes.Asr },
    { name: "Maghrib", time: prayerTimes.Maghrib },
    { name: "Isha", time: prayerTimes.Isha },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm">Waktu Shalat</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>Lokasi Anda</span>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {prayers.map((prayer) => (
          <PrayerTimeItem
            key={prayer.name}
            name={getPrayerNameIndonesian(prayer.name)}
            time={prayer.time}
            icon={getPrayerIcon(prayer.name)}
            isActive={currentPrayer === prayer.name}
            isNext={nextPrayer === prayer.name}
          />
        ))}
      </div>
      
      {nextPrayer && (
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            Shalat berikutnya: <span className="font-medium text-primary">{getPrayerNameIndonesian(nextPrayer)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
