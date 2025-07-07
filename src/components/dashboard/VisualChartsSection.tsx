
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpananPieChart } from "@/components/dashboard/charts/SimpananPieChart";
import { PinjamanBarChart } from "@/components/dashboard/charts/PinjamanBarChart";
import { SHULineChart } from "@/components/dashboard/charts/SHULineChart";
import { PiutangStackedBarChart } from "@/components/dashboard/charts/PiutangStackedBarChart";
import { SimpananPinjamanAreaChart } from "@/components/dashboard/charts/SimpananPinjamanAreaChart";
import { AnggotaDonutChart } from "@/components/dashboard/charts/AnggotaDonutChart";

export function VisualChartsSection() {
  return (
    <div className="mb-8">
      <div className="mb-8 p-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200 shadow-lg">
        <h2 className="text-3xl font-bold text-emerald-900 mb-3">Analisis Visual Koperasi</h2>
        <p className="text-emerald-700 text-lg font-medium">Visualisasi data komprehensif untuk pengambilan keputusan yang lebih baik</p>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart - Komposisi Simpanan */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              📊 Komposisi Simpanan Anggota
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <SimpananPieChart />
          </CardContent>
        </Card>

        {/* Bar Chart - Pertumbuhan Pinjaman */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              📈 Pertumbuhan Pinjaman Per Bulan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <PinjamanBarChart />
          </CardContent>
        </Card>

        {/* Line Chart - Tren SHU */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              📊 Tren SHU 5 Tahun Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <SHULineChart />
          </CardContent>
        </Card>

        {/* Stacked Bar Chart - Piutang */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              📊 Analisis Piutang Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <PiutangStackedBarChart />
          </CardContent>
        </Card>

        {/* Area Chart - Simpanan vs Pinjaman */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              📈 Perbandingan Simpanan & Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <SimpananPinjamanAreaChart />
          </CardContent>
        </Card>

        {/* Donut Chart - Distribusi Anggota */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              👥 Distribusi Anggota Berdasarkan Pekerjaan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <AnggotaDonutChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
