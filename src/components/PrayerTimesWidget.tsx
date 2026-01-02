import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Clock, Sun, Sunrise, Sunset, Moon, MapPin, Loader2, Timer, Settings } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { LocationPicker } from "./LocationPicker";
import { Button } from "./ui/button";

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
  const { prayerTimes, loading, locationName, gpsError, manualLocation, setManualLocation } = usePrayerTimes();
  const [countdown, setCountdown] = useState<string>("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const { currentPrayer, nextPrayer, nextPrayerTime } = useMemo(() => {
    if (!prayerTimes) return { currentPrayer: null, nextPrayer: null, nextPrayerTime: null };

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
    let nextTime: string | null = null;

    for (let i = 0; i < prayers.length; i++) {
      const prayerMinutes = parseTime(prayers[i].time);
      const nextPrayerMinutes = i < prayers.length - 1 ? parseTime(prayers[i + 1].time) : parseTime(prayers[0].time) + 24 * 60;

      if (currentMinutes >= prayerMinutes && currentMinutes < nextPrayerMinutes) {
        current = prayers[i].name;
        next = prayers[(i + 1) % prayers.length].name;
        nextTime = prayers[(i + 1) % prayers.length].time;
        break;
      }
    }

    // Handle case before Fajr
    if (!current) {
      current = "Isha";
      next = "Fajr";
      nextTime = prayerTimes.Fajr;
    }

    return { currentPrayer: current, nextPrayer: next, nextPrayerTime: nextTime };
  }, [prayerTimes]);

  // Auto-show picker if GPS fails and no manual location
  useEffect(() => {
    if (gpsError && !manualLocation) {
      setShowLocationPicker(true);
    }
  }, [gpsError, manualLocation]);

  // Countdown timer
  useEffect(() => {
    if (!nextPrayerTime) return;

    const calculateCountdown = () => {
      const now = new Date();
      const [hours, minutes] = nextPrayerTime.split(":").map(Number);
      
      let targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);

      // If target time is before now, it's tomorrow
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const diff = targetTime.getTime() - now.getTime();
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${diffHours.toString().padStart(2, "0")}:${diffMinutes.toString().padStart(2, "0")}:${diffSeconds.toString().padStart(2, "0")}`;
    };

    setCountdown(calculateCountdown());
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPrayerTime]);

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


  if (showLocationPicker) {
    return (
      <LocationPicker
        onLocationSelect={(loc) => {
          setManualLocation(loc);
          setShowLocationPicker(false);
        }}
        currentLocation={manualLocation}
        onClose={() => setShowLocationPicker(false)}
      />
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm">Waktu Shalat</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowLocationPicker(true)}
        >
          <MapPin className="w-3 h-3 mr-1" />
          <span className="max-w-24 truncate">{locationName}</span>
          <Settings className="w-3 h-3 ml-1" />
        </Button>
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
      
      {nextPrayer && countdown && (
        <div className="mt-3 bg-primary/10 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Menuju {getPrayerNameIndonesian(nextPrayer)}</span>
          </div>
          <p className="text-2xl font-bold text-primary font-mono">{countdown}</p>
        </div>
      )}
    </div>
  );
}
