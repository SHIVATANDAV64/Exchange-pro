import z from "zod";

export const CurrencySchema = z.object({
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
});

export const ExchangeRateSchema = z.object({
  base_currency: z.string(),
  target_currency: z.string(),
  rate: z.number(),
  rate_date: z.string(),
});

export const HistoricalRateSchema = z.object({
  base_currency: z.string(),
  target_currency: z.string(),
  rate: z.number(),
  timestamp: z.string(),
});

export const ConversionRequestSchema = z.object({
  from: z.string(),
  to: z.string(),
  amount: z.number(),
});

export const ConversionResponseSchema = z.object({
  from: z.string(),
  to: z.string(),
  amount: z.number(),
  converted: z.number(),
  rate: z.number(),
});

export type Currency = z.infer<typeof CurrencySchema>;
export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;
export type HistoricalRate = z.infer<typeof HistoricalRateSchema>;
export type ConversionRequest = z.infer<typeof ConversionRequestSchema>;
export type ConversionResponse = z.infer<typeof ConversionResponseSchema>;

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
];
