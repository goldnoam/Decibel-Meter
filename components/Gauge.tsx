
import React from 'react';
import { Theme } from '../types';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  units: string;
  theme: Theme;
}

const Gauge: React.FC<GaugeProps> = ({ value, min = 0, max = 140, label, units, theme }) => {
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = (clampedValue - min) / (max - min);
  const angle = -135 + percentage * 270;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians)),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };
  
  const needleColor = theme === Theme.Dark ? 'hsl(180, 100%, 50%)' : 'hsl(200, 100%, 40%)';

  const getArcColor = (percent: number) => {
    if (percent < 0.4) return theme === Theme.Dark ? 'hsl(120, 70%, 50%)' : 'hsl(120, 60%, 45%)'; // Green
    if (percent < 0.75) return theme === Theme.Dark ? 'hsl(50, 80%, 60%)' : 'hsl(45, 90%, 50%)'; // Yellow
    return theme === Theme.Dark ? 'hsl(0, 80%, 60%)' : 'hsl(0, 70%, 50%)'; // Red
  };

  const activeArcColor = getArcColor(percentage);
  
  const arcPath = describeArc(100, 100, 80, -135, angle);
  const backgroundArcPath = describeArc(100, 100, 80, -135, 135);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <svg viewBox="0 0 200 160" className="w-full h-auto">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme === Theme.Dark ? 'hsl(120, 70%, 50%)' : 'hsl(120, 60%, 45%)'} />
            <stop offset="50%" stopColor={theme === Theme.Dark ? 'hsl(50, 80%, 60%)' : 'hsl(45, 90%, 50%)'} />
            <stop offset="100%" stopColor={theme === Theme.Dark ? 'hsl(0, 80%, 60%)' : 'hsl(0, 70%, 50%)'} />
          </linearGradient>
        </defs>
        <path d={backgroundArcPath} stroke={theme === Theme.Dark ? "#374151" : "#e5e7eb"} strokeWidth="20" fill="none" strokeLinecap="round" />
        <path d={arcPath} stroke={activeArcColor} strokeWidth="20" fill="none" strokeLinecap="round" style={{ transition: 'stroke 0.3s ease-in-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
        <span className="text-6xl md:text-7xl font-bold text-gray-800 dark:text-white" style={{ transition: 'color 0.3s ease-in-out' }}>
          {value.toFixed(1)}
        </span>
        <span className="text-xl font-medium text-gray-500 dark:text-gray-400">{units}</span>
        <span className="text-lg text-gray-600 dark:text-gray-300">{label}</span>
      </div>
    </div>
  );
};

export default Gauge;
