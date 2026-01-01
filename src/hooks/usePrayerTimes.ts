import { useState, useEffect } from "react";

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
            maximumAge: 300000, // Cache for 5 minutes
          });
        });

        const { latitude, longitude } = position.coords;
        const today = new Date();
        const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=20`
        );
        const data = await response.json();

        if (data.code === 200) {
          setPrayerTimes(data.data.timings);
        }
      } catch (error) {
        console.log("Could not fetch prayer times, using default hours");
        // Default times if geolocation or API fails
        setPrayerTimes({
          Fajr: "04:30",
          Sunrise: "05:45",
          Dhuhr: "12:00",
          Asr: "15:15",
          Maghrib: "18:00",
          Isha: "19:15",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  const isNightTime = (): boolean => {
    if (!prayerTimes) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const maghribMinutes = parseTime(prayerTimes.Maghrib);
    const fajrMinutes = parseTime(prayerTimes.Fajr);

    // Night is between Maghrib and Fajr
    if (currentMinutes >= maghribMinutes || currentMinutes < fajrMinutes) {
      return true;
    }

    return false;
  };

  return { prayerTimes, loading, isNightTime };
}
