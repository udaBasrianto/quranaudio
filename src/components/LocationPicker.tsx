import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, X, Check } from "lucide-react";
import { indonesiaLocations, Provinsi, KabupatenKota, Kecamatan } from "@/data/indonesiaLocations";

export interface ManualLocation {
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  lat: number;
  lng: number;
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

  const [kabupatenKotaList, setKabupatenKotaList] = useState<KabupatenKota[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);

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
