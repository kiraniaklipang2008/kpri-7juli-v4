
// Enhanced implementation for syncing transactions to accounting with SAK ETAP compliance
export interface SyncResult {
  success: number;
  failed: number;
}

// Import the actual sync function from syncOperationsService
import { 
  syncTransactionToAccounting as syncTransaction,
  batchSyncTransactionsToAccounting as batchSync
} from "./syncOperationsService";

// Import SAK ETAP functions
import { batchSyncToSAKETAP, validateTransactionSync } from "./sakEtapSync";
import { validateSAKETAPCompliance } from "./sakEtapCore";

/**
 * Batch sync transactions with SAK ETAP compliance
 */
export const batchSyncTransactionsToAccounting = (): SyncResult => {
  console.log("Starting SAK ETAP compliant batch sync...");
  
  // Use the new SAK ETAP sync
  const result = batchSyncToSAKETAP();
  
  // Validate compliance after sync
  const compliance = validateSAKETAPCompliance();
  const syncValidation = validateTransactionSync();
  
  console.log(`SAK ETAP Sync Results:`, {
    processed: result.totalProcessed,
    successful: result.successful,
    failed: result.failed,
    complianceScore: compliance.complianceScore,
    syncPercentage: syncValidation.syncPercentage
  });
  
  return {
    success: result.successful,
    failed: result.failed
  };
};

/**
 * Sync single transaction with SAK ETAP compliance
 */
export const syncTransactionToAccounting = (transaksi: any): any => {
  console.log(`Syncing transaction ${transaksi.id} with SAK ETAP compliance...`);
  return syncTransaction(transaksi);
};

// Re-export allocation function from the dedicated service
export { calculateAngsuranAllocation, type AngsuranAllocation } from "./allocationService";

// Export SAK ETAP functions for easy access
export { 
  validateSAKETAPCompliance,
  getSAKETAPDashboard,
  initializeSAKETAP,
  generateSAKETAPBalanceSheet,
  generateSAKETAPIncomeStatement
} from "./sakEtapService";
