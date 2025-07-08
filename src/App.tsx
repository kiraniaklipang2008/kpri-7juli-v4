
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VisualDashboard } from './pages/Dashboard';
import { Anggota } from './pages/Anggota/Anggota';
import { UnitKerjaList } from './pages/UnitKerja/UnitKerjaList';
import { TransaksiList } from './pages/Transaksi/TransaksiList';
import { LaporanPage } from './pages/Keuangan/LaporanPage';
import KategoriTransaksi from './pages/Keuangan/KategoriTransaksi';
import { TransaksiList as KeuanganTransaksi } from './pages/Keuangan/TransaksiList';
import { LaporanKeuangan } from './pages/Keuangan/LaporanKeuangan';
import { PengajuanList } from './pages/Transaksi/Pengajuan/PengajuanList';
import { JenisPage } from './pages/Transaksi/Jenis/JenisPage';
import { AngsuranList } from './pages/Transaksi/Angsuran/AngsuranList';
import { PenarikanList } from './pages/Transaksi/Penarikan/PenarikanList';
import { QuickAccessPage } from './pages/QuickAccess/QuickAccessPage';
import PengaturanPage from './pages/Pengaturan/PengaturanPage';
import PenggunaPenanPage from './pages/Pengaturan/PenggunaPenanPage';
import AlgoritmaPage from './pages/Pengaturan/AlgoritmaPage';
import AuditTrail from './pages/Pengaturan/AuditTrail';
import NotFound from './pages/NotFound';
import Laporan from './pages/Laporan/Laporan';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<VisualDashboard />} />
          <Route path="/master/anggota" element={<Anggota />} />
          <Route path="/master/unit-kerja" element={<UnitKerjaList />} />
          <Route path="/simpanan" element={<TransaksiList />} />
          <Route path="/pinjaman" element={<TransaksiList />} />
          <Route path="/laporan" element={<Laporan />} />

          {/* Keuangan Routes */}
          <Route path="/keuangan/kategori" element={<KategoriTransaksi />} />
          <Route path="/keuangan/transaksi" element={<KeuanganTransaksi />} />
          <Route path="/keuangan/laporan" element={<LaporanKeuangan />} />

          {/* Transaksi Routes */}
          <Route path="/transaksi/pengajuan" element={<PengajuanList />} />
          <Route path="/transaksi/jenis" element={<JenisPage />} />
          <Route path="/transaksi/angsuran" element={<AngsuranList />} />
          <Route path="/transaksi/penarikan" element={<PenarikanList />} />

          <Route path="/akses-cepat" element={<QuickAccessPage />} />
          
          {/* Pengaturan Routes */}
          <Route path="/pengaturan" element={<PengaturanPage />} />
          <Route path="/pengaturan/pengguna-peran" element={<PenggunaPenanPage />} />
          <Route path="/pengaturan/algoritma" element={<AlgoritmaPage />} />
          <Route path="/pengaturan/audit-trail" element={<AuditTrail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
