
import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getAnggotaList } from '@/services/anggotaService';

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#84CC16'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-blue-600">
          Persentase: <span className="font-bold">{data.value}%</span>
        </p>
        <p className="text-green-600">
          Jumlah: <span className="font-bold">{data.payload.count} orang</span>
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-sm font-medium"
    >
      {`${name}: ${value}%`}
    </text>
  );
};

export function AnggotaDonutChart() {
  // Calculate real data from anggota service
  const data = useMemo(() => {
    const anggotaList = getAnggotaList();
    
    // Group anggota by unitKerja
    const unitKerjaCount = anggotaList.reduce((acc, anggota) => {
      const unitKerja = anggota.unitKerja || 'Tidak Diketahui';
      acc[unitKerja] = (acc[unitKerja] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalAnggota = anggotaList.length;
    
    // Convert to chart data format
    return Object.entries(unitKerjaCount)
      .map(([unitKerja, count]) => ({
        name: unitKerja,
        value: totalAnggota > 0 ? Math.round((count / totalAnggota) * 100) : 0,
        count: count
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, []);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
