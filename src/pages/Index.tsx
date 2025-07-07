
import Layout from "@/components/layout/Layout";
import { useEffect } from "react";
import { initSampleProdukData } from "@/services/produk";
import { initSampleKasirData } from "@/services/kasirService";

// Import the extracted components and utilities
import { useDashboardData } from "@/hooks/useDashboardData";
import { useActivityChart } from "@/hooks/useActivityChart";

// Import the new modular components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MainDashboardContent } from "@/components/dashboard/MainDashboardContent";
import { VisualChartsSection } from "@/components/dashboard/VisualChartsSection";

export default function Index() {
  // Initialize sample data for the POS system
  useEffect(() => {
    initSampleProdukData();
    initSampleKasirData();
  }, []);
  
  // Use our custom hook to fetch all dashboard data
  const dashboardData = useDashboardData();
  
  const { prepareActivityChartData } = useActivityChart();
  const monthlyActivityData = prepareActivityChartData(dashboardData.allTransaksi);
  
  return (
    <Layout pageTitle="Dashboard">
      {/* Elegant Header matching login theme */}
      <DashboardHeader />
      
      {/* Main Dashboard Content */}
      <MainDashboardContent 
        dashboardData={dashboardData}
        monthlyActivityData={monthlyActivityData}
      />

      {/* New Visual Charts Section */}
      <VisualChartsSection />
    </Layout>
  );
}
