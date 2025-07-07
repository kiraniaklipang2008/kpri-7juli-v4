
import { Transaksi } from "@/types";
import { getPengaturan } from "../pengaturanService";
import { getAllTransaksi } from "../transaksiService";

export interface AngsuranAllocation {
  nominalPokok: number;
  nominalJasa: number;
  sukuBungaPersen: number;
  sisaPokokSebelumAngsuran: number;
  sisaPokokSetelahAngsuran: number;
  keteranganAlokasi: string;
}

/**
 * Calculate allocation of angsuran payment between principal and interest
 * Following SAK ETAP principles for cooperative accounting
 */
export function calculateAngsuranAllocation(
  pinjaman: Transaksi,
  nominalAngsuran: number,
  anggotaId: string
): AngsuranAllocation {
  console.log("Calculating angsuran allocation following SAK ETAP...");
  
  // Get settings for interest rate
  const pengaturan = getPengaturan();
  const sukuBungaPersen = pengaturan.sukuBunga?.pinjaman || 1.5; // Default 1.5% per month
  
  // Calculate remaining principal based on previous payments
  const sisaPokokSebelumAngsuran = calculateRemainingPrincipal(pinjaman, anggotaId);
  
  // Calculate interest on remaining principal (SAK ETAP - interest on outstanding balance)
  const nominalJasa = Math.round(sisaPokokSebelumAngsuran * (sukuBungaPersen / 100));
  
  // Remaining amount goes to principal payment
  const nominalPokok = Math.max(0, nominalAngsuran - nominalJasa);
  
  // Calculate remaining principal after this payment
  const sisaPokokSetelahAngsuran = Math.max(0, sisaPokokSebelumAngsuran - nominalPokok);
  
  const allocation: AngsuranAllocation = {
    nominalPokok,
    nominalJasa,
    sukuBungaPersen,
    sisaPokokSebelumAngsuran,
    sisaPokokSetelahAngsuran,
    keteranganAlokasi: `SAK ETAP: Bunga ${sukuBungaPersen}% dari sisa pokok ${sisaPokokSebelumAngsuran.toLocaleString('id-ID')}`
  };
  
  console.log("SAK ETAP Allocation:", allocation);
  return allocation;
}

/**
 * Calculate remaining principal for a loan following SAK ETAP
 */
function calculateRemainingPrincipal(pinjaman: Transaksi, anggotaId: string): number {
  const allTransaksi = getAllTransaksi();
  
  // Find all angsuran payments for this loan
  const angsuranList = allTransaksi.filter(t => 
    t.anggotaId === anggotaId && 
    t.jenis === "Angsuran" && 
    t.status === "Sukses" &&
    (t.keterangan?.includes(pinjaman.id) || 
     t.keterangan?.includes(`Pinjaman: ${pinjaman.id}`) ||
     t.keterangan?.includes(`pinjaman #${pinjaman.id}`))
  );
  
  // Calculate total principal payments made (excluding interest)
  const pengaturan = getPengaturan();
  const sukuBungaPersen = pengaturan.sukuBunga?.pinjaman || 1.5;
  let totalPokokDibayar = 0;
  let sisaPokok = pinjaman.jumlah;
  
  // Process each angsuran payment in chronological order
  angsuranList.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  
  angsuranList.forEach(angsuran => {
    // Calculate interest on remaining principal at time of payment
    const bungaSaatBayar = Math.round(sisaPokok * (sukuBungaPersen / 100));
    
    // Principal payment is the remainder after interest
    const pokokBayar = Math.max(0, angsuran.jumlah - bungaSaatBayar);
    
    totalPokokDibayar += pokokBayar;
    sisaPokok = Math.max(0, sisaPokok - pokokBayar);
  });
  
  return sisaPokok;
}

/**
 * Calculate total interest earned from a loan following SAK ETAP
 */
export function calculateTotalInterestEarned(pinjaman: Transaksi, anggotaId: string): number {
  const allTransaksi = getAllTransaksi();
  
  const angsuranList = allTransaksi.filter(t => 
    t.anggotaId === anggotaId && 
    t.jenis === "Angsuran" && 
    t.status === "Sukses" &&
    (t.keterangan?.includes(pinjaman.id) || 
     t.keterangan?.includes(`Pinjaman: ${pinjaman.id}`) ||
     t.keterangan?.includes(`pinjaman #${pinjaman.id}`))
  );
  
  const pengaturan = getPengaturan();
  const sukuBungaPersen = pengaturan.sukuBunga?.pinjaman || 1.5;
  let totalBunga = 0;
  let sisaPokok = pinjaman.jumlah;
  
  angsuranList.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  
  angsuranList.forEach(angsuran => {
    const bungaSaatBayar = Math.round(sisaPokok * (sukuBungaPersen / 100));
    const pokokBayar = Math.max(0, angsuran.jumlah - bungaSaatBayar);
    
    totalBunga += bungaSaatBayar;
    sisaPokok = Math.max(0, sisaPokok - pokokBayar);
  });
  
  return totalBunga;
}

/**
 * Get allocation summary for reporting purposes
 */
export function getAllocationSummary(anggotaId: string): {
  totalPinjaman: number;
  totalAngsuranDibayar: number;
  totalPokokDibayar: number;
  totalBungaDibayar: number;
  sisaPinjaman: number;
} {
  const allTransaksi = getAllTransaksi();
  
  const pinjamanList = allTransaksi.filter(t => 
    t.anggotaId === anggotaId && 
    t.jenis === "Pinjam" && 
    t.status === "Sukses"
  );
  
  const angsuranList = allTransaksi.filter(t => 
    t.anggotaId === anggotaId && 
    t.jenis === "Angsuran" && 
    t.status === "Sukses"
  );
  
  const totalPinjaman = pinjamanList.reduce((sum, p) => sum + p.jumlah, 0);
  const totalAngsuranDibayar = angsuranList.reduce((sum, a) => sum + a.jumlah, 0);
  
  let totalPokokDibayar = 0;
  let totalBungaDibayar = 0;
  
  // Calculate principal and interest breakdown
  pinjamanList.forEach(pinjaman => {
    const bungaEarned = calculateTotalInterestEarned(pinjaman, anggotaId);
    const sisaPokok = calculateRemainingPrincipal(pinjaman, anggotaId);
    const pokokDibayar = pinjaman.jumlah - sisaPokok;
    
    totalPokokDibayar += pokokDibayar;
    totalBungaDibayar += bungaEarned;
  });
  
  return {
    totalPinjaman,
    totalAngsuranDibayar,
    totalPokokDibayar,
    totalBungaDibayar,
    sisaPinjaman: totalPinjaman - totalPokokDibayar
  };
}
