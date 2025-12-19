export interface Surah {
  id: number;
  name: string;
  start_page: number;
  end_page: number;
  makkia: number;
  type?: number;
}

export interface Moshaf {
  id: number;
  name: string;
  server: string;
  surah_total: number;
  moshaf_type: number;
  surah_list: string;
}

export interface Reciter {
  id: number;
  name: string;
  letter: string;
  moshaf: Moshaf[];
}

export interface RecitersResponse {
  reciters: Reciter[];
}

export interface SurahResponse {
  suwar: Surah[];
}
