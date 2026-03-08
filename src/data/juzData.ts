// Juz to Surah mapping - each juz contains surah ranges
export interface JuzInfo {
  juz: number;
  name: string;
  surahs: number[]; // surah IDs in this juz
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export const juzData: JuzInfo[] = [
  { juz: 1, name: "Alif Lam Mim", surahs: [1, 2], startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
  { juz: 2, name: "Sayaqul", surahs: [2], startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
  { juz: 3, name: "Tilkar Rusul", surahs: [2, 3], startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
  { juz: 4, name: "Lan Tanalul", surahs: [3, 4], startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
  { juz: 5, name: "Wal Muhsanat", surahs: [4], startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
  { juz: 6, name: "La Yuhibbullah", surahs: [4, 5], startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
  { juz: 7, name: "Wa Idza Sami'u", surahs: [5, 6], startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
  { juz: 8, name: "Wa Lau Annana", surahs: [6, 7], startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
  { juz: 9, name: "Qalal Mala'u", surahs: [7, 8], startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
  { juz: 10, name: "Wa'lamu", surahs: [8, 9], startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
  { juz: 11, name: "Ya'tadzirun", surahs: [9, 10, 11], startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
  { juz: 12, name: "Wa Ma Min Dabbah", surahs: [11, 12], startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
  { juz: 13, name: "Wa Ma Ubarri'u", surahs: [12, 13, 14], startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
  { juz: 14, name: "Rubama", surahs: [15, 16], startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128 },
  { juz: 15, name: "Subhanallazi", surahs: [17, 18], startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
  { juz: 16, name: "Qal Alam", surahs: [18, 19, 20], startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
  { juz: 17, name: "Iqtaraba", surahs: [21, 22], startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
  { juz: 18, name: "Qad Aflaha", surahs: [23, 24, 25], startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
  { juz: 19, name: "Wa Qalallazina", surahs: [25, 26, 27], startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
  { juz: 20, name: "Amman Khalaq", surahs: [27, 28, 29], startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
  { juz: 21, name: "Utlu Ma Uhiya", surahs: [29, 30, 31, 32, 33], startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
  { juz: 22, name: "Wa Man Yaqnut", surahs: [33, 34, 35, 36], startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
  { juz: 23, name: "Wa Mali", surahs: [36, 37, 38, 39], startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
  { juz: 24, name: "Faman Azlamu", surahs: [39, 40, 41], startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
  { juz: 25, name: "Ilaihi Yuraddu", surahs: [41, 42, 43, 44, 45], startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
  { juz: 26, name: "Ha Mim", surahs: [46, 47, 48, 49, 50, 51], startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
  { juz: 27, name: "Qala Fama Khatbukum", surahs: [51, 52, 53, 54, 55, 56, 57], startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
  { juz: 28, name: "Qad Sami'a", surahs: [58, 59, 60, 61, 62, 63, 64, 65, 66], startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
  { juz: 29, name: "Tabarakallazi", surahs: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77], startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
  { juz: 30, name: "Amma", surahs: [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114], startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 },
];

export function getJuzForSurah(surahId: number): number[] {
  return juzData.filter(j => j.surahs.includes(surahId)).map(j => j.juz);
}

export function getSurahsInJuz(juzNumber: number): number[] {
  const juz = juzData.find(j => j.juz === juzNumber);
  return juz ? juz.surahs : [];
}
