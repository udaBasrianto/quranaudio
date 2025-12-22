import { useState, useEffect, useCallback } from "react";

interface Favorites {
  reciters: number[];
  surahs: number[];
}

const FAVORITES_KEY = "quran-audio-favorites";

const getStoredFavorites = (): Favorites => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading favorites from localStorage", e);
  }
  return { reciters: [], surahs: [] };
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorites>(getStoredFavorites);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleReciterFavorite = useCallback((reciterId: number) => {
    setFavorites((prev) => {
      const isCurrentlyFavorite = prev.reciters.includes(reciterId);
      return {
        ...prev,
        reciters: isCurrentlyFavorite
          ? prev.reciters.filter((id) => id !== reciterId)
          : [...prev.reciters, reciterId],
      };
    });
  }, []);

  const toggleSurahFavorite = useCallback((surahId: number) => {
    setFavorites((prev) => {
      const isCurrentlyFavorite = prev.surahs.includes(surahId);
      return {
        ...prev,
        surahs: isCurrentlyFavorite
          ? prev.surahs.filter((id) => id !== surahId)
          : [...prev.surahs, surahId],
      };
    });
  }, []);

  const isReciterFavorite = useCallback(
    (reciterId: number) => favorites.reciters.includes(reciterId),
    [favorites.reciters]
  );

  const isSurahFavorite = useCallback(
    (surahId: number) => favorites.surahs.includes(surahId),
    [favorites.surahs]
  );

  return {
    favorites,
    toggleReciterFavorite,
    toggleSurahFavorite,
    isReciterFavorite,
    isSurahFavorite,
  };
}
