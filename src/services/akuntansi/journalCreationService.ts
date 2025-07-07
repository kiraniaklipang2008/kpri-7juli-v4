
import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";
import { Transaksi } from "@/types";
import { createJurnalEntry } from "./jurnalService";
import { AngsuranAllocation } from "./allocationService";

/**
 * Create journal entry for Simpanan transaction following SAK ETAP
 */
export function createSimpananJournalEntry(transaksi: Transaksi): JurnalEntry | null {
  try {
    let details: JurnalDetail[] = [];
    
    // Determine simpanan type based on kategori
    const kategori = transaksi.kategori?.toLowerCase() || "";
    
    if (kategori.includes("pokok")) {
      // Simpanan Pokok - Recorded as Equity per SAK ETAP
      details = [
        {
          id: "1",
          jurnalId: "",
          coaId: "2", // Kas
          debit: transaksi.jumlah,
          kredit: 0,
          keterangan: `Penerimaan simpanan pokok dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: "8", // Simpanan Pokok (Ekuitas)
          debit: 0,
          kredit: transaksi.jumlah,
          keterangan: `Simpanan pokok anggota - ${transaksi.anggotaNama} (SAK ETAP)`
        }
      ];
    } else if (kategori.includes("wajib")) {
      // Simpanan Wajib - Recorded as Equity per SAK ETAP
      details = [
        {
          id: "1",
          jurnalId: "",
          coaId: "2", // Kas
          debit: transaksi.jumlah,
          kredit: 0,
          keterangan: `Penerimaan simpanan wajib dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: "9", // Simpanan Wajib (Ekuitas)
          debit: 0,
          kredit: transaksi.jumlah,
          keterangan: `Simpanan wajib anggota - ${transaksi.anggotaNama} (SAK ETAP)`
        }
      ];
    } else {
      // Simpanan Sukarela - Recorded as Liability per SAK ETAP
      details = [
        {
          id: "1",
          jurnalId: "",
          coaId: "2", // Kas
          debit: transaksi.jumlah,
          kredit: 0,
          keterangan: `Penerimaan simpanan sukarela dari ${transaksi.anggotaNama}`
        },
        {
          id: "2", 
          jurnalId: "",
          coaId: "6", // Utang Simpanan Sukarela
          debit: 0,
          kredit: transaksi.jumlah,
          keterangan: `Simpanan sukarela anggota - ${transaksi.anggotaNama} (SAK ETAP)`
        }
      ];
    }

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return createJurnalEntry({
      tanggal: transaksi.tanggal,
      deskripsi: `SAK ETAP SIMPANAN - ${transaksi.anggotaNama} | ${transaksi.kategori || 'Umum'}: ${formatCurrency(transaksi.jumlah)}`,
      referensi: `TXN-${transaksi.id}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK ETAP simpanan journal entry:", error);
    return null;
  }
}

/**
 * Create journal entry for Pinjaman transaction following SAK ETAP
 */
export function createPinjamanJournalEntry(transaksi: Transaksi): JurnalEntry | null {
  try {
    const details: JurnalDetail[] = [
      {
        id: "1",
        jurnalId: "",
        coaId: "4", // Piutang Anggota
        debit: transaksi.jumlah,
        kredit: 0,
        keterangan: `Piutang pinjaman kepada ${transaksi.anggotaNama} (SAK ETAP)`
      },
      {
        id: "2",
        jurnalId: "",
        coaId: "2", // Kas
        debit: 0,
        kredit: transaksi.jumlah,
        keterangan: `Pencairan pinjaman untuk ${transaksi.anggotaNama}`
      }
    ];

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return createJurnalEntry({
      tanggal: transaksi.tanggal,
      deskripsi: `SAK ETAP PINJAMAN - ${transaksi.anggotaNama} | ${transaksi.kategori || 'Reguler'}: ${formatCurrency(transaksi.jumlah)}`,
      referensi: `TXN-${transaksi.id}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK ETAP pinjaman journal entry:", error);
    return null;
  }
}

/**
 * Create journal entry for Angsuran transaction following SAK ETAP
 * Properly allocating principal and interest with enhanced sync to Keuangan
 */
export function createAngsuranJournalEntry(
  transaksi: Transaksi, 
  pinjaman: Transaksi,
  allocation: AngsuranAllocation
): JurnalEntry | null {
  try {
    const details: JurnalDetail[] = [
      {
        id: "1",
        jurnalId: "",
        coaId: "2", // Kas
        debit: transaksi.jumlah,
        kredit: 0,
        keterangan: `Penerimaan angsuran dari ${transaksi.anggotaNama} - SAK ETAP: Pokok ${formatCurrency(allocation.nominalPokok)}, Jasa ${formatCurrency(allocation.nominalJasa)}`
      }
    ];

    // Principal payment - reduces Piutang Anggota
    if (allocation.nominalPokok > 0) {
      details.push({
        id: "2",
        jurnalId: "",
        coaId: "4", // Piutang Anggota
        debit: 0,
        kredit: allocation.nominalPokok,
        keterangan: `Pengurangan piutang anggota - Pembayaran pokok ${formatCurrency(allocation.nominalPokok)} (SAK ETAP)`
      });
    }

    // Interest income - recognized as revenue (also synced to Keuangan)
    if (allocation.nominalJasa > 0) {
      details.push({
        id: "3",
        jurnalId: "",
        coaId: "13", // Pendapatan Jasa Pinjaman
        debit: 0,
        kredit: allocation.nominalJasa,
        keterangan: `Pendapatan jasa pinjaman ${formatCurrency(allocation.nominalJasa)} - Bunga ${allocation.sukuBungaPersen.toFixed(2)}% (SAK ETAP + Keuangan Sync)`
      });
    }

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    const pokokPercentage = transaksi.jumlah > 0 ? ((allocation.nominalPokok / transaksi.jumlah) * 100).toFixed(1) : '0';
    const jasaPercentage = transaksi.jumlah > 0 ? ((allocation.nominalJasa / transaksi.jumlah) * 100).toFixed(1) : '0';

    return createJurnalEntry({
      tanggal: transaksi.tanggal,
      deskripsi: `SAK ETAP ANGSURAN + KEUANGAN SYNC - ${transaksi.anggotaNama} | Pokok: ${pokokPercentage}% (${formatCurrency(allocation.nominalPokok)}) | Jasa: ${jasaPercentage}% (${formatCurrency(allocation.nominalJasa)}) | Rate: ${allocation.sukuBungaPersen.toFixed(2)}%`,
      referensi: `TXN-${transaksi.id}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK ETAP angsuran journal entry:", error);
    return null;
  }
}

/**
 * Create journal entry for Penarikan transaction following SAK ETAP
 */
export function createPenarikanJournalEntry(transaksi: Transaksi): JurnalEntry | null {
  try {
    // For withdrawal, we need to determine if it's from savings equity or liability
    // Default to liability (simpanan sukarela) unless specified
    const details: JurnalDetail[] = [
      {
        id: "1",
        jurnalId: "",
        coaId: "6", // Utang Simpanan Sukarela (assuming sukarela withdrawal)
        debit: Math.abs(transaksi.jumlah),
        kredit: 0,
        keterangan: `Penarikan simpanan oleh ${transaksi.anggotaNama} (SAK ETAP)`
      },
      {
        id: "2",
        jurnalId: "",
        coaId: "2", // Kas
        debit: 0,
        kredit: Math.abs(transaksi.jumlah),
        keterangan: `Pembayaran penarikan kepada ${transaksi.anggotaNama}`
      }
    ];

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return createJurnalEntry({
      tanggal: transaksi.tanggal,
      deskripsi: `SAK ETAP PENARIKAN - ${transaksi.anggotaNama} | ${formatCurrency(Math.abs(transaksi.jumlah))}`,
      referensi: `TXN-${transaksi.id}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK ETAP penarikan journal entry:", error);
    return null;
  }
}

/**
 * Create journal entry for Pengeluaran (Expense) transactions to Biaya Operasional
 */
export function createPengeluaranJournalEntry(
  pengeluaran: any,
  referensi: string = ""
): JurnalEntry | null {
  try {
    const details: JurnalDetail[] = [
      {
        id: "1",
        jurnalId: "",
        coaId: "14", // Biaya Operasional
        debit: pengeluaran.jumlah,
        kredit: 0,
        keterangan: `Biaya operasional - ${pengeluaran.kategori}: ${pengeluaran.keterangan} (Auto-sync dari Keuangan)`
      },
      {
        id: "2",
        jurnalId: "",
        coaId: "2", // Kas
        debit: 0,
        kredit: pengeluaran.jumlah,
        keterangan: `Pembayaran ${pengeluaran.kategori} - ${pengeluaran.keterangan}`
      }
    ];

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return createJurnalEntry({
      tanggal: pengeluaran.tanggal,
      deskripsi: `PENGELUARAN TO BIAYA OPERASIONAL - ${pengeluaran.kategori} | ${formatCurrency(pengeluaran.jumlah)}`,
      referensi: referensi || `KEUANGAN-${pengeluaran.id}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating pengeluaran journal entry:", error);
    return null;
  }
}

/**
 * Create journal entry for SHU distribution based on RAT decision
 */
export function createSHUDistributionEntry(
  totalSHU: number,
  jasaModal: number,
  jasaUsaha: number,
  tanggal: string,
  keterangan: string = "Pembagian SHU berdasarkan RAT"
): JurnalEntry | null {
  try {
    const details: JurnalDetail[] = [
      {
        id: "1",
        jurnalId: "",
        coaId: "11", // SHU Belum Dibagi
        debit: totalSHU,
        kredit: 0,
        keterangan: `Alokasi SHU untuk dibagikan - ${keterangan}`
      }
    ];

    // Add entries for jasa modal and jasa usaha distribution
    let detailIndex = 2;
    
    if (jasaModal > 0) {
      details.push({
        id: detailIndex.toString(),
        jurnalId: "",
        coaId: "8", // Simpanan Pokok (for jasa modal)
        debit: 0,
        kredit: jasaModal,
        keterangan: `Jasa Modal - Pembagian SHU berdasarkan simpanan (SAK ETAP)`
      });
      detailIndex++;
    }

    if (jasaUsaha > 0) {
      details.push({
        id: detailIndex.toString(),
        jurnalId: "",
        coaId: "10", // Cadangan Umum (for jasa usaha)
        debit: 0,
        kredit: jasaUsaha,
        keterangan: `Jasa Usaha - Pembagian SHU berdasarkan transaksi (SAK ETAP)`
      });
    }

    const totalDebit = details.reduce((sum, detail) => sum + detail.debit, 0);
    const totalKredit = details.reduce((sum, detail) => sum + detail.kredit, 0);

    return createJurnalEntry({
      tanggal,
      deskripsi: `SAK ETAP SHU DISTRIBUTION - Total: ${formatCurrency(totalSHU)} | Jasa Modal: ${formatCurrency(jasaModal)} | Jasa Usaha: ${formatCurrency(jasaUsaha)}`,
      referensi: `SHU-${Date.now()}`,
      status: "POSTED",
      createdBy: "system_auto_sync",
      totalDebit,
      totalKredit,
      details
    });
  } catch (error) {
    console.error("Error creating SAK ETAP SHU distribution entry:", error);
    return null;
  }
}

// Helper function for currency formatting
function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}
