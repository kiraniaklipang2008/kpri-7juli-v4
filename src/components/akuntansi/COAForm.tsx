
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ChartOfAccount } from "@/types/akuntansi";
import { X } from "lucide-react";

interface COAFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: ChartOfAccount;
  parentAccounts: ChartOfAccount[];
  isLoading: boolean;
}

export function COAForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  parentAccounts,
  isLoading 
}: COAFormProps) {
  const [formData, setFormData] = useState({
    kode: initialData?.kode || "",
    nama: initialData?.nama || "",
    jenis: initialData?.jenis || "ASET",
    kategori: initialData?.kategori || "",
    parentId: initialData?.parentId || "",
    isGroup: initialData?.isGroup || false,
    saldoNormal: initialData?.saldoNormal || "DEBIT",
    deskripsi: initialData?.deskripsi || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const level = formData.parentId 
      ? (parentAccounts.find(p => p.id === formData.parentId)?.level || 0) + 1 
      : 1;

    await onSubmit({
      ...formData,
      level,
      isActive: true,
    });
    
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {initialData ? "Edit Akun" : "Tambah Akun Baru"}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kode">Kode Akun *</Label>
              <Input
                id="kode"
                value={formData.kode}
                onChange={(e) => updateFormData("kode", e.target.value)}
                placeholder="Contoh: 1100"
                required
              />
            </div>
            <div>
              <Label htmlFor="nama">Nama Akun *</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => updateFormData("nama", e.target.value)}
                placeholder="Contoh: Kas dan Bank"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jenis">Jenis Akun *</Label>
              <Select value={formData.jenis} onValueChange={(value) => updateFormData("jenis", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASET">Aset</SelectItem>
                  <SelectItem value="KEWAJIBAN">Kewajiban</SelectItem>
                  <SelectItem value="MODAL">Modal</SelectItem>
                  <SelectItem value="PENDAPATAN">Pendapatan</SelectItem>
                  <SelectItem value="BEBAN">Beban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="kategori">Kategori</Label>
              <Input
                id="kategori"
                value={formData.kategori}
                onChange={(e) => updateFormData("kategori", e.target.value)}
                placeholder="Contoh: ASET LANCAR"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parentId">Parent Akun</Label>
              <Select value={formData.parentId} onValueChange={(value) => updateFormData("parentId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih parent akun (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tidak ada parent</SelectItem>
                  {parentAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.kode} - {account.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="saldoNormal">Saldo Normal</Label>
              <Select value={formData.saldoNormal} onValueChange={(value) => updateFormData("saldoNormal", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBIT">Debit</SelectItem>
                  <SelectItem value="KREDIT">Kredit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isGroup"
              checked={formData.isGroup}
              onCheckedChange={(checked) => updateFormData("isGroup", checked)}
            />
            <Label htmlFor="isGroup">Akun Grup (dapat memiliki sub akun)</Label>
          </div>

          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => updateFormData("deskripsi", e.target.value)}
              placeholder="Deskripsi opsional untuk akun ini"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : (initialData ? "Perbarui" : "Simpan")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
