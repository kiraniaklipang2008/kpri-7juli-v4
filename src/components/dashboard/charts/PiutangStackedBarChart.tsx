
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { month: 'Jan', lancar: 85000000, bermasalah: 15000000 },
  { month: 'Feb', lancar: 88000000, bermasalah: 12000000 },
  { month: 'Mar', lancar: 82000000, bermasalah: 18000000 },
  { month: 'Apr', lancar: 91000000, bermasalah: 9000000 },
  { month: 'May', lancar: 87000000, bermasalah: 13000000 },
  { month: 'Jun', lancar: 93000000, bermasalah: 7000000 },
  { month: 'Jul', lancar: 89000000, bermasalah: 11000000 },
  { month: 'Aug', lancar: 95000000, bermasalah: 5000000 },
  { month: 'Sep', lancar: 92000000, bermasalah: 8000000 },
  { month: 'Oct', lancar: 96000000, bermasalah: 4000000 },
  { month: 'Nov', lancar: 94000000, bermasalah: 6000000 },
  { month: 'Dec', lancar: 98000000, bermasalah: 2000000 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`Bulan: ${label}`}</p>
        <p className="text-green-600">
          Piutang Lancar: <span className="font-bold">
            Rp {payload[0].value.toLocaleString('id-ID')}
          </span>
        </p>
        <p className="text-red-600">
          Piutang Bermasalah: <span className="font-bold">
            Rp {payload[1].value.toLocaleString('id-ID')}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function PiutangStackedBarChart() {
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
          <Legend />
          <Bar 
            dataKey="lancar" 
            stackId="a" 
            fill="#10b981"
            name="Piutang Lancar"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="bermasalah" 
            stackId="a" 
            fill="#ef4444"
            name="Piutang Bermasalah"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
