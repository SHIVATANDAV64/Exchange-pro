import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import { useHistoricalRates } from '@/react-app/hooks/useCurrency';

interface HistoricalChartProps {
  baseCurrency: string;
  targetCurrency: string;
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({ baseCurrency, targetCurrency }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const { data: historicalData, isLoading } = useHistoricalRates(baseCurrency, targetCurrency, selectedPeriod);

  const periods = [
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: '1y', label: '1Y' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (selectedPeriod === '7d') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (selectedPeriod === '30d') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  const chartData = historicalData?.history?.map((item: any) => ({
    date: formatDate(item.timestamp),
    rate: item.rate,
    fullDate: item.timestamp,
  })).reverse() || [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {new Date(data.fullDate).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            1 {baseCurrency} = {payload[0].value.toFixed(6)} {targetCurrency}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 rounded-2xl">
            <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Historical Rates
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {baseCurrency} to {targetCurrency}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedPeriod === period.key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading chart data...</span>
          </div>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                domain={['dataMin', 'dataMax']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="url(#colorGradient)"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', stroke: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#8B5CF6' }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default HistoricalChart;
