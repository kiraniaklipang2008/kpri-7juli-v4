
import { Transaksi } from "@/types";
import { syncTransactionToAccounting } from "../akuntansi/accountingSyncService";
import { 
  handleAccountingSyncSuccess, 
  handleAccountingSyncError,
  handleTransactionUpdateSyncSuccess,
  handleTransactionUpdateSyncError
} from "./notificationOperations";

/**
 * Handle accounting sync for a new transaction
 */
export function handleAccountingSync(transaksi: Transaksi): void {
  if (transaksi.status !== "Sukses") return;

  try {
    const journalEntry = syncTransactionToAccounting(transaksi);
    if (journalEntry) {
      console.log(`Transaction ${transaksi.id} automatically synced to accounting (Journal: ${journalEntry.nomorJurnal})`);
      handleAccountingSyncSuccess(transaksi, journalEntry.nomorJurnal);
    }
  } catch (syncError) {
    console.error("Failed to sync transaction to accounting:", syncError);
    handleAccountingSyncError(transaksi);
  }
}

/**
 * Handle accounting sync for an updated transaction
 */
export function handleUpdateAccountingSync(transaksi: Transaksi): void {
  if (transaksi.status !== "Sukses") return;

  try {
    const journalEntry = syncTransactionToAccounting(transaksi);
    if (journalEntry) {
      console.log(`Updated transaction ${transaksi.id} synced to accounting (Journal: ${journalEntry.nomorJurnal})`);
      handleTransactionUpdateSyncSuccess(transaksi, journalEntry.nomorJurnal);
    }
  } catch (syncError) {
    console.error("Failed to sync updated transaction to accounting:", syncError);
    handleTransactionUpdateSyncError(transaksi);
  }
}
