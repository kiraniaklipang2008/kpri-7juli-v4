import { getAllJurnalEntries } from "./jurnalService";
import { getAllChartOfAccounts } from "./coaService";
import { Neraca, LabaRugi, NeracaItem, LabaRugiItem } from "@/types/akuntansi";

// Report interfaces
export interface NeracaReport {
  periode: string;
  aset: Array<{
    coaId: string;
    namaAkun: string;
    jumlah: number;
  }>;
  kewajiban: Array<{
    coaId: string;
    namaAkun: string;
    jumlah: number;
  }>;
  modal: Array<{
    coaId: string;
    namaAkun: string;
    jumlah: number;
  }>;
  totalAset: number;
  totalKewajiban: number;
  totalModal: number;
}

export interface LabaRugiReport {
  periode: string;
  pendapatan: Array<{
    coaId: string;
    namaAkun: string;
    jumlah: number;
  }>;
  beban: Array<{
    coaId: string;
    namaAkun: string;
    jumlah: number;
  }>;
  totalPendapatan: number;
  totalBeban: number;
  labaBersih: number;
}

export interface ArusKasReport {
  periode: string;
  kasAwal: number;
  operasional: Array<{
    deskripsi: string;
    jumlah: number;
  }>;
  investasi: Array<{
    deskripsi: string;
    jumlah: number;
  }>;
  pendanaan: Array<{
    deskripsi: string;
    jumlah: number;
  }>;
  perubahanKas: number;
  kasAkhir: number;
}

export interface PerubahanModalReport {
  periode: string;
  modalAwal: number;
  penambahan: Array<{
    deskripsi: string;
    jumlah: number;
  }>;
  pengurangan: Array<{
    deskripsi: string;
    jumlah: number;
  }>;
  totalPenambahan: number;
  totalPengurangan: number;
  modalAkhir: number;
}

// Helper function to format period
const formatPeriod = (period: string): string => {
  const [year, month] = period.split('-');
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

// Generate Neraca report
export const generateNeraca = (period: string): Neraca => {
  console.log("Generating Neraca for period:", period);
  
  const accounts = getAllChartOfAccounts();
  const jurnalEntries = getAllJurnalEntries();
  
  // Mock data for demonstration
  const aset: NeracaItem[] = [
    { coaId: "3", kodeAkun: "1001", namaAkun: "Kas", jumlah: 50000000, level: 2, isGroup: false },
    { coaId: "4", kodeAkun: "1002", namaAkun: "Bank", jumlah: 150000000, level: 2, isGroup: false },
    { coaId: "5", kodeAkun: "1003", namaAkun: "Piutang Anggota", jumlah: 75000000, level: 2, isGroup: false }
  ];
  
  const kewajiban: NeracaItem[] = [
    { coaId: "7", kodeAkun: "2001", namaAkun: "Simpanan Anggota", jumlah: 200000000, level: 1, isGroup: false }
  ];
  
  const modal: NeracaItem[] = [
    { coaId: "9", kodeAkun: "3001", namaAkun: "Modal Awal", jumlah: 75000000, level: 1, isGroup: false }
  ];
  
  const totalAset = aset.reduce((sum, item) => sum + item.jumlah, 0);
  const totalKewajiban = kewajiban.reduce((sum, item) => sum + item.jumlah, 0);
  const totalModal = modal.reduce((sum, item) => sum + item.jumlah, 0);
  
  return {
    periode: formatPeriod(period),
    aset,
    kewajiban,
    modal,
    totalAset,
    totalKewajiban,
    totalModal
  };
};

// Generate Laba Rugi report
export const generateLabaRugi = (period: string): LabaRugi => {
  console.log("Generating Laba Rugi for period:", period);
  
  // Mock data for demonstration
  const pendapatan: LabaRugiItem[] = [
    { coaId: "11", kodeAkun: "4001", namaAkun: "Pendapatan Jasa", jumlah: 25000000, level: 1, isGroup: false }
  ];
  
  const beban: LabaRugiItem[] = [
    { coaId: "13", kodeAkun: "5001", namaAkun: "Beban Operasional", jumlah: 15000000, level: 1, isGroup: false }
  ];
  
  const totalPendapatan = pendapatan.reduce((sum, item) => sum + item.jumlah, 0);
  const totalBeban = beban.reduce((sum, item) => sum + item.jumlah, 0);
  const labaKotor = totalPendapatan; // For simplicity, assume all revenue is gross profit
  const labaBersih = totalPendapatan - totalBeban;
  
  return {
    periode: formatPeriod(period),
    pendapatan,
    beban,
    totalPendapatan,
    totalBeban,
    labaKotor,
    labaBersih
  };
};

// Generate Arus Kas report
export const generateArusKas = (period: string): ArusKasReport => {
  console.log("Generating Arus Kas for period:", period);
  
  // Mock data for demonstration
  const operasional = [
    { deskripsi: "Penerimaan dari simpanan", jumlah: 30000000 },
    { deskripsi: "Pembayaran beban operasional", jumlah: -15000000 }
  ];
  
  const investasi = [
    { deskripsi: "Pembelian peralatan", jumlah: -5000000 }
  ];
  
  const pendanaan = [
    { deskripsi: "Penambahan modal", jumlah: 10000000 }
  ];
  
  const kasAwal = 40000000;
  const perubahanKas = 
    operasional.reduce((sum, item) => sum + item.jumlah, 0) +
    investasi.reduce((sum, item) => sum + item.jumlah, 0) +
    pendanaan.reduce((sum, item) => sum + item.jumlah, 0);
  const kasAkhir = kasAwal + perubahanKas;
  
  return {
    periode: formatPeriod(period),
    kasAwal,
    operasional,
    investasi,
    pendanaan,
    perubahanKas,
    kasAkhir
  };
};

// Generate Perubahan Modal report
export const generatePerubahanModal = (period: string): PerubahanModalReport => {
  console.log("Generating Perubahan Modal for period:", period);
  
  // Mock data for demonstration
  const penambahan = [
    { deskripsi: "Laba bersih periode berjalan", jumlah: 10000000 },
    { deskripsi: "Setoran modal tambahan", jumlah: 5000000 }
  ];
  
  const pengurangan = [
    { deskripsi: "Prive pemilik", jumlah: 3000000 }
  ];
  
  const modalAwal = 65000000;
  const totalPenambahan = penambahan.reduce((sum, item) => sum + item.jumlah, 0);
  const totalPengurangan = pengurangan.reduce((sum, item) => sum + item.jumlah, 0);
  const modalAkhir = modalAwal + totalPenambahan - totalPengurangan;
  
  return {
    periode: formatPeriod(period),
    modalAwal,
    penambahan,
    pengurangan,
    totalPenambahan,
    totalPengurangan,
    modalAkhir
  };
};
