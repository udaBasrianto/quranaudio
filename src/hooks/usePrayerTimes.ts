import { useState, useEffect, useCallback } from "react";

export interface PrayerTimes {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface HijriDate {
  day: string;
  month: { en: string; ar: string; number: number };
  year: string;
  designation: { abbreviated: string; expanded: string };
  weekday: { en: string; ar: string };
}

export interface ManualLocation {
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  lat: number;
  lng: number;
}

const MANUAL_LOCATION_KEY = "manual_prayer_location";
const NOTIFICATION_KEY = "prayer_notification_enabled";

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState<string>("Lokasi Anda");
  const [manualLocation, setManualLocation] = useState<ManualLocation | null>(() => {
    const saved = localStorage.getItem(MANUAL_LOCATION_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [gpsError, setGpsError] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(() => {
    return localStorage.getItem(NOTIFICATION_KEY) === "true";
  });

  const fetchPrayerTimesForCoords = useCallback(async (latitude: number, longitude: number, locName?: string) => {

    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=11`
      );
      const data = await response.json();

      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
        if (data.data.date?.hijri) {
          setHijriDate(data.data.date.hijri);
        }
      }

      if (locName) {
        setLocationName(locName);
      }
    } catch (error) {
      console.log("Could not fetch prayer times from API");
      setPrayerTimes({
        Imsak: "04:15",
        Fajr: "04:30",
        Sunrise: "05:45",
        Dhuhr: "12:00",
        Asr: "15:15",
        Maghrib: "18:00",
        Isha: "19:15",
      });
    }
  }, []);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      
      // If manual location is set, use it
      if (manualLocation) {
        await fetchPrayerTimesForCoords(
          manualLocation.lat,
          manualLocation.lng,
          `${manualLocation.kecamatan}, ${manualLocation.kabupatenKota}`
        );
        setLoading(false);
        return;
      }

      try {
        // Get user's location via GPS
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
            maximumAge: 300000,
          });
        });

        const { latitude, longitude } = position.coords;
        setGpsError(false);

        // Fetch prayer times and location name in parallel
        const [prayerResponse, geoResponse] = await Promise.all([
          fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=11`),
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`)
        ]);

        const prayerData = await prayerResponse.json();
        
        if (prayerData.code === 200) {
          setPrayerTimes(prayerData.data.timings);
          if (prayerData.data.date?.hijri) {
            setHijriDate(prayerData.data.date.hijri);
          }
        }

        try {
          const geoData = await geoResponse.json();
          const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || geoData.address?.state;
          if (city) {
            setLocationName(city);
          }
        } catch {
          // Keep default location name if geocoding fails
        }
      } catch (error) {
        console.log("GPS not available, falling back to Padang");
        setGpsError(true);
        // Fallback to Padang: Lat: -0.9492, Lon: 100.3543
        await fetchPrayerTimesForCoords(-0.9492, 100.3543, "Padang (Default)");
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [manualLocation, fetchPrayerTimesForCoords]);

  const setManualLocationAndSave = useCallback((location: ManualLocation | null) => {
    if (location) {
      localStorage.setItem(MANUAL_LOCATION_KEY, JSON.stringify(location));
    } else {
      localStorage.removeItem(MANUAL_LOCATION_KEY);
    }
    setManualLocation(location);
    setGpsError(false);
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

  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("Browser tidak mendukung notifikasi");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }, []);

  const toggleNotification = useCallback(async () => {
    if (notificationEnabled) {
      setNotificationEnabled(false);
      localStorage.setItem(NOTIFICATION_KEY, "false");
    } else {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationEnabled(true);
        localStorage.setItem(NOTIFICATION_KEY, "true");
      }
    }
  }, [notificationEnabled, requestNotificationPermission]);

  // Schedule notifications for prayer times
  useEffect(() => {
    if (!notificationEnabled || !prayerTimes) return;

    const prayerNames: Record<string, string> = {
      Imsak: "Imsak",
      Fajr: "Subuh",
      Dhuhr: "Dzuhur",
      Asr: "Ashar",
      Maghrib: "Maghrib",
      Isha: "Isya",
    };

    const timeouts: NodeJS.Timeout[] = [];

    const scheduleNotification = (prayerKey: string, prayerTime: string) => {
      const [hours, minutes] = prayerTime.split(":").map(Number);
      const now = new Date();
      const prayerDate = new Date();
      prayerDate.setHours(hours, minutes, 0, 0);

      // If prayer time has passed today, skip
      if (prayerDate <= now) return;

      const delay = prayerDate.getTime() - now.getTime();
      
      const timeout = setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`Waktu ${prayerNames[prayerKey]}`, {
            body: `Sekarang waktu sholat ${prayerNames[prayerKey]} (${prayerTime})`,
            icon: "/favicon.ico",
            tag: `prayer-${prayerKey}`,
          });

          // Play azan sound (skip for Imsak & Sunrise)
          if (prayerKey !== "Imsak") {
            try {
              const azanUrl = prayerKey === "Fajr"
                ? "https://cdn.islamic.network/quran/audio/64/ar.alafasy/1.mp3"
                : "https://www.islamcan.com/audio/adhan/azan1.mp3";
              const audio = new Audio(azanUrl);
              audio.volume = 0.7;
              audio.play().catch(() => console.log("Tidak bisa memutar azan"));
            } catch {
              console.log("Error playing azan");
            }
          }
        }
      }, delay);

      timeouts.push(timeout);
    };

    // Schedule for main prayers (excluding Sunrise)
    const mainPrayers = ["Imsak", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    mainPrayers.forEach((key) => {
      const time = prayerTimes[key as keyof PrayerTimes];
      if (time) {
        scheduleNotification(key, time);
      }
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [notificationEnabled, prayerTimes]);

  return { 
    prayerTimes, 
    hijriDate,
    loading, 
    isNightTime, 
    locationName, 
    gpsError, 
    manualLocation, 
    setManualLocation: setManualLocationAndSave,
    notificationEnabled,
    toggleNotification,
  };
}
