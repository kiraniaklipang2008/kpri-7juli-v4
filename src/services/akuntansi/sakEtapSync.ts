
import { Transaksi } from "@/types";
import { JurnalEntry } from "@/types/akuntansi";
import { getAllTransaksi } from "@/services/transaksiService";
import { getAllJurnalEntries } from "./jurnalService";
import { syncTransactionToAccounting } from "./syncOperationsService";

export interface SyncResult {
  transactionId: string;
  success: boolean;
  journalId?: string;
  error?: string;
}

export interface BatchSyncResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  results: SyncResult[];
  summary: string;
}

/**
 * Check if a transaction is already synced to accounting
 */
export function isTransactionSynced(transactionId: string): boolean {
  const journals = getAllJurnalEntries();
  return journals.some(journal => 
    journal.referensi === `TXN-${transactionId}` && 
    journal.createdBy === 'system_auto_sync'
  );
}

/**
 * Get all unsynced transactions
 */
export function getUnsyncedTransactions(): Transaksi[] {
  const transactions = getAllTransaksi().filter(t => t.status === "Sukses");
  return transactions.filter(t => !isTransactionSynced(t.id));
}

/**
 * Sync a single transaction to accounting following SAK ETAP
 */
export function syncSingleTransaction(transaction: Transaksi): SyncResult {
  try {
    // Check if already synced
    if (isTransactionSynced(transaction.id)) {
      return {
        transactionId: transaction.id,
        success: true,
        error: "Already synced"
      };
    }

    const journalEntry = syncTransactionToAccounting(transaction);
    
    if (journalEntry) {
      return {
        transactionId: transaction.id,
        success: true,
        journalId: journalEntry.id
      };
    } else {
      return {
        transactionId: transaction.id,
        success: false,
        error: "Failed to create journal entry"
      };
    }
  } catch (error) {
    return {
      transactionId: transaction.id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Batch sync all unsynced transactions
 */
export function batchSyncToSAKETAP(): BatchSyncResult {
  const unsyncedTransactions = getUnsyncedTransactions();
  const results: SyncResult[] = [];
  
  console.log(`Starting SAK ETAP batch sync for ${unsyncedTransactions.length} transactions...`);
  
  unsyncedTransactions.forEach(transaction => {
    const result = syncSingleTransaction(transaction);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ SAK ETAP: Synced ${transaction.jenis} transaction ${transaction.id}`);
    } else {
      console.error(`❌ SAK ETAP: Failed to sync transaction ${transaction.id}: ${result.error}`);
    }
  });
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  const summary = `SAK ETAP Sync Complete: ${successful} successful, ${failed} failed out of ${results.length} transactions`;
  
  return {
    totalProcessed: results.length,
    successful,
    failed,
    results,
    summary
  };
}

/**
 * Validate that all successful transactions are properly synced
 */
export function validateTransactionSync(): {
  isFullySynced: boolean;
  unsyncedCount: number;
  totalTransactions: number;
  syncPercentage: number;
} {
  const allTransactions = getAllTransaksi().filter(t => t.status === "Sukses");
  const unsyncedTransactions = getUnsyncedTransactions();
  
  const syncPercentage = allTransactions.length > 0 
    ? ((allTransactions.length - unsyncedTransactions.length) / allTransactions.length) * 100 
    : 100;
  
  return {
    isFullySynced: unsyncedTransactions.length === 0,
    unsyncedCount: unsyncedTransactions.length,
    totalTransactions: allTransactions.length,
    syncPercentage: Math.round(syncPercentage)
  };
}

/**
 * Get sync status by transaction type
 */
export function getSyncStatusByType(): Record<string, { total: number; synced: number; pending: number }> {
  const allTransactions = getAllTransaksi().filter(t => t.status === "Sukses");
  const unsyncedTransactions = getUnsyncedTransactions();
  
  const status: Record<string, { total: number; synced: number; pending: number }> = {};
  
  const transactionTypes = ["Simpan", "Pinjam", "Angsuran", "Penarikan"];
  
  transactionTypes.forEach(type => {
    const totalOfType = allTransactions.filter(t => t.jenis === type).length;
    const unsyncedOfType = unsyncedTransactions.filter(t => t.jenis === type).length;
    
    status[type] = {
      total: totalOfType,
      synced: totalOfType - unsyncedOfType,
      pending: unsyncedOfType
    };
  });
  
  return status;
}

/**
 * Force re-sync all transactions (for recovery purposes)
 */
export function forceSyncAll(): BatchSyncResult {
  const allTransactions = getAllTransaksi().filter(t => t.status === "Sukses");
  const results: SyncResult[] = [];
  
  console.log(`Force syncing all ${allTransactions.length} transactions to SAK ETAP...`);
  
  allTransactions.forEach(transaction => {
    try {
      // Force sync even if already synced
      const journalEntry = syncTransactionToAccounting(transaction);
      
      results.push({
        transactionId: transaction.id,
        success: !!journalEntry,
        journalId: journalEntry?.id,
        error: journalEntry ? undefined : "Failed to create journal entry"
      });
    } catch (error) {
      results.push({
        transactionId: transaction.id,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  return {
    totalProcessed: results.length,
    successful,
    failed,
    results,
    summary: `Force sync complete: ${successful} successful, ${failed} failed`
  };
}
