
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { RecentTransactionsTable } from "@/components/dashboard/RecentTransactionsTable";
import { ProductivityTable } from "@/components/dashboard/ProductivityTable";
import { ActivityBarChart } from "@/components/dashboard/ActivityBarChart";
import { KinerjaRadarChart } from "@/components/dashboard/charts/KinerjaRadarChart";
import { DashboardData } from "@/hooks/useDashboardData";
import { ActivityData } from "@/hooks/useActivityChart";

interface MainDashboardContentProps {
  dashboardData: DashboardData;
  monthlyActivityData: ActivityData[];
}

export function MainDashboardContent({ 
  dashboardData, 
  monthlyActivityData 
}: MainDashboardContentProps) {
  const { 
    totalAnggota, 
    totalSimpanan, 
    totalPinjaman,
    recentTransaksi,
    productivityData
  } = dashboardData;

  return (
    <>
      {/* Statistics Cards */}
      <StatisticsCards 
        totalAnggota={totalAnggota}
        totalSimpanan={totalSimpanan}
        totalPinjaman={totalPinjaman}
      />
      
      {/* Transaction Activity and Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Transaction Activity Chart Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              📊 Aktivitas Transaksi Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ActivityBarChart data={monthlyActivityData} />
            </div>
          </CardContent>
        </Card>
        
        {/* Radar Chart - Kinerja Koperasi */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl">
          <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              🎯 Penilaian Kinerja Koperasi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <KinerjaRadarChart />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions Table */}
      <Card className="mb-8 shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
        <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            📋 Transaksi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <RecentTransactionsTable transactions={recentTransaksi} />
        </CardContent>
      </Card>
      
      {/* Productivity Table */}
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
        <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            📈 Produktivitas Koperasi
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ProductivityTable {...productivityData} />
        </CardContent>
      </Card>
    </>
  );
}
