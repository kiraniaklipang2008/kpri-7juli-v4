
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', pinjaman: 45000000 },
  { month: 'Feb', pinjaman: 52000000 },
  { month: 'Mar', pinjaman: 48000000 },
  { month: 'Apr', pinjaman: 61000000 },
  { month: 'May', pinjaman: 55000000 },
  { month: 'Jun', pinjaman: 67000000 },
  { month: 'Jul', pinjaman: 72000000 },
  { month: 'Aug', pinjaman: 68000000 },
  { month: 'Sep', pinjaman: 75000000 },
  { month: 'Oct', pinjaman: 78000000 },
  { month: 'Nov', pinjaman: 82000000 },
  { month: 'Dec', pinjaman: 85000000 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`Bulan: ${label}`}</p>
        <p className="text-blue-600">
          Total Pinjaman: <span className="font-bold">
            Rp {payload[0].value.toLocaleString('id-ID')}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function PinjamanBarChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Bar 
            dataKey="pinjaman" 
            fill="url(#pinjamanGradient)"
            radius={[4, 4, 0, 0]}
            stroke="#2563eb"
            strokeWidth={1}
          />
          <defs>
            <linearGradient id="pinjamanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
