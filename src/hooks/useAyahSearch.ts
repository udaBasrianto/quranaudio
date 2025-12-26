import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
  numberInSurah: number;
  text: string;
  number: number;
}

interface SearchResponse {
  count: number;
  matches: SearchResult[];
}

async function searchAyahs(query: string): Promise<SearchResponse> {
  if (!query.trim()) {
    return { count: 0, matches: [] };
  }
  
  // Search using Alquran.cloud API
  const response = await fetch(
    `https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/id.indonesian`
  );
  
  if (!response.ok) {
    throw new Error("Failed to search ayahs");
  }
  
  const result = await response.json();
  
  if (result.code !== 200 || !result.data) {
    return { count: 0, matches: [] };
  }
  
  return {
    count: result.data.count,
    matches: result.data.matches || [],
  };
}

export function useAyahSearch(query: string) {
  return useQuery({
    queryKey: ["ayahSearch", query],
    queryFn: () => searchAyahs(query),
    enabled: query.trim().length >= 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
