import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthGuard } from "@/components/auth/AuthGuard";

// Pages
import Index from "@/pages/Index";
import LoginPage from "@/pages/Auth/LoginPage";
import AnggotaLoginPage from "@/pages/Auth/AnggotaLoginPage";
import QuickAccessPage from "@/pages/QuickAccess/QuickAccessPage";

// Anggota pages
import AnggotaList from "@/pages/Anggota/AnggotaList";
import AnggotaForm from "@/pages/Anggota/AnggotaForm";
import AnggotaDetail from "@/pages/Anggota/AnggotaDetail";
import UnitKerjaList from "@/pages/Anggota/UnitKerjaList";
import AnggotaChangePassword from "@/pages/Anggota/AnggotaChangePassword";

// Transaksi pages
import TransaksiList from "@/pages/Transaksi/TransaksiList";
import TransaksiForm from "@/pages/Transaksi/TransaksiForm";
import TransaksiDetail from "@/pages/Transaksi/TransaksiDetail";

// Jenis Transaksi pages
import JenisPage from "@/pages/Transaksi/Jenis/JenisPage";

// Pengajuan pages
import PengajuanList from "@/pages/Transaksi/Pengajuan/PengajuanList";
import PengajuanForm from "@/pages/Transaksi/Pengajuan/PengajuanForm";
import PengajuanDetail from "@/pages/Transaksi/Pengajuan/PengajuanDetail";
import PengajuanEditForm from "@/pages/Transaksi/Pengajuan/PengajuanEditForm";

// Simpanan pages
import SimpanList from "@/pages/Transaksi/Simpan/SimpanList";
import SimpanForm from "@/pages/Transaksi/Simpan/SimpanForm";
import SimpanDetail from "@/pages/Transaksi/Simpan/SimpanDetail";
import SimpanEditForm from "@/pages/Transaksi/Simpan/SimpanEditForm";

// Pinjaman pages
import PinjamList from "@/pages/Transaksi/Pinjam/PinjamList";
import PinjamForm from "@/pages/Transaksi/Pinjam/PinjamForm";
import PinjamDetail from "@/pages/Transaksi/Pinjam/PinjamDetail";
import PinjamEditForm from "@/pages/Transaksi/Pinjam/PinjamEditForm";

// Penarikan pages
import PenarikanList from "@/pages/Transaksi/Penarikan/PenarikanList";
import PenarikanForm from "@/pages/Transaksi/Penarikan/PenarikanForm";
import PenarikanDetailPage from "@/pages/Transaksi/Penarikan/PenarikanDetailPage";
import PenarikanEditForm from "@/pages/Transaksi/Penarikan/PenarikanEditForm";

// Angsuran pages
import AngsuranList from "@/pages/Transaksi/Angsuran/AngsuranList";
import AngsuranForm from "@/pages/Transaksi/Angsuran/AngsuranForm";
import AngsuranDetail from "@/pages/Transaksi/Angsuran/AngsuranDetail";
import AngsuranEditForm from "@/pages/Transaksi/Angsuran/AngsuranEditForm";

// Keuangan pages
import KeuanganIndex from "@/pages/Keuangan";
import { default as KeuanganTransaksiList } from "@/pages/Keuangan/TransaksiList";
import KategoriTransaksi from "@/pages/Keuangan/KategoriTransaksi";
import LaporanArusKas from "@/pages/Keuangan/LaporanPage";

// Laporan pages
import Laporan from "@/pages/Laporan/Laporan";

// POS pages
import POSIndex from "@/pages/POS/POSIndex";
import Inventori from "@/pages/POS/Inventori";
import Pemasok from "@/pages/POS/Pemasok";
import Pembelian from "@/pages/POS/Pembelian";
import PenjualanKasir from "@/pages/POS/PenjualanKasir";
import PenjualanList from "@/pages/POS/PenjualanList";
import PenjualanDetail from "@/pages/POS/PenjualanDetail";
import LaporanJualBeli from "@/pages/POS/LaporanJualBeli";
import LaporanRugiLaba from "@/pages/POS/LaporanRugiLaba";
import StokBarang from "@/pages/POS/StokBarang";
import NamaKasir from "@/pages/POS/NamaKasir";
import KategoriBarang from "@/pages/POS/KategoriBarang";
import ReturPOS from "@/pages/POS/ReturPOS";

// Akuntansi pages
import AkuntansiIndex from "@/pages/Akuntansi";
import AkuntansiTabs from "@/pages/Akuntansi/AkuntansiTabs";
import ChartOfAccounts from "@/pages/Akuntansi/ChartOfAccounts";
import JurnalUmum from "@/pages/Akuntansi/JurnalUmum";
import BukuBesar from "@/pages/Akuntansi/BukuBesar";
import LaporanKeuangan from "@/pages/Akuntansi/LaporanKeuangan";

// Pengaturan pages
import PengaturanPage from "@/pages/Pengaturan/PengaturanPage";
import Pengaturan from "@/pages/Pengaturan/Pengaturan";
import AuditTrail from "@/pages/Pengaturan/AuditTrail";

// Import pages
import ImportAnggota from "@/pages/Import/ImportAnggota";
import ImportTransaksi from "@/pages/Import/ImportTransaksi";

import NotFound from "@/pages/NotFound";

// Algoritma pages
import AlgoritmaPage from "@/pages/Pengaturan/AlgoritmaPage";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/anggota-login" element={<AnggotaLoginPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
            <Route path="/akses-cepat" element={<AuthGuard><QuickAccessPage /></AuthGuard>} />
            
            {/* Master Data */}
            <Route path="/master/unit-kerja" element={<AuthGuard><UnitKerjaList /></AuthGuard>} />
            <Route path="/master/anggota" element={<AuthGuard><AnggotaList /></AuthGuard>} />
            <Route path="/master/anggota/tambah" element={<AuthGuard><AnggotaForm /></AuthGuard>} />
            <Route path="/master/anggota/edit/:id" element={<AuthGuard><AnggotaForm /></AuthGuard>} />
            <Route path="/master/anggota/:id" element={<AuthGuard><AnggotaDetail /></AuthGuard>} />
            <Route path="/anggota/change-password" element={<AuthGuard><AnggotaChangePassword /></AuthGuard>} />
            
            {/* Transaksi */}
            <Route path="/transaksi" element={<AuthGuard><TransaksiList /></AuthGuard>} />
            <Route path="/transaksi/tambah" element={<AuthGuard><TransaksiForm /></AuthGuard>} />
            <Route path="/transaksi/:id" element={<AuthGuard><TransaksiDetail /></AuthGuard>} />
            
            {/* Jenis Transaksi */}
            <Route path="/transaksi/jenis" element={<AuthGuard><JenisPage /></AuthGuard>} />
            
            {/* Pengajuan */}
            <Route path="/transaksi/pengajuan" element={<AuthGuard><PengajuanList /></AuthGuard>} />
            <Route path="/transaksi/pengajuan/tambah" element={<AuthGuard><PengajuanForm /></AuthGuard>} />
            <Route path="/transaksi/pengajuan/:id" element={<AuthGuard><PengajuanDetail /></AuthGuard>} />
            <Route path="/transaksi/pengajuan/edit/:id" element={<AuthGuard><PengajuanEditForm /></AuthGuard>} />
            
            {/* Simpanan */}
            <Route path="/transaksi/simpan" element={<AuthGuard><SimpanList /></AuthGuard>} />
            <Route path="/transaksi/simpan/tambah" element={<AuthGuard><SimpanForm /></AuthGuard>} />
            <Route path="/transaksi/simpan/:id" element={<AuthGuard><SimpanDetail /></AuthGuard>} />
            <Route path="/transaksi/simpan/edit/:id" element={<AuthGuard><SimpanEditForm /></AuthGuard>} />
            
            {/* Pinjaman */}
            <Route path="/transaksi/pinjam" element={<AuthGuard><PinjamList /></AuthGuard>} />
            <Route path="/transaksi/pinjam/tambah" element={<AuthGuard><PinjamForm /></AuthGuard>} />
            <Route path="/transaksi/pinjam/:id" element={<AuthGuard><PinjamDetail /></AuthGuard>} />
            <Route path="/transaksi/pinjam/edit/:id" element={<AuthGuard><PinjamEditForm /></AuthGuard>} />
            
            {/* Penarikan */}
            <Route path="/transaksi/penarikan" element={<AuthGuard><PenarikanList /></AuthGuard>} />
            <Route path="/transaksi/penarikan/tambah" element={<AuthGuard><PenarikanForm /></AuthGuard>} />
            <Route path="/transaksi/penarikan/:id" element={<AuthGuard><PenarikanDetailPage /></AuthGuard>} />
            <Route path="/transaksi/penarikan/edit/:id" element={<AuthGuard><PenarikanEditForm /></AuthGuard>} />
            
            {/* Angsuran */}
            <Route path="/transaksi/angsuran" element={<AuthGuard><AngsuranList /></AuthGuard>} />
            <Route path="/transaksi/angsuran/tambah" element={<AuthGuard><AngsuranForm /></AuthGuard>} />
            <Route path="/transaksi/angsuran/:id" element={<AuthGuard><AngsuranDetail /></AuthGuard>} />
            <Route path="/transaksi/angsuran/edit/:id" element={<AuthGuard><AngsuranEditForm /></AuthGuard>} />
            
            {/* Keuangan - Using simplified report page */}
            <Route path="/keuangan" element={<AuthGuard><KeuanganIndex /></AuthGuard>} />
            <Route path="/keuangan/transaksi" element={<AuthGuard><KeuanganTransaksiList /></AuthGuard>} />
            <Route path="/keuangan/kategori" element={<AuthGuard><KategoriTransaksi /></AuthGuard>} />
            <Route path="/keuangan/laporan" element={<AuthGuard><LaporanArusKas /></AuthGuard>} />
            
            {/* POS / KPRI Mart Routes */}
            <Route path="/pos" element={<AuthGuard><POSIndex /></AuthGuard>} />
            <Route path="/pos/inventori" element={<AuthGuard><Inventori /></AuthGuard>} />
            <Route path="/pos/produk" element={<AuthGuard><Inventori /></AuthGuard>} />
            <Route path="/pos/kategori" element={<AuthGuard><KategoriBarang /></AuthGuard>} />
            <Route path="/pos/pemasok" element={<AuthGuard><Pemasok /></AuthGuard>} />
            <Route path="/pos/kasir" element={<AuthGuard><NamaKasir /></AuthGuard>} />
            <Route path="/pos/pembelian" element={<AuthGuard><Pembelian /></AuthGuard>} />
            <Route path="/pos/penjualan" element={<AuthGuard><PenjualanKasir /></AuthGuard>} />
            <Route path="/pos/penjualan/list" element={<AuthGuard><PenjualanList /></AuthGuard>} />
            <Route path="/pos/penjualan/:id" element={<AuthGuard><PenjualanDetail /></AuthGuard>} />
            <Route path="/pos/retur" element={<AuthGuard><ReturPOS /></AuthGuard>} />
            <Route path="/pos/laporan/penjualan" element={<AuthGuard><LaporanJualBeli /></AuthGuard>} />
            <Route path="/pos/laporan/laba-rugi" element={<AuthGuard><LaporanRugiLaba /></AuthGuard>} />
            <Route path="/pos/laporan/stok" element={<AuthGuard><StokBarang /></AuthGuard>} />
            
            {/* Laporan */}
            <Route path="/laporan" element={<AuthGuard><Laporan /></AuthGuard>} />
            
            {/* Akuntansi */}
            <Route path="/akuntansi" element={<AuthGuard><AkuntansiTabs /></AuthGuard>} />
            <Route path="/akuntansi/coa" element={<AuthGuard><ChartOfAccounts /></AuthGuard>} />
            <Route path="/akuntansi/jurnal" element={<AuthGuard><JurnalUmum /></AuthGuard>} />
            <Route path="/akuntansi/buku-besar" element={<AuthGuard><BukuBesar /></AuthGuard>} />
            <Route path="/akuntansi/laporan" element={<AuthGuard><LaporanKeuangan /></AuthGuard>} />
            
            {/* Pengaturan */}
            <Route path="/pengaturan" element={<AuthGuard><PengaturanPage /></AuthGuard>} />
            <Route path="/pengaturan/algoritma" element={<AuthGuard><AlgoritmaPage /></AuthGuard>} />
            <Route path="/pengaturan/audit-trail" element={<AuthGuard><AuditTrail /></AuthGuard>} />
            
            {/* Import */}
            <Route path="/import/anggota" element={<AuthGuard><ImportAnggota /></AuthGuard>} />
            <Route path="/import/transaksi" element={<AuthGuard><ImportTransaksi /></AuthGuard>} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
