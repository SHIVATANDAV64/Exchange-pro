import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Currency, SUPPORTED_CURRENCIES } from '@/shared/types';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencySelect: (currency: string) => void;
  label: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencySelect,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCurrencyData = SUPPORTED_CURRENCIES.find(c => c.code === selectedCurrency);
  
  const filteredCurrencies = SUPPORTED_CURRENCIES.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (currency: Currency) => {
    onCurrencySelect(currency.code);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-between hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{selectedCurrencyData?.symbol}</span>
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {selectedCurrencyData?.code}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCurrencyData?.name}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-h-80 overflow-hidden">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search currencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleSelect(currency)}
                  className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <span className="text-2xl">{currency.symbol}</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {currency.code}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currency.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencySelector;
