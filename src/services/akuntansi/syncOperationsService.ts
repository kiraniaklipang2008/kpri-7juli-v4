
import { Transaksi } from "@/types";
import { JurnalEntry } from "@/types/akuntansi";
import { getAllTransaksi } from "@/services/transaksiService";
import { calculateAngsuranAllocation } from "./allocationService";
import { refreshFinancialCalculations } from "@/services/realTimeCalculationService";
import { syncTransactionToKeuangan } from "@/services/sync/comprehensiveSyncService";
import { 
  createSimpananJournalEntry, 
  createPinjamanJournalEntry, 
  createAngsuranJournalEntry, 
  createPenarikanJournalEntry 
} from "./journalCreationService";

/**
 * Extract loan ID from keterangan string
 */
function extractLoanIdFromKeterangan(keterangan: string): string | null {
  // Look for pattern "Pinjaman: XXXX" or "pinjaman #XXXX"
  const patterns = [
    /Pinjaman:\s*(\w+)/i,
    /pinjaman\s*#(\w+)/i,
    /untuk\s+pinjaman\s*#(\w+)/i
  ];
  
  for (const pattern of patterns) {
    const match = keterangan.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Main function to synchronize transaction with accounting and keuangan modules
 */
export function syncTransactionToAccounting(transaksi: Transaksi): JurnalEntry | null {
  console.log(`Auto-syncing transaction ${transaksi.id} to accounting with comprehensive sync...`);
  
  let journalEntry: JurnalEntry | null = null;
  
  switch (transaksi.jenis) {
    case "Simpan":
      journalEntry = createSimpananJournalEntry(transaksi);
      break;
      
    case "Pinjam":
      journalEntry = createPinjamanJournalEntry(transaksi);
      break;
      
    case "Angsuran":
      // Find the related loan for proper allocation
      const loanId = extractLoanIdFromKeterangan(transaksi.keterangan || "");
      if (loanId) {
        const allTransaksi = getAllTransaksi();
        const pinjaman = allTransaksi.find(t => t.id === loanId && t.jenis === "Pinjam");
        if (pinjaman) {
          const allocation = calculateAngsuranAllocation(pinjaman, transaksi.jumlah, transaksi.anggotaId);
          console.log(`Auto-split allocation calculated: Jasa ${allocation.nominalJasa} (${allocation.sukuBungaPersen.toFixed(2)}%), Pokok ${allocation.nominalPokok}`);
          journalEntry = createAngsuranJournalEntry(transaksi, pinjaman, allocation);
          
          // Comprehensive sync: Sync jasa component to Keuangan
          const keuanganSync = syncTransactionToKeuangan(transaksi);
          if (keuanganSync.success && keuanganSync.syncedItems.length > 0) {
            console.log(`Comprehensive sync: Jasa component synced to Keuangan - ${keuanganSync.syncedItems.length} items created`);
          }
        }
      }
      break;
      
    case "Penarikan":
      journalEntry = createPenarikanJournalEntry(transaksi);
      break;
      
    default:
      console.warn(`Unknown transaction type: ${transaksi.jenis}`);
      break;
  }
  
  // Refresh financial calculations after accounting sync to maintain consistency
  if (journalEntry && transaksi.anggotaId) {
    refreshFinancialCalculations(transaksi.anggotaId);
    console.log(`Financial calculations refreshed for member ${transaksi.anggotaId} after comprehensive sync`);
  }
  
  return journalEntry;
}

/**
 * Batch sync all existing transactions to accounting with comprehensive sync
 */
export function batchSyncTransactionsToAccounting(): { success: number; failed: number } {
  const allTransaksi = getAllTransaksi();
  let success = 0;
  let failed = 0;
  const affectedMembers = new Set<string>();
  
  allTransaksi.forEach(transaksi => {
    if (transaksi.status === "Sukses") {
      const result = syncTransactionToAccounting(transaksi);
      if (result) {
        success++;
        affectedMembers.add(transaksi.anggotaId);
        
        // Additional comprehensive sync for specific transaction types
        const keuanganSync = syncTransactionToKeuangan(transaksi);
        if (!keuanganSync.success) {
          console.warn(`Keuangan sync failed for transaction ${transaksi.id}:`, keuanganSync.errors);
        }
      } else {
        failed++;
      }
    }
  });
  
  // Refresh calculations for all affected members
  affectedMembers.forEach(anggotaId => {
    refreshFinancialCalculations(anggotaId);
  });
  
  console.log(`Comprehensive batch sync completed: ${success} success, ${failed} failed. Refreshed calculations for ${affectedMembers.size} members.`);
  return { success, failed };
}
