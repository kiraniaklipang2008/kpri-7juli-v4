
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileDown } from 'lucide-react';
import { SimpananPieChart } from './charts/SimpananPieChart';
import { PinjamanBarChart } from './charts/PinjamanBarChart';
import { SHULineChart } from './charts/SHULineChart';
import { PiutangStackedBarChart } from './charts/PiutangStackedBarChart';
import { SimpananPinjamanAreaChart } from './charts/SimpananPinjamanAreaChart';
import { AnggotaDonutChart } from './charts/AnggotaDonutChart';
import { KinerjaRadarChart } from './charts/KinerjaRadarChart';

export function KoperasiVisualDashboard() {
  const handleDownloadPNG = () => {
    // Implementation for PNG download would go here
    console.log('Downloading as PNG...');
  };

  const handleDownloadPDF = () => {
    // Implementation for PDF download would go here
    console.log('Downloading as PDF...');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6 p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-lg text-white">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Dashboard Visual Koperasi Simpan Pinjam
            </h1>
            <p className="text-blue-100 text-lg">
              Analisis komprehensif data koperasi dengan visualisasi interaktif
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleDownloadPNG} 
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-md font-semibold"
            >
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
            <Button 
              onClick={handleDownloadPDF} 
              className="bg-green-500 hover:bg-green-600 text-white shadow-md font-semibold"
            >
              <FileDown className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Komposisi Simpanan */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📊 Komposisi Simpanan Anggota
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SimpananPieChart />
          </CardContent>
        </Card>

        {/* Bar Chart - Pertumbuhan Pinjaman */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📈 Pertumbuhan Pinjaman Per Bulan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <PinjamanBarChart />
          </CardContent>
        </Card>

        {/* Line Chart - Tren SHU */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📊 Tren SHU 5 Tahun Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SHULineChart />
          </CardContent>
        </Card>

        {/* Stacked Bar Chart - Piutang */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📊 Analisis Piutang Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <PiutangStackedBarChart />
          </CardContent>
        </Card>

        {/* Area Chart - Simpanan vs Pinjaman */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📈 Perbandingan Simpanan & Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SimpananPinjamanAreaChart />
          </CardContent>
        </Card>

        {/* Donut Chart - Distribusi Anggota */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              👥 Distribusi Anggota Berdasarkan Pekerjaan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <AnggotaDonutChart />
          </CardContent>
        </Card>

        {/* Radar Chart - Kinerja Koperasi */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 lg:col-span-2 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              🎯 Penilaian Kinerja Koperasi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <KinerjaRadarChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
