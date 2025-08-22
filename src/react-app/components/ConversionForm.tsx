import React, { useState, useEffect } from 'react';
import { ArrowUpDown, TrendingUp } from 'lucide-react';
import CurrencySelector from './CurrencySelector';
import { useCurrencyConversion } from '@/react-app/hooks/useCurrency';
import { SUPPORTED_CURRENCIES } from '@/shared/types';

const ConversionForm: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1000');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);

  const conversionMutation = useCurrencyConversion();

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    try {
      const result = await conversionMutation.mutateAsync({
        from: fromCurrency,
        to: toCurrency,
        amount: parseFloat(amount),
      });
      setConvertedAmount(result.converted);
      setExchangeRate(result.rate);
    } catch (error) {
      console.error('Conversion failed:', error);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const timer = setTimeout(() => {
        handleConvert();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fromCurrency, toCurrency, amount]);

  const toCurrencyData = SUPPORTED_CURRENCIES.find(c => c.code === toCurrency);

  return (
    <div className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Currency Converter
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* From Currency */}
        <div>
          <CurrencySelector
            selectedCurrency={fromCurrency}
            onCurrencySelect={setFromCurrency}
            label="From"
          />
          <div className="mt-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl text-2xl font-semibold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-lg"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapCurrencies}
            className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowUpDown className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* To Currency */}
        <div>
          <CurrencySelector
            selectedCurrency={toCurrency}
            onCurrencySelect={setToCurrency}
            label="To"
          />
          <div className="mt-3">
            <div className="w-full p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {toCurrencyData?.symbol}{formatAmount(convertedAmount)}
              </div>
              {exchangeRate > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  1 {fromCurrency} = {formatAmount(exchangeRate)} {toCurrency}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {conversionMutation.isPending && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Converting...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionForm;
