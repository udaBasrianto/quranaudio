export interface QuranIndexEntry {
  title: string;
  arabic?: string;
  surah: number;
  ayah: number | string;
  surahName: string;
}

export interface QuranIndexCategory {
  id: string;
  name: string;
  icon: string;
  entries: QuranIndexEntry[];
}

// Split into separate files for maintainability
import { doaEntries } from "./quranIndex/doa";
import { kisahNabiEntries } from "./quranIndex/kisahNabi";
import { peristiwaEntries } from "./quranIndex/peristiwa";
import { akhiratEntries } from "./quranIndex/akhirat";
import { akhlakEntries } from "./quranIndex/akhlak";
import { ibadahEntries } from "./quranIndex/ibadah";
import { tauhidEntries } from "./quranIndex/tauhid";
import { ilmuAlamEntries } from "./quranIndex/ilmuAlam";
import { wanitaKeluargaEntries } from "./quranIndex/wanitaKeluarga";
import { ayatPopulerEntries } from "./quranIndex/ayatPopuler";
import { ekonomiIslamEntries } from "./quranIndex/ekonomiIslam";
import { jihadEntries } from "./quranIndex/jihad";
import { umatTerdahuluEntries } from "./quranIndex/umatTerdahulu";

export const quranIndex: QuranIndexCategory[] = [
  { id: "doa", name: "Doa-doa dalam Al-Quran", icon: "🤲", entries: doaEntries },
  { id: "kisah-nabi", name: "Kisah Para Nabi", icon: "📖", entries: kisahNabiEntries },
  { id: "umat-terdahulu", name: "Kisah Umat Terdahulu", icon: "🏛️", entries: umatTerdahuluEntries },
  { id: "peristiwa", name: "Peristiwa Penting", icon: "⚡", entries: peristiwaEntries },
  { id: "akhirat", name: "Hari Akhir & Akhirat", icon: "🌅", entries: akhiratEntries },
  { id: "akhlak", name: "Akhlak & Adab", icon: "💎", entries: akhlakEntries },
  { id: "ibadah", name: "Ibadah & Hukum", icon: "🕌", entries: ibadahEntries },
  { id: "tauhid", name: "Tauhid & Keimanan", icon: "✨", entries: tauhidEntries },
  { id: "ekonomi-islam", name: "Ekonomi Islam", icon: "💰", entries: ekonomiIslamEntries },
  { id: "jihad", name: "Jihad & Perjuangan", icon: "⚔️", entries: jihadEntries },
  { id: "ilmu-alam", name: "Sains & Alam Semesta", icon: "🌍", entries: ilmuAlamEntries },
  { id: "wanita-keluarga", name: "Wanita & Keluarga", icon: "👨‍👩‍👧", entries: wanitaKeluargaEntries },
  { id: "ayat-populer", name: "Ayat-ayat Populer", icon: "⭐", entries: ayatPopulerEntries },
];
