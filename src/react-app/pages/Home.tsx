import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import ThemeToggle from '@/react-app/components/ThemeToggle';
import ConversionForm from '@/react-app/components/ConversionForm';
import HistoricalChart from '@/react-app/components/HistoricalChart';
import TopPairs from '@/react-app/components/TopPairs';

export default function Home() {
  const [baseCurrency] = useState('USD');
  const [targetCurrency] = useState('EUR');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Exchange Pro
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Professional currency converter
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Conversion Form */}
          <div>
            <ConversionForm />
          </div>

          {/* Top Pairs */}
          <div>
            <TopPairs />
          </div>
        </div>

        {/* Historical Chart */}
        <div className="mb-12">
          <HistoricalChart 
            baseCurrency={baseCurrency}
            targetCurrency={targetCurrency}
          />
        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Real-time exchange rates powered by Exchange Pro
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Data refreshed every minute • Support for 12+ currencies including crypto
            </p>
          </div>
        </footer>
      </main>

      {/* Floating Elements for Visual Appeal */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
    </div>
  );
}
