
import { JurnalEntry } from "@/types/akuntansi";
import { Transaksi } from "@/types";
import { getAllTransaksi } from "@/services/transaksiService";
import { getAllJurnalEntries } from "./jurnalService";
import { syncTransactionToAccounting } from "./syncOperationsService";

/**
 * Core SAK ETAP implementation for cooperative accounting
 * Ensures compliance with Indonesian cooperative accounting standards
 */

export interface SAKETAPValidation {
  isCompliant: boolean;
  violations: string[];
  recommendations: string[];
  complianceScore: number;
}

export interface SAKETAPSyncStatus {
  totalTransactions: number;
  syncedTransactions: number;
  pendingSync: number;
  lastSyncDate: string;
}

/**
 * Validate SAK ETAP compliance across all transactions
 */
export function validateSAKETAPCompliance(): SAKETAPValidation {
  const journals = getAllJurnalEntries();
  const transactions = getAllTransaksi();
  
  const violations: string[] = [];
  const recommendations: string[] = [];
  
  // Check 1: Simpanan Pokok/Wajib classification
  const simpananPokokWajibMisclassified = journals.some(journal =>
    journal.deskripsi.toLowerCase().includes('simpanan') &&
    (journal.deskripsi.toLowerCase().includes('pokok') || journal.deskripsi.toLowerCase().includes('wajib')) &&
    journal.details.some(detail => detail.coaId === "6") // Utang Simpanan Sukarela
  );
  
  if (simpananPokokWajibMisclassified) {
    violations.push("Simpanan Pokok/Wajib dicatat sebagai kewajiban, seharusnya ekuitas per SAK ETAP");
    recommendations.push("Reklasifikasi simpanan pokok dan wajib ke akun ekuitas (3100-3200)");
  }
  
  // Check 2: Interest recognition on loan payments
  const angsuranTransactions = transactions.filter(t => t.jenis === "Angsuran" && t.status === "Sukses");
  const angsuranWithoutInterest = angsuranTransactions.filter(transaction => {
    const relatedJournal = journals.find(j => j.referensi === `TXN-${transaction.id}`);
    return relatedJournal && !relatedJournal.details.some(d => d.coaId === "13"); // Pendapatan Jasa Pinjaman
  });
  
  if (angsuranWithoutInterest.length > 0) {
    violations.push(`${angsuranWithoutInterest.length} angsuran tidak mengakui pendapatan jasa secara terpisah`);
    recommendations.push("Pisahkan pembayaran pokok dan bunga dalam setiap angsuran sesuai SAK ETAP");
  }
  
  // Check 3: Loan disbursement recording
  const pinjamanTransactions = transactions.filter(t => t.jenis === "Pinjam" && t.status === "Sukses");
  const pinjamanWithoutPiutang = pinjamanTransactions.filter(transaction => {
    const relatedJournal = journals.find(j => j.referensi === `TXN-${transaction.id}`);
    return relatedJournal && !relatedJournal.details.some(d => d.coaId === "4"); // Piutang Anggota
  });
  
  if (pinjamanWithoutPiutang.length > 0) {
    violations.push(`${pinjamanWithoutPiutang.length} pinjaman tidak dicatat sebagai piutang anggota`);
    recommendations.push("Catat semua pinjaman sebagai Piutang Anggota di neraca");
  }
  
  // Check 4: SHU recording
  const shuJournals = journals.filter(j => j.deskripsi.toLowerCase().includes('shu'));
  if (shuJournals.length === 0) {
    recommendations.push("Pertimbangkan untuk mencatat SHU Belum Dibagi sesuai hasil usaha");
  }
  
  const complianceScore = Math.max(0, 100 - (violations.length * 20));
  
  return {
    isCompliant: violations.length === 0,
    violations,
    recommendations,
    complianceScore
  };
}

/**
 * Get synchronization status between transactions and accounting
 */
export function getSAKETAPSyncStatus(): SAKETAPSyncStatus {
  const transactions = getAllTransaksi().filter(t => t.status === "Sukses");
  const journals = getAllJurnalEntries().filter(j => j.createdBy === "system_auto_sync");
  
  const syncedTransactions = transactions.filter(transaction => 
    journals.some(journal => journal.referensi === `TXN-${transaction.id}`)
  ).length;
  
  return {
    totalTransactions: transactions.length,
    syncedTransactions,
    pendingSync: transactions.length - syncedTransactions,
    lastSyncDate: journals.length > 0 ? 
      Math.max(...journals.map(j => new Date(j.createdAt).getTime())).toString() : 
      new Date().toISOString()
  };
}

/**
 * Sync all pending transactions to accounting following SAK ETAP
 */
export function syncAllToSAKETAP(): { success: number; failed: number; errors: string[] } {
  const transactions = getAllTransaksi().filter(t => t.status === "Sukses");
  const journals = getAllJurnalEntries();
  const errors: string[] = [];
  
  let success = 0;
  let failed = 0;
  
  transactions.forEach(transaction => {
    // Check if already synced
    const alreadySynced = journals.some(j => j.referensi === `TXN-${transaction.id}`);
    if (alreadySynced) return;
    
    try {
      const result = syncTransactionToAccounting(transaction);
      if (result) {
        success++;
        console.log(`✅ SAK ETAP: Synced ${transaction.jenis} transaction ${transaction.id}`);
      } else {
        failed++;
        errors.push(`Failed to sync transaction ${transaction.id}: ${transaction.jenis}`);
      }
    } catch (error) {
      failed++;
      errors.push(`Error syncing transaction ${transaction.id}: ${error}`);
    }
  });
  
  return { success, failed, errors };
}

/**
 * Get SAK ETAP accounting principles for cooperatives
 */
export function getSAKETAPPrinciples() {
  return {
    title: "Prinsip SAK ETAP untuk Koperasi",
    principles: [
      {
        category: "Aset",
        rules: [
          "Kas dan setara kas dicatat sebesar nilai nominal",
          "Piutang anggota dicatat sebesar nilai yang dapat direalisasi",
          "Pinjaman kepada anggota merupakan aset lancar utama koperasi"
        ]
      },
      {
        category: "Kewajiban", 
        rules: [
          "Simpanan sukarela anggota dicatat sebagai kewajiban jangka pendek",
          "Kewajiban diukur sebesar nilai penyelesaian"
        ]
      },
      {
        category: "Ekuitas",
        rules: [
          "Simpanan pokok dan wajib dicatat sebagai ekuitas anggota",
          "SHU belum dibagi dicatat sebagai ekuitas hingga RAT",
          "Cadangan umum merupakan bagian dari ekuitas"
        ]
      },
      {
        category: "Pendapatan",
        rules: [
          "Pendapatan jasa pinjaman diakui saat diterima (cash basis untuk koperasi kecil)",
          "Pendapatan diakui berdasarkan substansi transaksi"
        ]
      },
      {
        category: "Beban",
        rules: [
          "Beban operasional dicatat saat terjadi",
          "Beban administrasi dan umum dipisahkan dari beban usaha"
        ]
      }
    ]
  };
}
