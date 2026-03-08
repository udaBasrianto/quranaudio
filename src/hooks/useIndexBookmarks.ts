import { useState, useEffect, useCallback } from "react";

export interface IndexBookmark {
  title: string;
  surah: number;
  ayah: number | string;
  surahName: string;
  arabic?: string;
  savedAt: string;
}

const KEY = "quran-index-bookmarks";

const getStored = (): IndexBookmark[] => {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export function useIndexBookmarks() {
  const [bookmarks, setBookmarks] = useState<IndexBookmark[]>(getStored);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (surah: number, ayah: number | string) =>
      bookmarks.some((b) => b.surah === surah && String(b.ayah) === String(ayah)),
    [bookmarks]
  );

  const toggle = useCallback(
    (entry: Omit<IndexBookmark, "savedAt">) => {
      setBookmarks((prev) => {
        const exists = prev.some(
          (b) => b.surah === entry.surah && String(b.ayah) === String(entry.ayah)
        );
        if (exists) {
          return prev.filter(
            (b) => !(b.surah === entry.surah && String(b.ayah) === String(entry.ayah))
          );
        }
        return [...prev, { ...entry, savedAt: new Date().toISOString() }];
      });
    },
    []
  );

  return { bookmarks, isBookmarked, toggle };
}
