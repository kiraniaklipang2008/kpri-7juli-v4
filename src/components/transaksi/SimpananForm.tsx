
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PiggyBank, Zap } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { createTransaksi, updateTransaksi } from "@/services/transaksiService";
import { getJenisByType } from "@/services/jenisService";
import { Transaksi } from "@/types";
import { JenisSimpanan } from "@/types/jenis";
import { useToast } from "@/components/ui/use-toast";

interface SimpananFormProps {
  anggotaList: any[];
  initialData?: Transaksi;
  onSuccess: () => void;
}

export function SimpananForm({ anggotaList, initialData, onSuccess }: SimpananFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tanggal: initialData?.tanggal || new Date().toISOString().split('T')[0],
    anggotaId: initialData?.anggotaId || "",
    kategori: initialData?.kategori || "",
    jumlah: initialData?.jumlah?.toString() || "",
    keterangan: initialData?.keterangan || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available simpanan categories from Jenis Simpanan
  const jenisSimpanan = getJenisByType("Simpanan") as JenisSimpanan[];
  const availableKategori = jenisSimpanan
    .filter(jenis => jenis.isActive)
    .map(jenis => ({
      id: jenis.id,
      nama: jenis.nama,
      keterangan: jenis.keterangan
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.anggotaId || !formData.jumlah || !formData.kategori) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap lengkapi semua field yang wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (initialData) {
        // Update existing transaction
        const updatedTransaksi = updateTransaksi(initialData.id, {
          tanggal: formData.tanggal,
          anggotaId: formData.anggotaId,
          jenis: "Simpan",
          kategori: formData.kategori,
          jumlah: parseInt(formData.jumlah),
          keterangan: formData.keterangan,
          status: initialData.status
        });

        if (updatedTransaksi) {
          toast({
            title: "✅ Simpanan berhasil diperbarui & Auto-Sync ke Akuntansi",
            description: `Data simpanan ${formData.kategori} berhasil diperbarui dan otomatis tersinkronisasi ke Jurnal Umum`,
          });
          onSuccess();
        }
      } else {
        // Create new transaction with auto accounting sync
        const newTransaksi = createTransaksi({
          tanggal: formData.tanggal,
          anggotaId: formData.anggotaId,
          jenis: "Simpan",
          kategori: formData.kategori,
          jumlah: parseInt(formData.jumlah),
          keterangan: formData.keterangan,
          status: "Sukses"
        });

        if (newTransaksi) {
          toast({
            title: "✅ Simpanan berhasil disimpan & Auto-Sync ke Akuntansi",
            description: `Simpanan ${formData.kategori} berhasil disimpan dan otomatis tersinkronisasi ke Jurnal Umum`,
          });
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error saving simpanan:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan data simpanan",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5" />
          {initialData ? "Edit Simpanan" : "Form Simpanan"}
          <div className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <Zap className="h-3 w-3" />
            Auto-Sync Akuntansi
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal *</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => handleInputChange("tanggal", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anggota">Anggota *</Label>
              <Select
                value={formData.anggotaId}
                onValueChange={(value) => handleInputChange("anggotaId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  {anggotaList.map((anggota: any) => (
                    <SelectItem key={anggota.id} value={anggota.id}>
                      {anggota.nama} - {anggota.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori Simpanan *</Label>
              <Select
                value={formData.kategori}
                onValueChange={(value) => handleInputChange("kategori", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori simpanan" />
                </SelectTrigger>
                <SelectContent>
                  {availableKategori.map((kategori) => (
                    <SelectItem key={kategori.id} value={kategori.nama}>
                      {kategori.nama}
                      {kategori.keterangan && (
                        <span className="text-xs text-muted-foreground ml-2">
                          - {kategori.keterangan}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jumlah">Jumlah Simpanan *</Label>
              <Input
                id="jumlah"
                type="number"
                placeholder="Masukkan jumlah simpanan"
                value={formData.jumlah}
                onChange={(e) => handleInputChange("jumlah", e.target.value)}
                required
              />
              {formData.jumlah && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(parseInt(formData.jumlah || "0"))}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                placeholder="Keterangan simpanan (opsional)"
                value={formData.keterangan}
                onChange={(e) => handleInputChange("keterangan", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : initialData ? "Update Simpanan" : "Simpan Simpanan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
