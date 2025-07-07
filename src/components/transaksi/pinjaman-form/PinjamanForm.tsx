
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { FormHeader } from './FormHeader';
import { AnggotaSelector } from './AnggotaSelector';
import { KategoriSelector } from './KategoriSelector';
import { JumlahInput } from './JumlahInput';
import { KeteranganInput } from './KeteranganInput';
import { PinjamanParameters } from './PinjamanParameters';
import { LoanSummary } from './LoanSummary';
import { FormActions } from './FormActions';
import { createTransaksi, updateTransaksi } from '@/services/transaksiService';
import { cleanNumberInput } from '@/utils/formatters';
import { Anggota, Transaksi } from '@/types';
import type { PinjamanFormData, PinjamanFormProps } from './types';

export const PinjamanForm = ({ anggotaList, initialData, onSuccess }: PinjamanFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!initialData;
  
  const [formData, setFormData] = useState<PinjamanFormData>({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: '',
    kategori: '',
    jumlah: 0,
    jumlahPinjaman: '',
    formattedJumlah: '',
    tenor: 12,
    bunga: 1,
    keterangan: '',
    angsuran: 0,
    angsuranPerBulan: 0,
    totalBunga: 0,
    totalPengembalian: 0,
    jatuhTempo: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with data if in edit mode
  useEffect(() => {
    if (initialData) {
      // Try to parse tenor, bunga, angsuran per bulan from keterangan
      let tenor = 12;
      let bunga = 1;
      let angsuranPerBulan = Math.ceil(initialData.jumlah / tenor);
      
      if (initialData.keterangan) {
        const tenorMatch = initialData.keterangan.match(/Tenor: (\d+) bulan/);
        const bungaMatch = initialData.keterangan.match(/Bunga: (\d+(?:\.\d+)?)%/);
        const angsuranMatch = initialData.keterangan.match(/Angsuran per bulan: Rp ([0-9,.]+)/);
        
        if (tenorMatch && tenorMatch[1]) {
          tenor = parseInt(tenorMatch[1]);
        }
        
        if (bungaMatch && bungaMatch[1]) {
          bunga = parseFloat(bungaMatch[1]);
        }
        
        if (angsuranMatch && angsuranMatch[1]) {
          angsuranPerBulan = parseInt(angsuranMatch[1].replace(/[,.]/g, ""));
        }
      }
      
      // Calculate jatuh tempo
      const tanggalPinjam = new Date(initialData.tanggal);
      const jatuhTempoDate = new Date(tanggalPinjam);
      jatuhTempoDate.setMonth(jatuhTempoDate.getMonth() + tenor);
      
      const totalBunga = initialData.jumlah * (bunga / 100) * tenor;
      const totalPengembalian = initialData.jumlah + totalBunga;
      
      // Set form data
      setFormData({
        tanggal: initialData.tanggal,
        anggotaId: initialData.anggotaId,
        kategori: initialData.kategori || '',
        jumlah: initialData.jumlah,
        jumlahPinjaman: initialData.jumlah.toString(),
        formattedJumlah: initialData.jumlah.toLocaleString('id-ID'),
        tenor,
        bunga,
        keterangan: initialData.keterangan || '',
        angsuran: angsuranPerBulan,
        angsuranPerBulan,
        totalBunga,
        totalPengembalian,
        jatuhTempo: jatuhTempoDate.toISOString().split('T')[0],
      });
    }
  }, [initialData]);
  
  const handleAnggotaChange = (anggotaId: string) => {
    setFormData(prev => ({ ...prev, anggotaId }));
  };
  
  const handleKategoriChange = (kategori: string) => {
    setFormData(prev => ({ ...prev, kategori }));
  };
  
  const handleJumlahChange = (value: string, formatted: string) => {
    setFormData(prev => {
      const jumlahNumber = parseFloat(value) || 0;
      
      // Calculate loan parameters
      const totalBunga = jumlahNumber * (prev.bunga / 100) * prev.tenor;
      const totalPengembalian = jumlahNumber + totalBunga;
      const angsuranPerBulan = Math.ceil(totalPengembalian / prev.tenor);
      
      // Calculate jatuh tempo
      const tanggalPinjam = new Date(prev.tanggal);
      const jatuhTempoDate = new Date(tanggalPinjam);
      jatuhTempoDate.setMonth(jatuhTempoDate.getMonth() + prev.tenor);
      
      return {
        ...prev,
        jumlah: jumlahNumber,
        jumlahPinjaman: value,
        formattedJumlah: formatted,
        totalBunga,
        totalPengembalian,
        angsuranPerBulan,
        angsuran: angsuranPerBulan,
        jatuhTempo: jatuhTempoDate.toISOString().split('T')[0],
      };
    });
  };
  
  const handleParameterChange = (field: 'tenor' | 'bunga' | 'tanggal', value: number | string) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value };
      const jumlahNumber = parseFloat(prev.jumlahPinjaman) || 0;
      
      // Recalculate loan parameters
      const totalBunga = jumlahNumber * (updatedData.bunga / 100) * updatedData.tenor;
      const totalPengembalian = jumlahNumber + totalBunga;
      const angsuranPerBulan = Math.ceil(totalPengembalian / updatedData.tenor);
      
      // Recalculate jatuh tempo if tanggal changed
      let jatuhTempo = updatedData.jatuhTempo;
      if (field === 'tanggal' || field === 'tenor') {
        const tanggalPinjam = new Date(updatedData.tanggal as string);
        const jatuhTempoDate = new Date(tanggalPinjam);
        jatuhTempoDate.setMonth(jatuhTempoDate.getMonth() + (updatedData.tenor as number));
        jatuhTempo = jatuhTempoDate.toISOString().split('T')[0];
      }
      
      return {
        ...updatedData,
        totalBunga,
        totalPengembalian,
        angsuranPerBulan,
        angsuran: angsuranPerBulan,
        jatuhTempo,
      };
    });
  };
  
  const handleKeteranganChange = (keterangan: string) => {
    setFormData(prev => ({ ...prev, keterangan }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.anggotaId) {
      toast({
        title: "Error",
        description: "Silakan pilih anggota",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.kategori) {
      toast({
        title: "Error",
        description: "Silakan pilih kategori pinjaman",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.jumlahPinjaman || parseFloat(formData.jumlahPinjaman) <= 0) {
      toast({
        title: "Error",
        description: "Jumlah pinjaman harus lebih dari 0",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Build keterangan string with loan details
      const detailKeterangan = [
        `Tenor: ${formData.tenor} bulan`,
        `Bunga: ${formData.bunga}%`,
        `Angsuran per bulan: Rp ${formData.angsuranPerBulan.toLocaleString('id-ID')}`,
        `Total pengembalian: Rp ${formData.totalPengembalian.toLocaleString('id-ID')}`,
        `Jatuh tempo: ${new Date(formData.jatuhTempo).toLocaleDateString('id-ID')}`
      ].join(', ');
      
      const fullKeterangan = formData.keterangan 
        ? `${formData.keterangan} (${detailKeterangan})`
        : detailKeterangan;
      
      // Prepare transaksi data
      const transaksiData = {
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: "Pinjam" as const, 
        kategori: formData.kategori,
        jumlah: formData.jumlah,
        keterangan: fullKeterangan,
        status: "Sukses" as const,
      };
      
      let result;
      
      if (isEditMode && initialData?.id) {
        // Update existing transaction
        result = updateTransaksi(initialData.id, transaksiData);
        
        if (result) {
          toast({
            title: "Pinjaman berhasil diperbarui",
            description: `Pinjaman dengan ID ${result.id} telah diperbarui.`,
          });
        }
      } else {
        // Create new transaction
        result = createTransaksi(transaksiData);
        
        if (result) {
          toast({
            title: "Pinjaman berhasil disimpan",
            description: `Pinjaman baru dengan ID ${result.id} telah dibuat.`,
          });
        }
      }
      
      if (result) {
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/transaksi/pinjam");
        }
      } else {
        throw new Error("Gagal menyimpan pinjaman");
      }
      
    } catch (error) {
      console.error("Error saving pinjaman:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan pinjaman. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <FormHeader isEditMode={isEditMode} />
        
        <AnggotaSelector
          anggotaList={anggotaList}
          selectedAnggotaId={formData.anggotaId}
          onChange={handleAnggotaChange}
          disabled={isEditMode}
        />
        
        <KategoriSelector
          selectedKategori={formData.kategori}
          onChange={handleKategoriChange}
        />
        
        <JumlahInput
          value={formData.formattedJumlah}
          onChange={handleJumlahChange}
        />
        
        <PinjamanParameters
          tanggal={formData.tanggal}
          tenor={formData.tenor}
          bunga={formData.bunga}
          onChange={handleParameterChange}
        />
        
        <LoanSummary
          angsuranPerBulan={formData.angsuranPerBulan}
          totalBunga={formData.totalBunga}
          totalPengembalian={formData.totalPengembalian}
          jatuhTempo={formData.jatuhTempo}
        />
        
        <KeteranganInput
          value={formData.keterangan}
          onChange={handleKeteranganChange}
        />
        
        <FormActions
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
        />
      </div>
    </form>
  );
};
