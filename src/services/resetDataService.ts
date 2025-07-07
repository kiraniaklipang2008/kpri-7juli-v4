import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { Transaksi } from "@/types";

/**
 * Reset all transaction nominal data to zero while keeping other data intact
 */
export function resetTransactionNominalData(): number {
  const TRANSAKSI_KEY = "koperasi_transaksi";
  
  // Get current transactions
  const currentTransaksi = getFromLocalStorage<Transaksi[]>(TRANSAKSI_KEY, []);
  
  // Reset only nominal amounts, keep all other data
  const resetTransaksi = currentTransaksi.map(transaksi => ({
    ...transaksi,
    jumlah: 0, // Reset nominal amount to 0
    updatedAt: new Date().toISOString()
  }));
  
  // Save updated transactions
  saveToLocalStorage(TRANSAKSI_KEY, resetTransaksi);
  
  console.log(`Reset nominal data for ${resetTransaksi.length} transactions`);
  return resetTransaksi.length;
}

/**
 * Reset financial summary data (if stored separately)
 */
export function resetFinancialSummaryData(): void {
  // Clear any cached financial calculations
  const financialKeys = [
    'koperasi_financial_cache',
    'koperasi_shu_cache',
    'last_accounting_sync'
  ];
  
  financialKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log("Financial summary data cleared");
}

/**
 * Complete reset of all transaction nominal data
 */
export function resetAllTransactionNominals(): { transactionCount: number } {
  const transactionCount = resetTransactionNominalData();
  resetFinancialSummaryData();
  
  return { transactionCount };
}
