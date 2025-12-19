import { RecitersResponse, SurahResponse } from "@/types/quran";

const BASE_URL = "https://mp3quran.net/api/v3";

export async function fetchReciters(language = "id"): Promise<RecitersResponse> {
  const response = await fetch(`${BASE_URL}/reciters?language=${language}`);
  if (!response.ok) {
    throw new Error("Failed to fetch reciters");
  }
  return response.json();
}

export async function fetchSurahs(language = "id"): Promise<SurahResponse> {
  const response = await fetch(`${BASE_URL}/suwar?language=${language}`);
  if (!response.ok) {
    throw new Error("Failed to fetch surahs");
  }
  return response.json();
}

export function getSurahAudioUrl(serverUrl: string, surahNumber: number): string {
  const paddedNumber = surahNumber.toString().padStart(3, "0");
  return `${serverUrl}${paddedNumber}.mp3`;
}
