import { Transaksi } from "@/types";
import { saveToLocalStorage } from "@/utils/localStorage";
import { getAnggotaById } from "../anggotaService";
import { refreshFinancialCalculations } from "../realTimeCalculationService";
import { logAuditEntry } from "../auditService";
import { syncTransactionToKeuangan } from "../sync/comprehensiveSyncService";
import { 
  getAllTransaksi, 
  createTransaksi as createTransaksiCore,
} from "./transaksiCore";
import { 
  handleTransactionCreateSuccess,
  handleTransactionPending,
  handleTransactionError,
  handleTransactionUpdateSuccess,
  handleMemberNotFound,
  handleTransactionNotFound,
  handleTransactionDeleteSuccess,
  handleTransactionDeleteNotFound,
  handleDataResetSuccess
} from "./notificationOperations";
import { handleAccountingSync, handleUpdateAccountingSync } from "./syncOperations";
import { initialTransaksi } from "./initialData";
import { calculateAutoDeductions, processAutoDeductions } from "./autoDeductionService";

const TRANSAKSI_KEY = "koperasi_transaksi";

/**
 * Enhanced create transaksi with comprehensive sync and automatic deductions
 */
export function createTransaksi(data: Partial<Transaksi>): Transaksi | null {
  try {
    // Create the transaction using core service
    const newTransaksi = createTransaksiCore(data);
    
    if (newTransaksi && newTransaksi.status === "Sukses") {
      handleTransactionCreateSuccess(newTransaksi);
      
      // Comprehensive sync: Accounting + Keuangan
      handleAccountingSync(newTransaksi);
      
      // Additional Keuangan sync for comprehensive coverage
      const keuanganSync = syncTransactionToKeuangan(newTransaksi);
      if (keuanganSync.success && keuanganSync.syncedItems.length > 0) {
        console.log(`Comprehensive sync completed: ${keuanganSync.syncedItems.length} items synced to Keuangan`);
      }
      
      // Process auto deductions for loan transactions
      if (newTransaksi.jenis === "Pinjam") {
        const deductions = calculateAutoDeductions(newTransaksi.jumlah);
        
        if (deductions.danaResikoKredit?.enabled || deductions.simpananWajibKredit?.enabled) {
          console.log(`Processing auto deductions for loan ${newTransaksi.id}:`, deductions);
          const deductionResult = processAutoDeductions(newTransaksi, deductions);
          
          if (deductionResult.success && deductionResult.createdTransactions.length > 0) {
            console.log(`Auto deductions processed successfully for loan ${newTransaksi.id}. Created ${deductionResult.createdTransactions.length} financial transactions with comprehensive sync.`);
          }
        }
      }
      
      // Log audit entry
      logAuditEntry(
        "CREATE",
        "TRANSAKSI",
        `Membuat transaksi ${newTransaksi.jenis} sebesar Rp ${newTransaksi.jumlah.toLocaleString('id-ID')} untuk anggota ${newTransaksi.anggotaNama} dengan comprehensive sync`,
        newTransaksi.id
      );
      
      // Refresh financial calculations for real-time consistency
      if (newTransaksi.anggotaId) {
        refreshFinancialCalculations(newTransaksi.anggotaId);
      }
    } else if (newTransaksi) {
      handleTransactionPending(newTransaksi);
    }
    
    return newTransaksi;
  } catch (error) {
    console.error("Error creating transaksi:", error);
    handleTransactionError();
    return null;
  }
}

/**
 * Update an existing transaksi with comprehensive sync
 */
export function updateTransaksi(id: string, transaksi: Partial<Transaksi>): Transaksi | null {
  const transaksiList = getAllTransaksi();
  const index = transaksiList.findIndex(t => t.id === id);
  
  if (index === -1) {
    handleTransactionNotFound();
    return null;
  }
  
  const oldTransaksi = transaksiList[index];
  
  // If anggotaId is being updated, we need to update anggotaNama as well
  if (transaksi.anggotaId) {
    const anggota = getAnggotaById(transaksi.anggotaId);
    if (!anggota) {
      handleMemberNotFound();
      return null;
    }
    transaksi.anggotaNama = anggota.nama;
  }
  
  transaksiList[index] = {
    ...transaksiList[index],
    ...transaksi,
    updatedAt: new Date().toISOString(),
  };
  
  saveToLocalStorage(TRANSAKSI_KEY, transaksiList);
  
  handleTransactionUpdateSuccess(transaksiList[index]);
  handleUpdateAccountingSync(transaksiList[index]);
  
  // Comprehensive sync for updated transaction
  const keuanganSync = syncTransactionToKeuangan(transaksiList[index]);
  if (keuanganSync.success) {
    console.log(`Update comprehensive sync completed for transaction ${id}`);
  }
  
  // Log audit entry
  logAuditEntry(
    "UPDATE",
    "TRANSAKSI",
    `Memperbarui transaksi ${oldTransaksi.jenis} dari Rp ${oldTransaksi.jumlah.toLocaleString('id-ID')} menjadi Rp ${transaksiList[index].jumlah.toLocaleString('id-ID')} untuk anggota ${transaksiList[index].anggotaNama} dengan comprehensive sync`,
    id
  );
  
  // Refresh financial calculations for real-time consistency
  if (transaksiList[index].anggotaId) {
    refreshFinancialCalculations(transaksiList[index].anggotaId);
  }
  
  return transaksiList[index];
}

/**
 * Delete a transaksi by ID with real-time sync
 */
export function deleteTransaksi(id: string): boolean {
  const transaksiList = getAllTransaksi();
  const transaksiToDelete = transaksiList.find(t => t.id === id);
  const filteredList = transaksiList.filter(transaksi => transaksi.id !== id);
  
  if (filteredList.length === transaksiList.length) {
    handleTransactionDeleteNotFound();
    return false;
  }
  
  saveToLocalStorage(TRANSAKSI_KEY, filteredList);
  
  if (transaksiToDelete) {
    handleTransactionDeleteSuccess(transaksiToDelete);
    
    // Log audit entry
    logAuditEntry(
      "DELETE",
      "TRANSAKSI",
      `Menghapus transaksi ${transaksiToDelete.jenis} sebesar Rp ${transaksiToDelete.jumlah.toLocaleString('id-ID')} untuk anggota ${transaksiToDelete.anggotaNama}`,
      id
    );
    
    // Refresh financial calculations for affected member
    if (transaksiToDelete.anggotaId) {
      refreshFinancialCalculations(transaksiToDelete.anggotaId);
    }
  }
  
  return true;
}

/**
 * Reset transaksi data to initial state and return the reset data
 */
export function resetTransaksiData(): Transaksi[] {
  saveToLocalStorage(TRANSAKSI_KEY, initialTransaksi);
  handleDataResetSuccess();
  
  // Log audit entry
  logAuditEntry(
    "DELETE",
    "SYSTEM",
    "Mereset semua data transaksi ke kondisi awal"
  );
  
  return initialTransaksi;
}
