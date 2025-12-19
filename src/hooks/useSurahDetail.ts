import { useQuery } from "@tanstack/react-query";
import { fetchSurahDetail } from "@/lib/quranTextApi";

export function useSurahDetail(surahNumber: number | null) {
  return useQuery({
    queryKey: ["surahDetail", surahNumber],
    queryFn: () => fetchSurahDetail(surahNumber!),
    enabled: !!surahNumber,
    staleTime: Infinity,
  });
}
