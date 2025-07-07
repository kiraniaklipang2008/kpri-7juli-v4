import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSimpananCategories, getPinjamanCategories } from "@/services/transaksi/categories";
import { NumberInput } from "@/components/transaksi/NumberInput";
import { NominalInputField } from "@/components/ui/NominalInputField";
import { PinjamanPreview } from "./PinjamanPreview";
import { LoanCategoryInfo } from "./LoanCategoryInfo";
import { getPengaturan } from "@/services/pengaturanService";

interface PengajuanFieldsProps {
  jenis: "Simpan" | "Pinjam" | "Penarikan";
  formData: {
    jumlah: number;
    kategori: string;
    keterangan: string;
    tenor?: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleJumlahChange?: (value: number) => void;
}

export function PengajuanFields({ 
  jenis, 
  formData, 
  handleInputChange, 
  handleSelectChange,
  handleJumlahChange
}: PengajuanFieldsProps) {
  const pengaturan = getPengaturan();
  
  // Get categories based on type
  let categories: string[] = [];
  if (jenis === "Simpan") {
    categories = getSimpananCategories();
  } else if (jenis === "Pinjam") {
    categories = getPinjamanCategories();
  } else if (jenis === "Penarikan") {
    categories = ["Reguler", "Darurat"]; // Categories for withdrawal
  }
  
  // Helper function to get interest rate for loan category
  const getInterestRateForCategory = (category: string): number => {
    if (jenis === "Pinjam" && pengaturan?.sukuBunga?.pinjamanByCategory && 
        category in pengaturan.sukuBunga.pinjamanByCategory) {
      return pengaturan.sukuBunga.pinjamanByCategory[category];
    }
    return pengaturan?.sukuBunga?.pinjaman || 1.5;
  };
  
  // Handler for nominal input field
  const onValueChange = (value: number) => {
    if (handleJumlahChange) {
      handleJumlahChange(value);
    } else {
      // Fallback to the old method if handler not provided
      const syntheticEvent = {
        target: { id: "jumlah", value: String(value) }
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(syntheticEvent);
    }
  };

  const getJenisLabel = () => {
    switch (jenis) {
      case "Simpan": return "Simpanan";
      case "Pinjam": return "Pinjaman";
      case "Penarikan": return "Penarikan";
      default: return "Transaksi";
    }
  };

  const getJumlahLabel = () => {
    switch (jenis) {
      case "Simpan": return "Jumlah Simpanan";
      case "Pinjam": return "Jumlah Pinjaman";
      case "Penarikan": return "Jumlah Penarikan";
      default: return "Jumlah";
    }
  };

  const getJumlahPlaceholder = () => {
    switch (jenis) {
      case "Simpan": return "500.000";
      case "Pinjam": return "5.000.000";
      case "Penarikan": return "1.000.000";
      default: return "0";
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="kategori" className="required">
          Kategori {getJenisLabel()}
        </Label>
        <Select 
          value={formData.kategori}
          onValueChange={(value) => handleSelectChange("kategori", value)}
          required
        >
          <SelectTrigger id="kategori">
            <SelectValue placeholder={`Pilih kategori ${getJenisLabel().toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {jenis === "Pinjam" 
                  ? `${category} - ${getInterestRateForCategory(category)}% per bulan`
                  : category
                }
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Show comprehensive loan information for loan applications */}
      {jenis === "Pinjam" && formData.kategori && (
        <LoanCategoryInfo 
          kategori={formData.kategori}
          jumlah={formData.jumlah}
          tenor={formData.tenor}
        />
      )}
      
      {jenis === "Pinjam" && (
        <div>
          <Label htmlFor="tenor" className="required">
            Tenor Pinjaman (Bulan)
          </Label>
          <Select 
            value={formData.tenor?.toString() || pengaturan?.tenor?.defaultTenor?.toString() || "12"}
            onValueChange={(value) => handleSelectChange("tenor", value)}
            required
          >
            <SelectTrigger id="tenor">
              <SelectValue placeholder="Pilih tenor pinjaman" />
            </SelectTrigger>
            <SelectContent>
              {(pengaturan?.tenor?.tenorOptions || [3, 6, 12, 24, 36]).map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option} bulan
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Jangka waktu pengembalian pinjaman
          </p>
        </div>
      )}
      
      <div>
        <Label htmlFor="jumlah" className="required">
          {getJumlahLabel()} (Rp)
        </Label>
        <NominalInputField
          id="jumlah"
          value={formData.jumlah}
          onValueChange={onValueChange}
          required
          placeholder={`Contoh: ${getJumlahPlaceholder()}`}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Masukkan jumlah tanpa titik atau koma, pemisah ribuan akan otomatis ditampilkan
        </p>
      </div>
      
      <div>
        <Label htmlFor="keterangan">Keterangan</Label>
        <Textarea 
          id="keterangan" 
          placeholder="Masukkan keterangan (opsional)" 
          rows={3}
          value={formData.keterangan}
          onChange={handleInputChange}
        />
      </div>
      
      {/* Keep the existing PinjamanPreview for backward compatibility */}
      {jenis === "Pinjam" && formData.kategori && formData.jumlah > 0 && (
        <PinjamanPreview 
          kategori={formData.kategori}
          jumlah={formData.jumlah}
          tenor={formData.tenor}
        />
      )}
    </div>
  );
}
