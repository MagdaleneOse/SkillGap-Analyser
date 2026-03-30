// src/components/BarChartView.tsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CategoryScore } from '../types';

interface BarChartViewProps {
  categoryScores: CategoryScore[];
}

function getBarColour(score: number): string {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function BarChartView({ categoryScores }: BarChartViewProps) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Category Breakdown</h3>
      <p className="chart-subtitle">
        Score per category — green ≥ 75, amber ≥ 50, red below 50
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={categoryScores}
          margin={{ top: 10, right: 20, bottom: 40, left: 0 }}
          barSize={36}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f3f4f6"
            vertical={false}
          />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: '#374151' }}
            angle={-20}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) => [`${Number(value ?? 0)}%`, 'Score']}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '0.85rem',
            }}
            cursor={{ fill: '#f9fafb' }}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {categoryScores.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColour(entry.score)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartView;