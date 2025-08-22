import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTopPairs } from '@/react-app/hooks/useCurrency';
import { SUPPORTED_CURRENCIES } from '@/shared/types';

const TopPairs: React.FC = () => {
  const { data: topPairsData, isLoading } = useTopPairs();

  const getCurrencySymbol = (code: string) => {
    return SUPPORTED_CURRENCIES.find(c => c.code === code)?.symbol || code;
  };

  const formatRate = (rate: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(rate);
  };

  // Mock trend data (in real app, this would come from API)
  const getTrendData = () => {
    const isPositive = Math.random() > 0.5;
    const change = (Math.random() * 5).toFixed(2);
    return {
      isPositive,
      change: `${isPositive ? '+' : '-'}${change}%`
    };
  };

  return (
    <div className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-emerald-500/10 rounded-2xl">
          <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Top Exchange Rates
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Most popular currency pairs
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-700/50 rounded-2xl animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div>
                  <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-24 h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {topPairsData?.pairs?.map((pair: any) => {
            const trend = getTrendData();
            return (
              <div
                key={`${pair.from}-${pair.to}`}
                className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 cursor-pointer group hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {pair.from}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {pair.to}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {pair.from}/{pair.to}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrencySymbol(pair.from)} to {getCurrencySymbol(pair.to)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatRate(pair.rate)}
                  </p>
                  <div className={`flex items-center space-x-1 text-sm ${
                    trend.isPositive 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {trend.isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{trend.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 text-center">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          View All Rates
        </button>
      </div>
    </div>
  );
};

export default TopPairs;
