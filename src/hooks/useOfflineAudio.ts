import { useState, useEffect, useCallback } from "react";
import { getSurahAudioUrl } from "@/lib/api";

interface DownloadedSurah {
  surahId: number;
  reciterId: number;
  moshafId: number;
  server: string;
  downloadedAt: string;
}

const DB_NAME = "quran-audio-offline";
const DB_VERSION = 1;
const STORE_NAME = "audio-files";
const META_STORE_NAME = "download-meta";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(META_STORE_NAME)) {
        db.createObjectStore(META_STORE_NAME);
      }
    };
  });
}

function getAudioKey(reciterId: number, moshafId: number, surahId: number): string {
  return `${reciterId}-${moshafId}-${surahId}`;
}

export function useOfflineAudio() {
  const [downloadedSurahs, setDownloadedSurahs] = useState<Map<string, DownloadedSurah>>(new Map());
  const [downloadProgress, setDownloadProgress] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Load downloaded surah metadata
  useEffect(() => {
    async function loadMeta() {
      try {
        const db = await openDB();
        const tx = db.transaction(META_STORE_NAME, "readonly");
        const store = tx.objectStore(META_STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => {
          const items = request.result as DownloadedSurah[];
          const map = new Map<string, DownloadedSurah>();
          items.forEach((item) => {
            const key = getAudioKey(item.reciterId, item.moshafId, item.surahId);
            map.set(key, item);
          });
          setDownloadedSurahs(map);
          setIsLoading(false);
        };
      } catch (error) {
        console.error("Failed to load offline audio meta:", error);
        setIsLoading(false);
      }
    }
    loadMeta();
  }, []);

  const isDownloaded = useCallback((reciterId: number, moshafId: number, surahId: number): boolean => {
    const key = getAudioKey(reciterId, moshafId, surahId);
    return downloadedSurahs.has(key);
  }, [downloadedSurahs]);

  const getDownloadProgress = useCallback((reciterId: number, moshafId: number, surahId: number): number | undefined => {
    const key = getAudioKey(reciterId, moshafId, surahId);
    return downloadProgress.get(key);
  }, [downloadProgress]);

  const downloadAudio = useCallback(async (
    reciterId: number,
    moshafId: number,
    surahId: number,
    server: string
  ): Promise<void> => {
    const key = getAudioKey(reciterId, moshafId, surahId);
    
    // Already downloading
    if (downloadProgress.has(key)) return;
    
    // Already downloaded
    if (downloadedSurahs.has(key)) return;

    try {
      setDownloadProgress((prev) => new Map(prev).set(key, 0));
      
      const audioUrl = getSurahAudioUrl(server, surahId);
      const response = await fetch(audioUrl);
      
      if (!response.ok) throw new Error("Failed to fetch audio");
      
      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get("Content-Length") || 0);
      
      if (!reader) throw new Error("No reader available");
      
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        if (contentLength > 0) {
          const progress = Math.round((receivedLength / contentLength) * 100);
          setDownloadProgress((prev) => new Map(prev).set(key, progress));
        }
      }
      
      const blob = new Blob(chunks as BlobPart[], { type: "audio/mpeg" });
      
      // Save to IndexedDB
      const db = await openDB();
      
      // Save audio blob
      const audioTx = db.transaction(STORE_NAME, "readwrite");
      audioTx.objectStore(STORE_NAME).put(blob, key);
      
      // Save metadata
      const meta: DownloadedSurah = {
        surahId,
        reciterId,
        moshafId,
        server,
        downloadedAt: new Date().toISOString(),
      };
      
      const metaTx = db.transaction(META_STORE_NAME, "readwrite");
      metaTx.objectStore(META_STORE_NAME).put(meta, key);
      
      setDownloadedSurahs((prev) => new Map(prev).set(key, meta));
      setDownloadProgress((prev) => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
    } catch (error) {
      console.error("Failed to download audio:", error);
      setDownloadProgress((prev) => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
      throw error;
    }
  }, [downloadedSurahs, downloadProgress]);

  const getOfflineAudioUrl = useCallback(async (
    reciterId: number,
    moshafId: number,
    surahId: number
  ): Promise<string | null> => {
    const key = getAudioKey(reciterId, moshafId, surahId);
    
    if (!downloadedSurahs.has(key)) return null;
    
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      
      return new Promise((resolve) => {
        const request = store.get(key);
        request.onsuccess = () => {
          if (request.result) {
            resolve(URL.createObjectURL(request.result));
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.error("Failed to get offline audio:", error);
      return null;
    }
  }, [downloadedSurahs]);

  const deleteAudio = useCallback(async (
    reciterId: number,
    moshafId: number,
    surahId: number
  ): Promise<void> => {
    const key = getAudioKey(reciterId, moshafId, surahId);
    
    try {
      const db = await openDB();
      
      const audioTx = db.transaction(STORE_NAME, "readwrite");
      audioTx.objectStore(STORE_NAME).delete(key);
      
      const metaTx = db.transaction(META_STORE_NAME, "readwrite");
      metaTx.objectStore(META_STORE_NAME).delete(key);
      
      setDownloadedSurahs((prev) => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
    } catch (error) {
      console.error("Failed to delete audio:", error);
    }
  }, []);

  const getDownloadedCount = useCallback((reciterId: number, moshafId: number): number => {
    let count = 0;
    downloadedSurahs.forEach((meta) => {
      if (meta.reciterId === reciterId && meta.moshafId === moshafId) {
        count++;
      }
    });
    return count;
  }, [downloadedSurahs]);

  return {
    isLoading,
    downloadedSurahs,
    isDownloaded,
    getDownloadProgress,
    downloadAudio,
    getOfflineAudioUrl,
    deleteAudio,
    getDownloadedCount,
  };
}
