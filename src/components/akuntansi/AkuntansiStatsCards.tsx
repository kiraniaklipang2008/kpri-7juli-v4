
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank, 
  CreditCard, 
  Calculator,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useToast } from "@/components/ui/use-toast";
import { calculateAggregateFinancialData } from "@/services/realTimeCalculationService";
import { getAllJurnalEntries } from "@/services/akuntansi/jurnalService";
import { batchSyncTransactionsToAccounting } from "@/services/akuntansi/accountingSyncService";

export default function AkuntansiStatsCards() {
  const { toast } = useToast();
  const [financialData, setFinancialData] = useState({
    totalSimpanan: 0,
    totalPinjaman: 0,
    totalAngsuran: 0,
    sisaPinjaman: 0,
    totalPenarikan: 0
  });
  const [accountingData, setAccountingData] = useState({
    totalJurnalEntries: 0,
    totalDebit: 0,
    totalKredit: 0,
    lastSyncTime: null as string | null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load financial and accounting data
  const loadData = () => {
    // Get real-time financial data
    const realTimeData = calculateAggregateFinancialData();
    setFinancialData(realTimeData);

    // Get accounting data
    const jurnalEntries = getAllJurnalEntries();
    const totalDebit = jurnalEntries.reduce((sum, entry) => sum + entry.totalDebit, 0);
    const totalKredit = jurnalEntries.reduce((sum, entry) => sum + entry.totalKredit, 0);
    
    setAccountingData({
      totalJurnalEntries: jurnalEntries.length,
      totalDebit,
      totalKredit,
      lastSyncTime: localStorage.getItem('last_accounting_sync') || null
    });
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      loadData();
      toast({
        title: "Data berhasil diperbarui",
        description: "Semua data akuntansi telah disinkronkan",
      });
    } catch (error) {
      toast({
        title: "Gagal memperbarui data",
        description: "Terjadi kesalahan saat memperbarui data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle batch sync with transactions
  const handleBatchSync = async () => {
    setIsSyncing(true);
    try {
      const result = batchSyncTransactionsToAccounting();
      localStorage.setItem('last_accounting_sync', new Date().toISOString());
      
      toast({
        title: "Sinkronisasi berhasil",
        description: `${result.success} transaksi berhasil disinkronkan, ${result.failed} gagal`,
      });
      
      loadData(); // Refresh data after sync
    } catch (error) {
      toast({
        title: "Gagal melakukan sinkronisasi",
        description: "Terjadi kesalahan saat sinkronisasi dengan transaksi",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const statsCards = [
    {
      title: "Total Simpanan",
      value: financialData.totalSimpanan,
      icon: PiggyBank,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Saldo simpanan anggota",
      trend: financialData.totalSimpanan > 0 ? "up" : "neutral"
    },
    {
      title: "Sisa Pinjaman",
      value: financialData.sisaPinjaman,
      icon: CreditCard,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Outstanding loan balance",
      trend: financialData.sisaPinjaman > 0 ? "down" : "up"
    },
    {
      title: "Total Angsuran",
      value: financialData.totalAngsuran,
      icon: Calculator,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Pembayaran angsuran terkumpul",
      trend: financialData.totalAngsuran > 0 ? "up" : "neutral"
    },
    {
      title: "Total Debit",
      value: accountingData.totalDebit,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Total debit dalam jurnal",
      trend: "up"
    },
    {
      title: "Total Kredit",
      value: accountingData.totalKredit,
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Total kredit dalam jurnal",
      trend: "up"
    },
    {
      title: "Jurnal Entries",
      value: accountingData.totalJurnalEntries,
      icon: DollarSign,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Total entri jurnal",
      trend: "neutral",
      isCount: true
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ringkasan Keuangan</h2>
          <p className="text-muted-foreground">
            Data real-time dari sistem transaksi dan akuntansi
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleBatchSync}
            disabled={isSyncing}
            className="gap-2"
          >
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Sync Transaksi
          </Button>
        </div>
      </div>

      {/* Sync status indicator */}
      {accountingData.lastSyncTime && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>
            Terakhir disinkronkan: {new Date(accountingData.lastSyncTime).toLocaleString('id-ID')}
          </span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : null;
          
          return (
            <Card key={stat.title} className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {stat.isCount ? stat.value.toLocaleString('id-ID') : formatCurrency(stat.value)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  {TrendIcon && (
                    <Badge variant="secondary" className="gap-1">
                      <TrendIcon className="h-3 w-3" />
                      <span className="text-xs">
                        {stat.trend === 'up' ? 'Naik' : 'Turun'}
                      </span>
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Balance verification card */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Verifikasi Neraca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Debit</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(accountingData.totalDebit)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Kredit</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(accountingData.totalKredit)}
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            {accountingData.totalDebit === accountingData.totalKredit ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Neraca Seimbang
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Neraca Tidak Seimbang
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              Selisih: {formatCurrency(Math.abs(accountingData.totalDebit - accountingData.totalKredit))}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
