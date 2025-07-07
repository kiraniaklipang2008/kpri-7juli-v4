
import React from "react";
import Layout from "@/components/layout/Layout";
import AkuntansiHeader from "@/components/akuntansi/dashboard/AkuntansiHeader";
import QuickStatsGrid from "@/components/akuntansi/dashboard/QuickStatsGrid";
import MainModulesGrid from "@/components/akuntansi/dashboard/MainModulesGrid";
import ReportSummarySection from "@/components/akuntansi/dashboard/ReportSummarySection";
import RecentActivitySection from "@/components/akuntansi/dashboard/RecentActivitySection";

export default function AkuntansiIndex() {
  return (
    <Layout pageTitle="Akuntansi">
      <div className="container mx-auto py-4 space-y-6">
        <AkuntansiHeader />
        <QuickStatsGrid />
        <MainModulesGrid />
        <ReportSummarySection />
        <RecentActivitySection />
      </div>
    </Layout>
  );
}
