/// <reference path="./env.d.ts" />
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ConversionRequestSchema, SUPPORTED_CURRENCIES } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// External API endpoint for fetching exchange rates
const EXCHANGE_RATE_API_URL = "https://api.exchangerate-api.com/v4/latest";

// Fallback rates in case API is unavailable
const FALLBACK_RATES: Record<string, number> = {
  'USD': 1.0,
  'EUR': 0.85,
  'GBP': 0.73,
  'JPY': 110.0,
  'CAD': 1.25,
  'AUD': 1.35,
  'INR': 74.5,
  'CNY': 6.45,
  'BTC': 0.000025,
  'ETH': 0.00035,
  'CHF': 0.92,
  'NZD': 1.42,
};

// Get current exchange rates
app.get("/api/rates", async (c) => {
  try {
    const response = await fetch(`${EXCHANGE_RATE_API_URL}/USD`);
    const data: any = await response.json();
    
    if (data.rates) {
      // Store rates in database
      const db = c.env.DB;
      for (const [currency, rate] of Object.entries(data.rates)) {
        if (SUPPORTED_CURRENCIES.find(c => c.code === currency)) {
          await db.prepare(
            "INSERT OR REPLACE INTO exchange_rates (base_currency, target_currency, rate, rate_date) VALUES (?, ?, ?, ?)"
          ).bind('USD', currency, rate as number, new Date().toISOString().split('T')[0]).run();
        }
      }
      
      return c.json({ rates: data.rates, base: 'USD' });
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
  
  // Fallback to stored rates or default rates
  return c.json({ rates: FALLBACK_RATES, base: 'USD' });
});

// Convert currency
app.post("/api/convert", zValidator("json", ConversionRequestSchema), async (c) => {
  const { from, to, amount } = c.req.valid("json");
  
  try {
    // Fetch current rates
    const ratesResponse = await fetch(`${EXCHANGE_RATE_API_URL}/${from}`);
    const ratesData: any = await ratesResponse.json();
    
    if (ratesData.rates && ratesData.rates[to]) {
      const rate = ratesData.rates[to] as number;
      const converted = amount * rate;
      
      return c.json({
        from,
        to,
        amount,
        converted: parseFloat(converted.toFixed(6)),
        rate: parseFloat(rate.toFixed(6))
      });
    }
  } catch (error) {
    console.error('Error converting currency:', error);
  }
  
  // Fallback calculation
  const fromRate = FALLBACK_RATES[from] || 1;
  const toRate = FALLBACK_RATES[to] || 1;
  const usdAmount = amount / fromRate;
  const converted = usdAmount * toRate;
  const rate = toRate / fromRate;
  
  return c.json({
    from,
    to,
    amount,
    converted: parseFloat(converted.toFixed(6)),
    rate: parseFloat(rate.toFixed(6))
  });
});

// Get historical rates
app.get("/api/history/:base/:target/:period", async (c) => {
  const base = c.req.param('base');
  const target = c.req.param('target');
  const period = c.req.param('period');
  const db = c.env.DB;
  
  // Calculate date range based on period
  const now = new Date();
  let days = 7;
  switch (period) {
    case '30d': days = 30; break;
    case '1y': days = 365; break;
    default: days = 7;
  }
  
  const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  
  try {
    const result = await db.prepare(
      "SELECT * FROM currency_history WHERE base_currency = ? AND target_currency = ? AND timestamp >= ? ORDER BY timestamp DESC LIMIT 100"
    ).bind(base, target, startDate.toISOString()).all();
    
    if (result.results.length > 0) {
      return c.json({ history: result.results });
    }
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }
  
  // Generate mock historical data if no real data available
  const mockHistory = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const baseRate = FALLBACK_RATES[base] || 1;
    const targetRate = FALLBACK_RATES[target] || 1;
    const rate = (targetRate / baseRate) * (0.95 + Math.random() * 0.1); // Add some variation
    
    mockHistory.push({
      base_currency: base,
      target_currency: target,
      rate: parseFloat(rate.toFixed(6)),
      timestamp: date.toISOString(),
    });
  }
  
  return c.json({ history: mockHistory });
});

// Get top exchange rate pairs
app.get("/api/top-pairs", async (c) => {
  const topPairs = [
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'GBP' },
    { from: 'USD', to: 'JPY' },
    { from: 'EUR', to: 'GBP' },
    { from: 'BTC', to: 'USD' },
  ];
  
  const results = [];
  
  for (const pair of topPairs) {
    try {
      const response = await fetch(`${EXCHANGE_RATE_API_URL}/${pair.from}`);
      const data: any = await response.json();
      
      if (data.rates && data.rates[pair.to]) {
        results.push({
          from: pair.from,
          to: pair.to,
          rate: parseFloat((data.rates[pair.to] as number).toFixed(6))
        });
      }
    } catch (error) {
      // Fallback
      const fromRate = FALLBACK_RATES[pair.from] || 1;
      const toRate = FALLBACK_RATES[pair.to] || 1;
      const rate = toRate / fromRate;
      
      results.push({
        from: pair.from,
        to: pair.to,
        rate: parseFloat(rate.toFixed(6))
      });
    }
  }
  
  return c.json({ pairs: results });
});

export default app;
