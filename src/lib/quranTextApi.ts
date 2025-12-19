export interface Ayah {
  id: number;
  surah: number;
  nomor: number;
  ar: string;
  tr: string;
  idn: string;
}

export interface SurahDetail {
  status: boolean;
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
  ayat: Ayah[];
}

export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  const response = await fetch(
    `https://quran-api.santrikoding.com/api/surah/${surahNumber}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch surah detail");
  }
  return response.json();
}
