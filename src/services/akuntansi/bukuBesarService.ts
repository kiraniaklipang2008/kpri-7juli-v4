
import { BukuBesar, BukuBesarDetail } from "@/types/akuntansi";
import { getChartOfAccountById } from "./coaService";
import { getAllJurnalEntries } from "./jurnalService";

export const generateBukuBesar = (coaId: string, periode: string): BukuBesar => {
  const coa = getChartOfAccountById(coaId);
  if (!coa) {
    throw new Error("Chart of Account tidak ditemukan");
  }

  const [year, month] = periode.split('-');
  const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  const endDate = new Date(parseInt(year), parseInt(month), 0);

  // Get all journal entries for the period
  const journals = getAllJurnalEntries().filter(journal => 
    journal.status === 'POSTED' &&
    new Date(journal.tanggal) >= startDate &&
    new Date(journal.tanggal) <= endDate
  );

  // Extract transactions for this account
  const transaksi: BukuBesarDetail[] = [];
  let runningBalance = 0; // This should come from previous period closing balance

  journals.forEach(journal => {
    journal.details?.forEach(detail => {
      if (detail.coaId === coaId) {
        const debit = detail.debit || 0;
        const kredit = detail.kredit || 0;
        
        // Calculate running balance based on account normal balance
        if (coa.saldoNormal === 'DEBIT') {
          runningBalance += debit - kredit;
        } else {
          runningBalance += kredit - debit;
        }

        transaksi.push({
          tanggal: journal.tanggal,
          nomorJurnal: journal.nomorJurnal,
          keterangan: detail.keterangan || journal.deskripsi,
          debit,
          kredit,
          saldo: runningBalance
        });
      }
    });
  });

  // Sort by date
  transaksi.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  const totalDebit = transaksi.reduce((sum, t) => sum + t.debit, 0);
  const totalKredit = transaksi.reduce((sum, t) => sum + t.kredit, 0);
  const saldoAwal = 0; // This should come from previous period
  const saldoAkhir = runningBalance;

  return {
    coaId,
    coa,
    periode,
    saldoAwal,
    totalDebit,
    totalKredit,
    saldoAkhir,
    transaksi
  };
};

export const getBukuBesarByPeriode = (periode: string): BukuBesar[] => {
  // Implementation for getting all account ledgers for a period
  // This would be used for trial balance generation
  return [];
};
