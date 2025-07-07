
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  RotateCcw,
  Calculator,
  Database
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { resetAllTransactionNominals } from "@/services/resetDataService";

export function ResetDataSettings() {
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  const handleResetNominalData = async () => {
    setIsResetting(true);
    try {
      const result = resetAllTransactionNominals();
      
      toast({
        title: "Reset Data Berhasil",
        description: `${result.transactionCount} transaksi telah direset ke nominal 0. Data lainnya tetap utuh.`,
      });
      
      // Refresh page after short delay to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error resetting nominal data:", error);
      toast({
        title: "Error",
        description: "Gagal melakukan reset data nominal.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Reset Transaction Nominals */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <Calculator className="h-5 w-5" />
            Reset Data Nominal Transaksi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <strong>Fungsi Reset Data Nominal:</strong> Mengembalikan semua nilai nominal 
              transaksi (simpan, pinjam, angsuran) menjadi 0, namun tetap mempertahankan 
              data anggota, tanggal, dan informasi transaksi lainnya.
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Yang akan direset:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Nominal semua transaksi simpanan</li>
              <li>• Nominal semua transaksi pinjaman</li>
              <li>• Nominal semua pembayaran angsuran</li>
              <li>• Cache kalkulasi keuangan</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Yang tetap dipertahankan:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Data anggota dan informasi pribadi</li>
              <li>• Tanggal dan waktu transaksi</li>
              <li>• Kategori dan jenis transaksi</li>
              <li>• Keterangan dan status transaksi</li>
            </ul>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                disabled={isResetting}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Data Nominal
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  Konfirmasi Reset Data Nominal
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>Apakah Anda yakin ingin mereset semua nominal transaksi?</strong>
                  <br /><br />
                  Tindakan ini akan:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Mengubah semua nominal transaksi menjadi 0</li>
                    <li>Mereset total simpanan, pinjaman, dan angsuran</li>
                    <li>Membersihkan cache kalkulasi keuangan</li>
                  </ul>
                  <br />
                  <strong>Data anggota dan informasi transaksi lainnya akan tetap aman.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleResetNominalData}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Ya, Reset Data Nominal
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Database className="h-5 w-5" />
            Informasi Reset Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Fungsi reset data nominal ini berguna untuk:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Memulai perhitungan keuangan dari nol</li>
            <li>• Testing dan development aplikasi</li>
            <li>• Koreksi data setelah migrasi sistem</li>
            <li>• Pembersihan data untuk periode baru</li>
          </ul>
          <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
            <strong>Tips:</strong> Pastikan Anda telah membuat backup data sebelum melakukan reset.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
