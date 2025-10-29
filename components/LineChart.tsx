
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DecibelDataPoint, Theme } from '../types';

interface DecibelLineChartProps {
  data: DecibelDataPoint[];
  theme: Theme;
}

const DecibelLineChart: React.FC<DecibelLineChartProps> = ({ data, theme }) => {
  const gridColor = theme === Theme.Dark ? '#4A5568' : '#D1D5DB';
  const textColor = theme === Theme.Dark ? '#E5E7EB' : '#374151';
  const lineColor = theme === Theme.Dark ? '#63b3ed' : '#3b82f6';

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="time" tick={{ fill: textColor }} tickFormatter={() => ''} />
          <YAxis domain={[0, 140]} tick={{ fill: textColor }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === Theme.Dark ? '#1F2937' : '#FFFFFF',
              borderColor: gridColor,
            }}
            labelStyle={{ color: textColor }}
            formatter={(value) => [`${Number(value).toFixed(1)} dB`, 'Level']}
          />
          <Line
            type="monotone"
            dataKey="db"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DecibelLineChart;
