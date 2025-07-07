
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building, FileText, Users, TrendingUp } from "lucide-react";

const quickStats = [
  {
    title: "Total Aset",
    value: "Rp 275M",
    icon: Building,
    color: "text-blue-600",
    change: "+12.5%"
  },
  {
    title: "Total Kewajiban", 
    value: "Rp 200M",
    icon: FileText,
    color: "text-red-600",
    change: "+8.2%"
  },
  {
    title: "Total Modal",
    value: "Rp 75M",
    icon: Users,
    color: "text-green-600",
    change: "+15.3%"
  },
  {
    title: "Laba Bulan Ini",
    value: "Rp 10M",
    icon: TrendingUp,
    color: "text-purple-600",
    change: "+25.8%"
  }
];

export default function QuickStatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {quickStats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center p-6">
            <div className={`rounded-full p-3 mr-4 ${stat.color} bg-opacity-10`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} dari bulan lalu
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
