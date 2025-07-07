
import { ChartOfAccount, BukuBesar } from "@/types/akuntansi";
import { getAllChartOfAccounts, getChartOfAccountById } from "./coaService";
import { generateBukuBesar } from "./bukuBesarService";

// Re-export functions from coaService
export { 
  getAllChartOfAccounts, 
  getChartOfAccountById,
  createChartOfAccount,
  updateChartOfAccount,
  deleteChartOfAccount
} from "./coaService";

// Buku Besar functions
export const getBukuBesarByAccount = (coaId: string, periode: string): BukuBesar => {
  return generateBukuBesar(coaId, periode);
};
