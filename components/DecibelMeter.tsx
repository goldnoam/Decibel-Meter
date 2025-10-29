import React from 'react';
import { DecibelDataPoint, Theme } from '../types';
import Gauge from './Gauge';
import DecibelLineChart from './LineChart';

interface DecibelMeterProps {
  currentDb: number;
  avgDb: number;
  maxDb: number;
  dbHistory: DecibelDataPoint[];
  theme: Theme;
  t: { [key: string]: string };
}

const StatCard: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
    <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md transition-colors duration-300">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className={`text-3xl font-bold ${color}`}>
            {value.toFixed(1)}
        </span>
    </div>
);

const DecibelMeter: React.FC<DecibelMeterProps> = ({ currentDb, avgDb, maxDb, dbHistory, theme, t }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <Gauge value={currentDb} label={t.soundLevel} units="dB" theme={theme} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label={t.average} value={avgDb} color="text-blue-500 dark:text-blue-400" />
        <StatCard label={t.max} value={maxDb} color="text-red-500 dark:text-red-400" />
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">{t.liveSoundLevel}</h3>
        <DecibelLineChart data={dbHistory} theme={theme} />
      </div>
    </div>
  );
};

export default DecibelMeter;