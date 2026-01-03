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

export interface ManualLocation {
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  lat: number;
  lng: number;
}

const MANUAL_LOCATION_KEY = "manual_prayer_location";

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState<string>("Lokasi Anda");
  const [manualLocation, setManualLocation] = useState<ManualLocation | null>(() => {
    const saved = localStorage.getItem(MANUAL_LOCATION_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [gpsError, setGpsError] = useState(false);

  const fetchPrayerTimesForCoords = useCallback(async (latitude: number, longitude: number, locName?: string) => {

    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=11`
      );
      const data = await response.json();

      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
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

  return { 
    prayerTimes, 
    loading, 
    isNightTime, 
    locationName, 
    gpsError, 
    manualLocation, 
    setManualLocation: setManualLocationAndSave 
  };
}
