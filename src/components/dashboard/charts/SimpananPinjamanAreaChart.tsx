
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { month: 'Jan', simpanan: 120000000, pinjaman: 45000000 },
  { month: 'Feb', simpanan: 125000000, pinjaman: 52000000 },
  { month: 'Mar', simpanan: 128000000, pinjaman: 48000000 },
  { month: 'Apr', simpanan: 132000000, pinjaman: 61000000 },
  { month: 'May', simpanan: 135000000, pinjaman: 55000000 },
  { month: 'Jun', simpanan: 140000000, pinjaman: 67000000 },
  { month: 'Jul', simpanan: 145000000, pinjaman: 72000000 },
  { month: 'Aug', simpanan: 148000000, pinjaman: 68000000 },
  { month: 'Sep', simpanan: 152000000, pinjaman: 75000000 },
  { month: 'Oct', simpanan: 156000000, pinjaman: 78000000 },
  { month: 'Nov', simpanan: 160000000, pinjaman: 82000000 },
  { month: 'Dec', simpanan: 165000000, pinjaman: 85000000 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`Bulan: ${label}`}</p>
        <p className="text-blue-600">
          Total Simpanan: <span className="font-bold">
            Rp {payload[0].value.toLocaleString('id-ID')}
          </span>
        </p>
        <p className="text-orange-600">
          Total Pinjaman: <span className="font-bold">
            Rp {payload[1].value.toLocaleString('id-ID')}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function SimpananPinjamanAreaChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="simpanan"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Total Simpanan"
          />
          <Area
            type="monotone"
            dataKey="pinjaman"
            stackId="2"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.6}
            name="Total Pinjaman"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
