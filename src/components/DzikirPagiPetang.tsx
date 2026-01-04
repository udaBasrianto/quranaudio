import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Sun, Moon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DzikirItem {
  id: string;
  arabic: string;
  latin: string;
  meaning: string;
  count: number;
  source?: string;
}

const dzikirPagi: DzikirItem[] = [
  {
    id: "pagi-1",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "Ash-bahnaa wa ash-bahal mulku lillah, wal hamdu lillah, laa ilaaha illallahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir",
    meaning: "Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah (yang berhak disembah) kecuali Allah semata, tiada sekutu bagi-Nya. Milik Allah kerajaan dan pujian. Dia-lah Yang Mahakuasa atas segala sesuatu",
    count: 1,
    source: "HR. Muslim no. 2723"
  },
  {
    id: "pagi-2",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    latin: "Allahumma bika ash-bahnaa wa bika amsainaa wa bika nahyaa wa bika namuutu wa ilaikan nusyuur",
    meaning: "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu petang. Dengan rahmat dan pertolongan-Mu kami hidup dan dengan kehendak-Mu kami mati. Dan kepada-Mu kebangkitan",
    count: 1,
    source: "HR. Tirmidzi no. 3391"
  },
  {
    id: "pagi-3",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    latin: "Allahumma anta rabbii laa ilaaha illa anta, khalaqtanii wa ana 'abduka, wa ana 'alaa 'ahdika wa wa'dika mastatha'tu, a'uudzu bika min syarri maa shana'tu, abuu-u laka bini'matika 'alayya, wa abuu-u bidzanbii faghfir lii fa innahu laa yaghfirudz dzunuuba illa anta",
    meaning: "Ya Allah, Engkau adalah Tuhanku, tidak ada ilah yang berhak disembah kecuali Engkau. Engkaulah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku pada-Mu semampuku. Aku berlindung kepada-Mu dari kejelekan yang kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku. Oleh karena itu, ampunilah aku. Sesungguhnya tiada yang mengampuni dosa kecuali Engkau",
    count: 1,
    source: "HR. Bukhari no. 6306 (Sayyidul Istighfar)"
  },
  {
    id: "pagi-4",
    arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
    latin: "Allahumma innii ash-bahtu usyhiduka wa usyhidu hamalata 'arsyika wa malaa-ikatika wa jamii'a khalqika annaka antallahu laa ilaaha illa anta wahdaka laa syariika laka wa anna Muhammadan 'abduka wa rasuuluka",
    meaning: "Ya Allah, sesungguhnya aku di waktu pagi ini mempersaksikan Engkau, malaikat yang memikul 'Arsy-Mu, malaikat-malaikat dan seluruh makhluk-Mu, bahwa sesungguhnya Engkau adalah Allah, tiada ilah yang berhak disembah kecuali Engkau semata, tiada sekutu bagi-Mu dan sesungguhnya Muhammad adalah hamba dan utusan-Mu",
    count: 4,
    source: "HR. Abu Dawud no. 5069"
  },
  {
    id: "pagi-5",
    arabic: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    latin: "Allahumma maa ash-baha bii min ni'matin au bi-ahadin min khalqika faminka wahdaka laa syariika laka, falakal hamdu wa lakasy syukru",
    meaning: "Ya Allah, nikmat yang kuterima atau diterima oleh seorang di antara makhluk-Mu di pagi ini adalah dari-Mu semata, tiada sekutu bagi-Mu. Maka bagi-Mu segala puji dan bagi-Mu segala syukur",
    count: 1,
    source: "HR. Abu Dawud no. 5073"
  },
  {
    id: "pagi-6",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ",
    latin: "Allahumma 'aafinii fii badanii, Allahumma 'aafinii fii sam'ii, Allahumma 'aafinii fii bashorii, laa ilaaha illa anta",
    meaning: "Ya Allah, selamatkanlah tubuhku. Ya Allah, selamatkanlah pendengaranku. Ya Allah, selamatkanlah penglihatanku. Tidak ada ilah yang berhak disembah kecuali Engkau",
    count: 3,
    source: "HR. Abu Dawud no. 5090"
  },
  {
    id: "pagi-7",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَٰهَ إِلَّا أَنْتَ",
    latin: "Allahumma innii a'uudzu bika minal kufri wal faqri, wa a'uudzu bika min 'adzaabil qabri, laa ilaaha illa anta",
    meaning: "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari kekufuran dan kefakiran. Aku berlindung kepada-Mu dari siksa kubur. Tidak ada ilah yang berhak disembah kecuali Engkau",
    count: 3,
    source: "HR. Abu Dawud no. 5090"
  },
  {
    id: "pagi-8",
    arabic: "حَسْبِيَ اللهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    latin: "Hasbiyallahu laa ilaaha illa huwa 'alaihi tawakkaltu wa huwa rabbul 'arsyil 'azhiim",
    meaning: "Cukuplah Allah bagiku, tidak ada ilah yang berhak disembah kecuali Dia. Kepada-Nya aku bertawakal. Dia-lah Rabb yang memiliki 'Arsy yang agung",
    count: 7,
    source: "HR. Abu Dawud no. 5081"
  },
  {
    id: "pagi-9",
    arabic: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    latin: "Bismillahilladzi laa yadhurru ma'asmihi syai-un fil ardhi wa laa fis samaa-i wa huwas samii'ul 'aliim",
    meaning: "Dengan nama Allah yang bila disebut, segala sesuatu di bumi dan langit tidak akan berbahaya. Dialah Yang Maha Mendengar lagi Maha Mengetahui",
    count: 3,
    source: "HR. Abu Dawud no. 5088"
  },
  {
    id: "pagi-10",
    arabic: "رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    latin: "Radhiitu billahi rabba, wa bil-islaami diina, wa bi-Muhammadin shallallahu 'alaihi wa sallama nabiyya",
    meaning: "Aku ridha Allah sebagai Rabb, Islam sebagai agama dan Muhammad shallallahu 'alaihi wa sallam sebagai nabi",
    count: 3,
    source: "HR. Abu Dawud no. 5072"
  },
  {
    id: "pagi-11",
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    latin: "Subhanallahi wa bihamdihi",
    meaning: "Maha Suci Allah, aku memuji-Nya",
    count: 100,
    source: "HR. Muslim no. 2692"
  },
  {
    id: "pagi-12",
    arabic: "لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "Laa ilaaha illallahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir",
    meaning: "Tidak ada ilah yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan segala pujian. Dia-lah yang berkuasa atas segala sesuatu",
    count: 10,
    source: "HR. Bukhari no. 3293"
  },
  {
    id: "pagi-13",
    arabic: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ",
    latin: "Astaghfirullaha wa atuubu ilaihi",
    meaning: "Aku memohon ampunan kepada Allah dan bertaubat kepada-Nya",
    count: 100,
    source: "HR. Bukhari no. 6307"
  },
];

const dzikirPetang: DzikirItem[] = [
  {
    id: "petang-1",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "Amsainaa wa amsal mulku lillah, wal hamdu lillah, laa ilaaha illallahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir",
    meaning: "Kami telah memasuki waktu petang dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah (yang berhak disembah) kecuali Allah semata, tiada sekutu bagi-Nya. Milik Allah kerajaan dan pujian. Dia-lah Yang Mahakuasa atas segala sesuatu",
    count: 1,
    source: "HR. Muslim no. 2723"
  },
  {
    id: "petang-2",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    latin: "Allahumma bika amsainaa wa bika ash-bahnaa wa bika nahyaa wa bika namuutu wa ilaikal mashiir",
    meaning: "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu petang, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi. Dengan rahmat dan pertolongan-Mu kami hidup dan dengan kehendak-Mu kami mati. Dan kepada-Mu tempat kembali",
    count: 1,
    source: "HR. Tirmidzi no. 3391"
  },
  {
    id: "petang-3",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    latin: "Allahumma anta rabbii laa ilaaha illa anta, khalaqtanii wa ana 'abduka, wa ana 'alaa 'ahdika wa wa'dika mastatha'tu, a'uudzu bika min syarri maa shana'tu, abuu-u laka bini'matika 'alayya, wa abuu-u bidzanbii faghfir lii fa innahu laa yaghfirudz dzunuuba illa anta",
    meaning: "Ya Allah, Engkau adalah Tuhanku, tidak ada ilah yang berhak disembah kecuali Engkau. Engkaulah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku pada-Mu semampuku. Aku berlindung kepada-Mu dari kejelekan yang kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku. Oleh karena itu, ampunilah aku. Sesungguhnya tiada yang mengampuni dosa kecuali Engkau",
    count: 1,
    source: "HR. Bukhari no. 6306 (Sayyidul Istighfar)"
  },
  {
    id: "petang-4",
    arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
    latin: "Allahumma innii amsaitu usyhiduka wa usyhidu hamalata 'arsyika wa malaa-ikatika wa jamii'a khalqika annaka antallahu laa ilaaha illa anta wahdaka laa syariika laka wa anna Muhammadan 'abduka wa rasuuluka",
    meaning: "Ya Allah, sesungguhnya aku di waktu petang ini mempersaksikan Engkau, malaikat yang memikul 'Arsy-Mu, malaikat-malaikat dan seluruh makhluk-Mu, bahwa sesungguhnya Engkau adalah Allah, tiada ilah yang berhak disembah kecuali Engkau semata, tiada sekutu bagi-Mu dan sesungguhnya Muhammad adalah hamba dan utusan-Mu",
    count: 4,
    source: "HR. Abu Dawud no. 5069"
  },
  {
    id: "petang-5",
    arabic: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    latin: "Allahumma maa amsaa bii min ni'matin au bi-ahadin min khalqika faminka wahdaka laa syariika laka, falakal hamdu wa lakasy syukru",
    meaning: "Ya Allah, nikmat yang kuterima atau diterima oleh seorang di antara makhluk-Mu di petang ini adalah dari-Mu semata, tiada sekutu bagi-Mu. Maka bagi-Mu segala puji dan bagi-Mu segala syukur",
    count: 1,
    source: "HR. Abu Dawud no. 5073"
  },
  {
    id: "petang-6",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ",
    latin: "Allahumma 'aafinii fii badanii, Allahumma 'aafinii fii sam'ii, Allahumma 'aafinii fii bashorii, laa ilaaha illa anta",
    meaning: "Ya Allah, selamatkanlah tubuhku. Ya Allah, selamatkanlah pendengaranku. Ya Allah, selamatkanlah penglihatanku. Tidak ada ilah yang berhak disembah kecuali Engkau",
    count: 3,
    source: "HR. Abu Dawud no. 5090"
  },
  {
    id: "petang-7",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَٰهَ إِلَّا أَنْتَ",
    latin: "Allahumma innii a'uudzu bika minal kufri wal faqri, wa a'uudzu bika min 'adzaabil qabri, laa ilaaha illa anta",
    meaning: "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari kekufuran dan kefakiran. Aku berlindung kepada-Mu dari siksa kubur. Tidak ada ilah yang berhak disembah kecuali Engkau",
    count: 3,
    source: "HR. Abu Dawud no. 5090"
  },
  {
    id: "petang-8",
    arabic: "حَسْبِيَ اللهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    latin: "Hasbiyallahu laa ilaaha illa huwa 'alaihi tawakkaltu wa huwa rabbul 'arsyil 'azhiim",
    meaning: "Cukuplah Allah bagiku, tidak ada ilah yang berhak disembah kecuali Dia. Kepada-Nya aku bertawakal. Dia-lah Rabb yang memiliki 'Arsy yang agung",
    count: 7,
    source: "HR. Abu Dawud no. 5081"
  },
  {
    id: "petang-9",
    arabic: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    latin: "Bismillahilladzi laa yadhurru ma'asmihi syai-un fil ardhi wa laa fis samaa-i wa huwas samii'ul 'aliim",
    meaning: "Dengan nama Allah yang bila disebut, segala sesuatu di bumi dan langit tidak akan berbahaya. Dialah Yang Maha Mendengar lagi Maha Mengetahui",
    count: 3,
    source: "HR. Abu Dawud no. 5088"
  },
  {
    id: "petang-10",
    arabic: "رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    latin: "Radhiitu billahi rabba, wa bil-islaami diina, wa bi-Muhammadin shallallahu 'alaihi wa sallama nabiyya",
    meaning: "Aku ridha Allah sebagai Rabb, Islam sebagai agama dan Muhammad shallallahu 'alaihi wa sallam sebagai nabi",
    count: 3,
    source: "HR. Abu Dawud no. 5072"
  },
  {
    id: "petang-11",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    latin: "A'uudzu bikalimaatillahit taammaati min syarri maa khalaq",
    meaning: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang diciptakan-Nya",
    count: 3,
    source: "HR. Muslim no. 2708"
  },
  {
    id: "petang-12",
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    latin: "Subhanallahi wa bihamdihi",
    meaning: "Maha Suci Allah, aku memuji-Nya",
    count: 100,
    source: "HR. Muslim no. 2692"
  },
  {
    id: "petang-13",
    arabic: "لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "Laa ilaaha illallahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir",
    meaning: "Tidak ada ilah yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan segala pujian. Dia-lah yang berkuasa atas segala sesuatu",
    count: 10,
    source: "HR. Bukhari no. 3293"
  },
  {
    id: "petang-14",
    arabic: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ",
    latin: "Astaghfirullaha wa atuubu ilaihi",
    meaning: "Aku memohon ampunan kepada Allah dan bertaubat kepada-Nya",
    count: 100,
    source: "HR. Bukhari no. 6307"
  },
];

const DZIKIR_PROGRESS_KEY = "dzikir_pagi_petang_progress";

export function DzikirPagiPetang() {
  const [activeTab, setActiveTab] = useState<"pagi" | "petang">("pagi");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(DZIKIR_PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const dzikirList = activeTab === "pagi" ? dzikirPagi : dzikirPetang;
  const completedCount = dzikirList.filter(d => completedItems[d.id]).length;
  const progress = (completedCount / dzikirList.length) * 100;

  const toggleComplete = (id: string) => {
    const newCompleted = { ...completedItems, [id]: !completedItems[id] };
    setCompletedItems(newCompleted);
    localStorage.setItem(DZIKIR_PROGRESS_KEY, JSON.stringify(newCompleted));
  };

  const resetProgress = () => {
    const keysToRemove = dzikirList.map(d => d.id);
    const newCompleted = { ...completedItems };
    keysToRemove.forEach(key => delete newCompleted[key]);
    setCompletedItems(newCompleted);
    localStorage.setItem(DZIKIR_PROGRESS_KEY, JSON.stringify(newCompleted));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">Dzikir Pagi & Petang</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground"
          onClick={resetProgress}
        >
          Reset
        </Button>
      </div>

      {/* Tab Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("pagi")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all",
            activeTab === "pagi"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Sun className="w-4 h-4" />
          Pagi
        </button>
        <button
          onClick={() => setActiveTab("petang")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all",
            activeTab === "petang"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Moon className="w-4 h-4" />
          Petang
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{completedCount} dari {dzikirList.length} dzikir</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Dzikir List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {dzikirList.map((dzikir, index) => (
          <Card 
            key={dzikir.id} 
            className={cn(
              "p-3 transition-all",
              completedItems[dzikir.id] && "bg-primary/5 border-primary/20"
            )}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={() => toggleComplete(dzikir.id)}
                className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-1",
                  completedItems[dzikir.id]
                    ? "bg-primary border-primary"
                    : "border-muted-foreground/30 hover:border-primary"
                )}
              >
                {completedItems[dzikir.id] && (
                  <Check className="w-3 h-3 text-primary-foreground" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    #{index + 1} • {dzikir.count}x
                  </span>
                  <button
                    onClick={() => setExpandedId(expandedId === dzikir.id ? null : dzikir.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expandedId === dzikir.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Arabic Text */}
                <p 
                  className={cn(
                    "text-xl font-arabic text-foreground leading-loose text-right mb-2",
                    completedItems[dzikir.id] && "opacity-60"
                  )}
                  dir="rtl"
                >
                  {dzikir.arabic}
                </p>

                {/* Expanded Content */}
                {expandedId === dzikir.id && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-sm text-foreground italic">{dzikir.latin}</p>
                    <p className="text-sm text-muted-foreground">{dzikir.meaning}</p>
                    {dzikir.source && (
                      <p className="text-xs text-primary/80">{dzikir.source}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
