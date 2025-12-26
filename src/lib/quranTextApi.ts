// Using equran.id API for better Indonesian translation
export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: {
    [key: string]: string;
  };
}

export interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: {
    [key: string]: string;
  };
  ayat: Ayah[];
}

export interface TafsirAyah {
  ayat: number;
  teks: string;
}

export interface TafsirSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  tafsir: TafsirAyah[];
}

export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  const response = await fetch(
    `https://equran.id/api/v2/surat/${surahNumber}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch surah detail");
  }
  const result = await response.json();
  return result.data;
}

export async function fetchTafsir(surahNumber: number): Promise<TafsirSurah> {
  const response = await fetch(
    `https://equran.id/api/v2/tafsir/${surahNumber}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tafsir");
  }
  const result = await response.json();
  return result.data;
}
