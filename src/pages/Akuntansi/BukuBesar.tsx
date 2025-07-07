
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BookOpen, Calendar, TrendingUp, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChartOfAccount, BukuBesar as BukuBesarType } from "@/types/akuntansi";
import { getAllChartOfAccounts } from "@/services/akuntansi/coaService";
import { generateBukuBesar, getBukuBesarByPeriode } from "@/services/akuntansi/bukuBesarService";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function BukuBesar() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });
  const [bukuBesarData, setBukuBesarData] = useState<BukuBesarType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccountId && selectedPeriod) {
      loadBukuBesar();
    }
  }, [selectedAccountId, selectedPeriod]);

  const loadAccounts = () => {
    const data = getAllChartOfAccounts().filter(acc => !acc.isGroup);
    setAccounts(data);
    if (data.length > 0 && !selectedAccountId) {
      setSelectedAccountId(data[0].id);
    }
  };

  const loadBukuBesar = () => {
    if (!selectedAccountId) return;
    
    setIsLoading(true);
    try {
      const data = generateBukuBesar(selectedAccountId, selectedPeriod);
      setBukuBesarData(data);
    } catch (error) {
      console.error("Error loading buku besar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Implementation for export functionality
    console.log("Export buku besar");
  };

  const getPeriodLabel = (period: string) => {
    const [year, month] = period.split('-');
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <Layout pageTitle="Buku Besar">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/akuntansi')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Buku Besar</h1>
              <p className="text-muted-foreground">Lihat detail transaksi per akun dan periode</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filter Buku Besar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Pilih Akun</label>
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih akun..." />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.kode} - {account.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Periode</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - i);
                      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                      return (
                        <SelectItem key={value} value={value}>
                          {getPeriodLabel(value)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {bukuBesarData && (
          <>
            {/* Account Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(bukuBesarData.saldoAwal)}
                  </div>
                  <p className="text-xs text-muted-foreground">Saldo Awal</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(bukuBesarData.totalDebit)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Debit</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(bukuBesarData.totalKredit)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Kredit</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(bukuBesarData.saldoAkhir)}
                  </div>
                  <p className="text-xs text-muted-foreground">Saldo Akhir</p>
                </CardContent>
              </Card>
            </div>

            {/* Buku Besar Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Buku Besar - {bukuBesarData.coa.kode} {bukuBesarData.coa.nama}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Periode: {getPeriodLabel(bukuBesarData.periode)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Tanggal</th>
                        <th className="text-left py-3 px-4">No. Jurnal</th>
                        <th className="text-left py-3 px-4">Keterangan</th>
                        <th className="text-right py-3 px-4">Debit</th>
                        <th className="text-right py-3 px-4">Kredit</th>
                        <th className="text-right py-3 px-4">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-muted/50">
                        <td className="py-3 px-4 font-medium">-</td>
                        <td className="py-3 px-4">-</td>
                        <td className="py-3 px-4 font-medium">Saldo Awal</td>
                        <td className="py-3 px-4 text-right">-</td>
                        <td className="py-3 px-4 text-right">-</td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatCurrency(bukuBesarData.saldoAwal)}
                        </td>
                      </tr>
                      {bukuBesarData.transaksi.map((transaksi, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            {format(new Date(transaksi.tanggal), "dd/MM/yyyy")}
                          </td>
                          <td className="py-3 px-4">{transaksi.nomorJurnal}</td>
                          <td className="py-3 px-4">{transaksi.keterangan}</td>
                          <td className="py-3 px-4 text-right">
                            {transaksi.debit > 0 ? formatCurrency(transaksi.debit) : "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {transaksi.kredit > 0 ? formatCurrency(transaksi.kredit) : "-"}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {formatCurrency(transaksi.saldo)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-b-2 border-black bg-muted/70">
                        <td className="py-3 px-4 font-bold" colSpan={3}>Total</td>
                        <td className="py-3 px-4 text-right font-bold">
                          {formatCurrency(bukuBesarData.totalDebit)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold">
                          {formatCurrency(bukuBesarData.totalKredit)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold">
                          {formatCurrency(bukuBesarData.saldoAkhir)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!bukuBesarData && !isLoading && selectedAccountId && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada data</h3>
              <p className="text-muted-foreground text-center">
                Tidak ada transaksi untuk akun dan periode yang dipilih
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Memuat buku besar...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
