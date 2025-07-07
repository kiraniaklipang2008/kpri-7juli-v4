
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Printer, ArrowLeft, Filter } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { addMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { KeuanganStatsCards } from '@/components/keuangan/laporan/KeuanganStatsCards';
import { KeuanganCharts } from '@/components/keuangan/laporan/KeuanganCharts';
import { KeuanganDataTable } from '@/components/keuangan/laporan/KeuanganDataTable';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { getPemasukanPengeluaranByPeriod } from '@/services/keuangan';
import { PemasukanPengeluaran } from '@/types';
import { toast } from 'sonner';
import { useKeuanganSync } from '@/hooks/useKeuanganSync';

export default function LaporanPage() {
  const navigate = useNavigate();
  const { data: allTransactions, isLoading: dataLoading } = useKeuanganSync();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [filteredData, setFilteredData] = useState<PemasukanPengeluaran[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter data when allTransactions or dateRange changes
  useEffect(() => {
    filterData();
  }, [allTransactions, dateRange]);

  const filterData = () => {
    try {
      setLoading(true);
      
      let data = [...allTransactions];
      
      if (dateRange?.from && dateRange?.to) {
        const startDate = dateRange.from.toISOString().split('T')[0];
        const endDate = dateRange.to.toISOString().split('T')[0];
        data = getPemasukanPengeluaranByPeriod(startDate, endDate);
      } else {
        // Default to current month if no date range selected
        const today = new Date();
        const startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        data = getPemasukanPengeluaranByPeriod(startDate, endDate);
      }
      
      // Sort by date descending
      data.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      setFilteredData(data);
      
    } catch (error) {
      console.error('Error filtering data:', error);
      toast.error('Gagal memuat data laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Simple export functionality - in real app this would generate Excel/PDF
    const dataStr = JSON.stringify(filteredData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-transaksi-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data berhasil diexport');
  };

  const handlePrint = () => {
    window.print();
  };

  const getPeriodText = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'dd MMM yyyy', { locale: id })} - ${format(dateRange.to, 'dd MMM yyyy', { locale: id })}`;
    }
    return 'Bulan ini';
  };

  const setQuickPeriod = (period: 'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear') => {
    const today = new Date();
    let from: Date, to: Date;

    switch (period) {
      case 'thisMonth':
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case 'lastMonth':
        from = startOfMonth(addMonths(today, -1));
        to = endOfMonth(addMonths(today, -1));
        break;
      case 'last3Months':
        from = startOfMonth(addMonths(today, -3));
        to = endOfMonth(today);
        break;
      case 'thisYear':
        from = new Date(today.getFullYear(), 0, 1);
        to = new Date(today.getFullYear(), 11, 31);
        break;
    }

    setDateRange({ from, to });
  };

  // Show loading state while initial data is loading
  const isLoading = dataLoading || loading;

  return (
    <Layout pageTitle="Laporan Arus Kas">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/keuangan/transaksi')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Laporan Arus Kas</h1>
              <p className="text-muted-foreground">Data pemasukan dan pengeluaran keuangan (Real-time)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Modern Filter Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filter Periode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Rentang Tanggal</label>
                <DateRangePicker
                  value={dateRange}
                  onValueChange={setDateRange}
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setQuickPeriod('thisMonth')}>
                  Bulan Ini
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuickPeriod('lastMonth')}>
                  Bulan Lalu
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuickPeriod('last3Months')}>
                  3 Bulan Terakhir
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuickPeriod('thisYear')}>
                  Tahun Ini
                </Button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Periode yang dipilih: <span className="font-medium">{getPeriodText()}</span>
                {!isLoading && (
                  <span className="ml-2 text-green-600">• Data tersinkronisasi</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <KeuanganStatsCards data={filteredData} loading={isLoading} />

        {/* Charts Section */}
        <KeuanganCharts data={filteredData} loading={isLoading} />

        {/* Data Table */}
        <KeuanganDataTable data={filteredData} loading={isLoading} />

        {/* Summary Footer */}
        {!isLoading && filteredData.length > 0 && (
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                Menampilkan {filteredData.length} transaksi untuk periode {getPeriodText()}
                <br />
                <span className="text-green-600">Data disinkronisasi secara real-time dengan transaksi keuangan</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
