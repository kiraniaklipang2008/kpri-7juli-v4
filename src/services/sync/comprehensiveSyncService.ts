
import { Transaksi } from "@/types";
import { createPemasukanPengeluaran, getAllPemasukanPengeluaran } from "@/services/keuangan";
import { calculateAngsuranAllocation } from "@/services/akuntansi/allocationService";
import { getAllTransaksi } from "@/services/transaksiService";

export interface SyncResult {
  success: boolean;
  syncedItems: Array<{
    type: string;
    id: string;
    amount: number;
    target: string;
  }>;
  errors: string[];
}

/**
 * Sync transaction to keuangan based on transaction type and allocation
 */
export function syncTransactionToKeuangan(transaksi: Transaksi): SyncResult {
  const result: SyncResult = {
    success: true,
    syncedItems: [],
    errors: []
  };

  if (transaksi.status !== "Sukses") {
    return result; // No sync for non-successful transactions
  }

  try {
    switch (transaksi.jenis) {
      case "Angsuran":
        return syncAngsuranToKeuangan(transaksi);
      
      case "Simpan":
        return syncSimpananToKeuangan(transaksi);
      
      case "Pinjam":
        // Loan sync is handled by auto deduction service
        return result;
      
      case "Penarikan":
        return syncPenarikanToKeuangan(transaksi);
      
      default:
        result.errors.push(`Unknown transaction type: ${transaksi.jenis}`);
        result.success = false;
        return result;
    }
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Unknown sync error');
    return result;
  }
}

/**
 * Sync Angsuran transaction with proper jasa allocation
 */
function syncAngsuranToKeuangan(transaksi: Transaksi): SyncResult {
  const result: SyncResult = {
    success: true,
    syncedItems: [],
    errors: []
  };

  try {
    // Find the related loan for proper allocation
    const loanId = extractLoanIdFromKeterangan(transaksi.keterangan || "");
    
    if (loanId) {
      const allTransaksi = getAllTransaksi();
      const pinjaman = allTransaksi.find(t => t.id === loanId && t.jenis === "Pinjam");
      
      if (pinjaman) {
        const allocation = calculateAngsuranAllocation(pinjaman, transaksi.jumlah, transaksi.anggotaId);
        
        // Sync Jasa component to Keuangan as Pendapatan Jasa income
        if (allocation.nominalJasa > 0) {
          const jasaIncome = createPemasukanPengeluaran({
            tanggal: transaksi.tanggal,
            kategori: "Pendapatan Jasa",
            jumlah: allocation.nominalJasa,
            keterangan: `Pendapatan jasa dari angsuran ${transaksi.anggotaNama} - Rate ${allocation.sukuBungaPersen.toFixed(2)}% (Auto-sync dari ${transaksi.id})`,
            jenis: "Pemasukan",
            createdBy: "system_auto_sync"
          });

          result.syncedItems.push({
            type: 'angsuran_jasa',
            id: jasaIncome.id,
            amount: allocation.nominalJasa,
            target: 'keuangan_pemasukan'
          });
        }

        console.log(`Angsuran sync completed: Jasa ${allocation.nominalJasa} synced to Keuangan, Pokok ${allocation.nominalPokok} handled by accounting`);
      }
    }
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Angsuran sync error');
  }

  return result;
}

/**
 * Sync Simpanan transaction to appropriate categories
 */
function syncSimpananToKeuangan(transaksi: Transaksi): SyncResult {
  const result: SyncResult = {
    success: true,
    syncedItems: [],
    errors: []
  };

  // Simpanan transactions are primarily handled by accounting
  // No additional keuangan sync needed for basic simpanan
  console.log(`Simpanan ${transaksi.id} handled by accounting system`);
  
  return result;
}

/**
 * Sync Penarikan transaction
 */
function syncPenarikanToKeuangan(transaksi: Transaksi): SyncResult {
  const result: SyncResult = {
    success: true,
    syncedItems: [],
    errors: []
  };

  // Penarikan transactions are primarily handled by accounting
  // No additional keuangan sync needed for basic penarikan
  console.log(`Penarikan ${transaksi.id} handled by accounting system`);
  
  return result;
}

/**
 * Sync all pengeluaran transactions to Biaya Operasional in accounting
 */
export function syncPengeluaranToAccounting(): SyncResult {
  const result: SyncResult = {
    success: true,
    syncedItems: [],
    errors: []
  };

  try {
    const allPengeluaran = getAllPemasukanPengeluaran().filter(t => t.jenis === "Pengeluaran");
    
    console.log(`Found ${allPengeluaran.length} pengeluaran transactions for accounting sync`);
    
    // Note: The actual accounting sync is handled by the existing keuangan-accounting sync service
    // This function validates and tracks the sync requirements
    
    allPengeluaran.forEach(pengeluaran => {
      result.syncedItems.push({
        type: 'pengeluaran',
        id: pengeluaran.id,
        amount: pengeluaran.jumlah,
        target: 'accounting_biaya_operasional'
      });
    });

  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Pengeluaran sync error');
  }

  return result;
}

/**
 * Extract loan ID from keterangan string
 */
function extractLoanIdFromKeterangan(keterangan: string): string | null {
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
 * Batch sync all transactions
 */
export function batchSyncAllTransactions(): {
  transaksiSync: SyncResult;
  pengeluaranSync: SyncResult;
} {
  const allTransaksi = getAllTransaksi().filter(t => t.status === "Sukses");
  
  const transaksiSync: SyncResult = {
    success: true,
    syncedItems: [],
    errors: []
  };

  // Sync all successful transactions
  allTransaksi.forEach(transaksi => {
    const syncResult = syncTransactionToKeuangan(transaksi);
    transaksiSync.syncedItems.push(...syncResult.syncedItems);
    transaksiSync.errors.push(...syncResult.errors);
    
    if (!syncResult.success) {
      transaksiSync.success = false;
    }
  });

  // Sync all pengeluaran to accounting
  const pengeluaranSync = syncPengeluaranToAccounting();

  console.log(`Comprehensive sync completed: ${transaksiSync.syncedItems.length} transaction items, ${pengeluaranSync.syncedItems.length} expense items`);

  return {
    transaksiSync,
    pengeluaranSync
  };
}
