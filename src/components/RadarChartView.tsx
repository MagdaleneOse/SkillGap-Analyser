import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { CategoryScore } from '../types';

interface RadarChartViewProps {
  categoryScores: CategoryScore[];
}

function RadarChartView({ categoryScores }: RadarChartViewProps) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Skills Radar</h3>
      <p className="chart-subtitle">
        Competency score across five categories
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart
          data={categoryScores}
          margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
        >
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickCount={6}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value) => [`${Number(value ?? 0)}%`, 'Score']}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '0.85rem',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RadarChartView;