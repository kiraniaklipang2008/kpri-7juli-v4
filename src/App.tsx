import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Anggota from './pages/Anggota/Anggota';
import UnitKerja from './pages/UnitKerja/UnitKerja';
import Simpanan from './pages/Simpanan/Simpanan';
import Pinjaman from './pages/Pinjaman/Pinjaman';
import PengaturanPage from './pages/Pengaturan/PengaturanPage';
import AlgoritmaPage from './pages/Pengaturan/AlgoritmaPage';
import AuditTrail from './pages/Pengaturan/AuditTrail';
import NotFound from './pages/NotFound';
import Laporan from './pages/Laporan/Laporan';
import KategoriTransaksi from './pages/Keuangan/KategoriTransaksi';
import TransaksiKeuangan from './pages/Keuangan/TransaksiKeuangan';
import LaporanArusKas from './pages/Keuangan/LaporanArusKas';
import Pengajuan from './pages/Transaksi/Pengajuan';
import JenisTransaksi from './pages/Transaksi/JenisTransaksi';
import Angsuran from './pages/Transaksi/Angsuran';
import Penarikan from './pages/Transaksi/Penarikan';
import AksesCepat from './pages/AksesCepat';
import { QueryClient } from 'react-query';
import PenggunaPenanPage from './pages/Pengaturan/PenggunaPenanPage';

function App() {
  return (
    <Router>
      <QueryClient>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/master/anggota" element={<Anggota />} />
          <Route path="/master/unit-kerja" element={<UnitKerja />} />
          <Route path="/simpanan" element={<Simpanan />} />
          <Route path="/pinjaman" element={<Pinjaman />} />
          <Route path="/laporan" element={<Laporan />} />

          {/* Keuangan Routes */}
          <Route path="/keuangan/kategori" element={<KategoriTransaksi />} />
          <Route path="/keuangan/transaksi" element={<TransaksiKeuangan />} />
          <Route path="/keuangan/laporan" element={<LaporanArusKas />} />

          {/* Transaksi Routes */}
          <Route path="/transaksi/pengajuan" element={<Pengajuan />} />
          <Route path="/transaksi/jenis" element={<JenisTransaksi />} />
          <Route path="/transaksi/angsuran" element={<Angsuran />} />
          <Route path="/transaksi/penarikan" element={<Penarikan />} />

          <Route path="/akses-cepat" element={<AksesCepat />} />
          
          {/* Pengaturan Routes */}
          <Route path="/pengaturan" element={<PengaturanPage />} />
          <Route path="/pengaturan/pengguna-peran" element={<PenggunaPenanPage />} />
          <Route path="/pengaturan/algoritma" element={<AlgoritmaPage />} />
          <Route path="/pengaturan/audit-trail" element={<AuditTrail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryClient>
    </Router>
  );
}

export default App;
