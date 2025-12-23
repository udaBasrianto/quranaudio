import { useState, useEffect, useCallback } from "react";

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  teksArab: string;
  teksIndonesia: string;
  savedAt: string;
}

const BOOKMARKS_KEY = "quran-audio-bookmarks";

const getStoredBookmarks = (): Bookmark[] => {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading bookmarks from localStorage", e);
  }
  return [];
};

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(getStoredBookmarks);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((bookmark: Omit<Bookmark, "savedAt">) => {
    setBookmarks((prev) => {
      const exists = prev.some(
        (b) => b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber
      );
      if (exists) return prev;
      return [...prev, { ...bookmark, savedAt: new Date().toISOString() }];
    });
  }, []);

  const removeBookmark = useCallback((surahNumber: number, ayahNumber: number) => {
    setBookmarks((prev) =>
      prev.filter((b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber))
    );
  }, []);

  const isBookmarked = useCallback(
    (surahNumber: number, ayahNumber: number) =>
      bookmarks.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (bookmark: Omit<Bookmark, "savedAt">) => {
      if (isBookmarked(bookmark.surahNumber, bookmark.ayahNumber)) {
        removeBookmark(bookmark.surahNumber, bookmark.ayahNumber);
      } else {
        addBookmark(bookmark);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  };
}
