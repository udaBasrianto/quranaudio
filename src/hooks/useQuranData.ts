import { useQuery } from "@tanstack/react-query";
import { fetchReciters, fetchSurahs } from "@/lib/api";

export function useReciters() {
  return useQuery({
    queryKey: ["reciters"],
    queryFn: () => fetchReciters("id"),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useSurahs() {
  return useQuery({
    queryKey: ["surahs"],
    queryFn: () => fetchSurahs("id"),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
