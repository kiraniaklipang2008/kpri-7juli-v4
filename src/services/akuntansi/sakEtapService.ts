
import { JurnalEntry } from "@/types/akuntansi";
import { createSHUDistributionEntry } from "./journalCreationService";
import { validateSAKETAPCompliance, getSAKETAPSyncStatus, syncAllToSAKETAP, getSAKETAPPrinciples } from "./sakEtapCore";
import { generateSAKETAPBalanceSheet, generateSAKETAPIncomeStatement, generateSAKETAPComplianceReport } from "./sakEtapReporting";
import { batchSyncToSAKETAP, validateTransactionSync, getSyncStatusByType } from "./sakEtapSync";

// Re-export core functionality
export { 
  validateSAKETAPCompliance, 
  getSAKETAPSyncStatus, 
  syncAllToSAKETAP,
  getSAKETAPPrinciples
} from "./sakEtapCore";

export { 
  generateSAKETAPBalanceSheet, 
  generateSAKETAPIncomeStatement, 
  generateSAKETAPComplianceReport 
} from "./sakEtapReporting";

export { 
  batchSyncToSAKETAP, 
  validateTransactionSync, 
  getSyncStatusByType 
} from "./sakEtapSync";

/**
 * SAK ETAP Compliance Service
 * Main interface for SAK ETAP accounting operations
 */

export interface SHUDistributionData {
  totalSHU: number;
  jasaModal: number;
  jasaUsaha: number;
  distribusiRAT: {
    cadanganUmum: number;
    jasaAnggota: number;
    pengurus: number;
    karyawan: number;
    pendidikan: number;
    sosial: number;
  };
}

/**
 * Create SHU distribution entry following SAK ETAP guidelines
 */
export function distributeSHUBasedOnRAT(
  distributionData: SHUDistributionData,
  tanggal: string,
  ketRAT: string = "Keputusan RAT"
): JurnalEntry | null {
  console.log("Creating SHU distribution following SAK ETAP guidelines...");
  
  return createSHUDistributionEntry(
    distributionData.totalSHU,
    distributionData.jasaModal,
    distributionData.jasaUsaha,
    tanggal,
    `${ketRAT} - Jasa Modal: ${distributionData.jasaModal.toLocaleString('id-ID')}, Jasa Usaha: ${distributionData.jasaUsaha.toLocaleString('id-ID')}`
  );
}

/**
 * Get comprehensive SAK ETAP status dashboard
 */
export function getSAKETAPDashboard() {
  const compliance = validateSAKETAPCompliance();
  const syncStatus = getSAKETAPSyncStatus();
  const transactionSync = validateTransactionSync();
  const syncByType = getSyncStatusByType();
  
  return {
    compliance: {
      isCompliant: compliance.isCompliant,
      score: compliance.complianceScore,
      violationCount: compliance.violations.length,
      recommendationCount: compliance.recommendations.length
    },
    synchronization: {
      totalTransactions: syncStatus.totalTransactions,
      syncedTransactions: syncStatus.syncedTransactions,
      syncPercentage: transactionSync.syncPercentage,
      isFullySynced: transactionSync.isFullySynced
    },
    byTransactionType: syncByType,
    lastUpdate: new Date().toISOString()
  };
}

/**
 * Perform complete SAK ETAP setup and sync
 */
export function initializeSAKETAP(): {
  success: boolean;
  message: string;
  details: any;
} {
  try {
    console.log("Initializing SAK ETAP accounting system...");
    
    // Step 1: Sync all transactions
    const syncResult = batchSyncToSAKETAP();
    
    // Step 2: Validate compliance
    const compliance = validateSAKETAPCompliance();
    
    // Step 3: Get dashboard status
    const dashboard = getSAKETAPDashboard();
    
    const success = syncResult.successful > 0 && compliance.complianceScore >= 80;
    
    return {
      success,
      message: success ? 
        "SAK ETAP sistem berhasil diinisialisasi" : 
        "SAK ETAP sistem diinisialisasi dengan peringatan",
      details: {
        syncResult,
        compliance,
        dashboard
      }
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal menginisialisasi SAK ETAP sistem",
      details: { error: error instanceof Error ? error.message : "Unknown error" }
    };
  }
}
