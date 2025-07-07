
import { getAllTransaksi } from "@/services/transaksiService";
import { getAnggotaList } from "@/services/anggotaService";
import { 
  getTotalAllSimpanan 
} from "@/services/transaksi/financialOperations/simpananOperations"; 
import { 
  getTotalAllPinjaman,
  getTotalAllSisaPinjaman
} from "@/services/transaksi/financialOperations/pinjamanOperations";
import { 
  getTotalAllAngsuran 
} from "@/services/transaksi/financialOperations/payments";
import { getAnggotaBaru, getTransaksiCount, getSHUByMonth, getPenjualanByMonth } from "@/utils/dashboardUtils";
import { calculateSHUForSamples } from "@/utils/shuUtils";
import { useMemo } from "react";
import { Transaksi } from "@/types";

export interface DashboardData {
  totalAnggota: number;
  totalSimpanan: number;
  totalPinjaman: number;
  totalSisaPinjaman: number;
  totalAngsuran: number;
  totalPenjualan: number;
  recentTransaksi: Transaksi[];
  allTransaksi: Transaksi[];
  shuDistribution: {
    id: string;
    name: string;
    shu: number;
  }[];
  productivityData: {
    anggotaBaru: {
      current: number;
      previous: number;
    };
    transaksiSimpanan: {
      current: number;
      previous: number;
    };
    transaksiPinjaman: {
      current: number;
      previous: number;
    };
    shuBulanIni: {
      current: number;
      previous: number;
    };
    nilaiPenjualan: {
      current: number;
      previous: number;
    };
  };
}

/**
 * Custom hook to fetch and process all data needed for the dashboard with CONSISTENT calculations
 * @returns All dashboard data in a structured format
 */
export function useDashboardData(): DashboardData {
  // Get transactions and anggota data for charts and statistics
  const allTransaksi = getAllTransaksi();
  const anggotaList = getAnggotaList();
  
  // Calculate various dashboard metrics using useMemo for performance
  return useMemo(() => {
    // Calculate statistics for display with CONSISTENT sisa pinjaman
    const totalAnggota = anggotaList.length;
    const totalSimpanan = getTotalAllSimpanan();
    const totalPinjaman = getTotalAllPinjaman();
    const totalSisaPinjaman = getTotalAllSisaPinjaman(); // CONSISTENT remaining loan calculation
    const totalAngsuran = getTotalAllAngsuran();
    
    console.log(`Dashboard data: totalPinjaman = ${totalPinjaman}, totalSisaPinjaman = ${totalSisaPinjaman}`);
    
    // Estimate total penjualan based on available data (in a real app, this would come from sales data)
    const totalPenjualan = 43750000; // Sample data, would be replaced with actual sales calculation
    
    // Get recent transactions for tabular display
    const recentTransaksi = [...allTransaksi]
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
      .slice(0, 5);
    
    // Calculate SHU distribution for several sample anggota IDs
    const shuDistribution = calculateSHUForSamples();
    
    // Prepare productivity data
    const productivityData = {
      anggotaBaru: {
        current: getAnggotaBaru(anggotaList, 0),
        previous: getAnggotaBaru(anggotaList, 1)
      },
      transaksiSimpanan: {
        current: getTransaksiCount(allTransaksi, "Simpan", 0),
        previous: getTransaksiCount(allTransaksi, "Simpan", 1)
      },
      transaksiPinjaman: {
        current: getTransaksiCount(allTransaksi, "Pinjam", 0),
        previous: getTransaksiCount(allTransaksi, "Pinjam", 1)
      },
      shuBulanIni: {
        current: getSHUByMonth(0),
        previous: getSHUByMonth(1)
      },
      nilaiPenjualan: {
        current: getPenjualanByMonth(0),
        previous: getPenjualanByMonth(1)
      }
    };

    return {
      totalAnggota,
      totalSimpanan,
      totalPinjaman,
      totalSisaPinjaman,
      totalAngsuran,
      totalPenjualan,
      recentTransaksi,
      allTransaksi,
      shuDistribution,
      productivityData
    };
  }, [allTransaksi, anggotaList]);
}
