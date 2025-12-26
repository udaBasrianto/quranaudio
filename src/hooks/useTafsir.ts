import { useQuery } from "@tanstack/react-query";
import { fetchTafsir, TafsirSurah } from "@/lib/quranTextApi";

export function useTafsir(surahNumber: number) {
  return useQuery<TafsirSurah>({
    queryKey: ["tafsir", surahNumber],
    queryFn: () => fetchTafsir(surahNumber),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
