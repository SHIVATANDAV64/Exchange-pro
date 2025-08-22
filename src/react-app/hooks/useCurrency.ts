import { useQuery, useMutation } from '@tanstack/react-query';
import { ConversionRequest, ConversionResponse } from '@/shared/types';

// Fetch current exchange rates
export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async () => {
      const response = await fetch('/api/rates');
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      return response.json();
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};

// Convert currency
export const useCurrencyConversion = () => {
  return useMutation({
    mutationFn: async (request: ConversionRequest): Promise<ConversionResponse> => {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error('Failed to convert currency');
      return response.json();
    },
  });
};

// Fetch historical rates
export const useHistoricalRates = (base: string, target: string, period: string) => {
  return useQuery({
    queryKey: ['historical-rates', base, target, period],
    queryFn: async () => {
      const response = await fetch(`/api/history/${base}/${target}/${period}`);
      if (!response.ok) throw new Error('Failed to fetch historical rates');
      return response.json();
    },
    enabled: !!(base && target && period),
    staleTime: 300000, // Consider data fresh for 5 minutes
  });
};

// Fetch top currency pairs
export const useTopPairs = () => {
  return useQuery({
    queryKey: ['top-pairs'],
    queryFn: async () => {
      const response = await fetch('/api/top-pairs');
      if (!response.ok) throw new Error('Failed to fetch top pairs');
      return response.json();
    },
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 60000, // Consider data fresh for 1 minute
  });
};
