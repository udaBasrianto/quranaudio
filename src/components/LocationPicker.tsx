import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, X, Check, Search } from "lucide-react";
import { indonesiaLocations, Provinsi, KabupatenKota, Kecamatan } from "@/data/indonesiaLocations";

export interface ManualLocation {
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  lat: number;
  lng: number;
}

interface SearchResult {
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  lat: number;
  lng: number;
  displayText: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: ManualLocation | null) => void;
  currentLocation: ManualLocation | null;
  onClose: () => void;
}

export function LocationPicker({ onLocationSelect, currentLocation, onClose }: LocationPickerProps) {
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>(currentLocation?.provinsi || "");
  const [selectedKabKota, setSelectedKabKota] = useState<string>(currentLocation?.kabupatenKota || "");
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>(currentLocation?.kecamatan || "");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [kabupatenKotaList, setKabupatenKotaList] = useState<KabupatenKota[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);

  // Build flat list of all kecamatan for search
  const allKecamatan = useMemo(() => {
    const results: SearchResult[] = [];
    indonesiaLocations.forEach((provinsi) => {
      provinsi.kabupatenKota.forEach((kabKota) => {
        kabKota.kecamatan.forEach((kec) => {
          results.push({
            provinsi: provinsi.name,
            kabupatenKota: kabKota.name,
            kecamatan: kec.name,
            lat: kec.lat,
            lng: kec.lng,
            displayText: `${kec.name}, ${kabKota.name}, ${provinsi.name}`,
          });
        });
      });
    });
    return results;
  }, []);

  // Filter search results
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return allKecamatan
      .filter((item) => 
        item.kecamatan.toLowerCase().includes(query) ||
        item.kabupatenKota.toLowerCase().includes(query) ||
        item.provinsi.toLowerCase().includes(query)
      )
      .slice(0, 10); // Limit to 10 results
  }, [searchQuery, allKecamatan]);

  const handleSearchSelect = (result: SearchResult) => {
    setSelectedProvinsi(result.provinsi);
    setSelectedKabKota(result.kabupatenKota);
    setSelectedKecamatan(result.kecamatan);
    setSearchQuery("");
    setShowSearchResults(false);
    
    // Update kabupaten and kecamatan lists
    const provinsi = indonesiaLocations.find((p) => p.name === result.provinsi);
    if (provinsi) {
      setKabupatenKotaList(provinsi.kabupatenKota);
      const kabKota = provinsi.kabupatenKota.find((k) => k.name === result.kabupatenKota);
      if (kabKota) {
        setKecamatanList(kabKota.kecamatan);
      }
    }
  };

  useEffect(() => {
    if (selectedProvinsi) {
      const provinsi = indonesiaLocations.find((p) => p.name === selectedProvinsi);
      setKabupatenKotaList(provinsi?.kabupatenKota || []);
      if (!provinsi?.kabupatenKota.find((k) => k.name === selectedKabKota)) {
        setSelectedKabKota("");
        setSelectedKecamatan("");
        setKecamatanList([]);
      }
    } else {
      setKabupatenKotaList([]);
      setSelectedKabKota("");
      setSelectedKecamatan("");
      setKecamatanList([]);
    }
  }, [selectedProvinsi]);

  useEffect(() => {
    if (selectedKabKota) {
      const kabKota = kabupatenKotaList.find((k) => k.name === selectedKabKota);
      setKecamatanList(kabKota?.kecamatan || []);
      if (!kabKota?.kecamatan.find((kec) => kec.name === selectedKecamatan)) {
        setSelectedKecamatan("");
      }
    } else {
      setKecamatanList([]);
      setSelectedKecamatan("");
    }
  }, [selectedKabKota, kabupatenKotaList]);

  const handleSave = () => {
    if (selectedProvinsi && selectedKabKota && selectedKecamatan) {
      const kecamatan = kecamatanList.find((k) => k.name === selectedKecamatan);
      if (kecamatan) {
        onLocationSelect({
          provinsi: selectedProvinsi,
          kabupatenKota: selectedKabKota,
          kecamatan: selectedKecamatan,
          lat: kecamatan.lat,
          lng: kecamatan.lng,
        });
      }
    }
  };

  const handleReset = () => {
    onLocationSelect(null);
  };

  const isComplete = selectedProvinsi && selectedKabKota && selectedKecamatan;

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm">Pilih Lokasi Manual</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <label className="text-xs text-muted-foreground mb-1 block">Cari Lokasi</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ketik nama kecamatan, kota, atau provinsi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="pl-9"
            />
          </div>
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.provinsi}-${result.kabupatenKota}-${result.kecamatan}-${index}`}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors border-b border-border/50 last:border-b-0"
                  onClick={() => handleSearchSelect(result)}
                >
                  <span className="font-medium text-foreground">{result.kecamatan}</span>
                  <span className="text-muted-foreground text-xs block">
                    {result.kabupatenKota}, {result.provinsi}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          <span>atau pilih manual</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Provinsi</label>
          <Select value={selectedProvinsi} onValueChange={setSelectedProvinsi}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Provinsi" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {indonesiaLocations.map((provinsi) => (
                <SelectItem key={provinsi.name} value={provinsi.name}>
                  {provinsi.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Kabupaten/Kota</label>
          <Select
            value={selectedKabKota}
            onValueChange={setSelectedKabKota}
            disabled={!selectedProvinsi}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kabupaten/Kota" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {kabupatenKotaList.map((kabKota) => (
                <SelectItem key={kabKota.name} value={kabKota.name}>
                  {kabKota.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Kecamatan</label>
          <Select
            value={selectedKecamatan}
            onValueChange={setSelectedKecamatan}
            disabled={!selectedKabKota}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kecamatan" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {kecamatanList.map((kecamatan) => (
                <SelectItem key={kecamatan.name} value={kecamatan.name}>
                  {kecamatan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-2">
          {currentLocation && (
            <Button variant="outline" size="sm" onClick={handleReset} className="flex-1">
              Gunakan GPS
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isComplete}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-1" />
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
