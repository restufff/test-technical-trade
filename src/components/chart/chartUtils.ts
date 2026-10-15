import { CandlestickData } from '@/types/trading';

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '1D';

const TIMEFRAME_MS: Record<Timeframe, number> = {
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '1D': 24 * 60 * 60 * 1000,
};

/**
 * Generate synthetic historical candles for visualization
 */
export function generateHistoricalCandles(
  basePrice: number,
  timeframe: Timeframe = '15m',
  count: number = 40
): CandlestickData[] {
  const candles: CandlestickData[] = [];
  const interval = TIMEFRAME_MS[timeframe];
  const now = Date.now();

  let currentPrice = basePrice * (1 - 0.02 + Math.random() * 0.04);

  for (let i = count - 1; i >= 0; i--) {
    const time = now - i * interval;
    const volatility = 0.004; // 0.4% per candle
    const open = currentPrice;

    const change = (Math.random() - 0.49) * 2 * volatility * open;
    const close = Math.max(1, Math.round(open + change));

    const wickHigh = Math.random() * volatility * open * 1.5;
    const wickLow = Math.random() * volatility * open * 1.5;

    const high = Math.round(Math.max(open, close) + wickHigh);
    const low = Math.max(1, Math.round(Math.min(open, close) - wickLow));

    const baseVol = basePrice > 1000000 ? 5 : 5000;
    const volume = Number((baseVol * (0.5 + Math.random() * 1.8)).toFixed(2));

    candles.push({
      time,
      open,
      high,
      low,
      close,
      volume,
    });

    currentPrice = close;
  }

  // Ensure last candle close is near basePrice
  const last = candles[candles.length - 1];
  last.close = basePrice;
  last.high = Math.max(last.high, basePrice);
  last.low = Math.min(last.low, basePrice);

  return candles;
}

/**
 * Update current open candle on price tick
 */
export function updateLatestCandle(
  candles: CandlestickData[],
  latestPrice: number
): CandlestickData[] {
  if (candles.length === 0) return candles;

  const copy = [...candles];
  const last = { ...copy[copy.length - 1] };

  last.close = latestPrice;
  last.high = Math.max(last.high, latestPrice);
  last.low = Math.min(last.low, latestPrice);
  last.volume += Number((Math.random() * 0.5).toFixed(2));

  copy[copy.length - 1] = last;
  return copy;
}

/**
 * Calculate bounds and scale for drawing chart
 */
export function calculateChartBounds(candles: CandlestickData[]): {
  minPrice: number;
  maxPrice: number;
  maxVolume: number;
} {
  if (candles.length === 0) {
    return { minPrice: 0, maxPrice: 100, maxVolume: 100 };
  }

  let min = candles[0].low;
  let max = candles[0].high;
  let maxVol = candles[0].volume;

  for (const c of candles) {
    if (c.low < min) min = c.low;
    if (c.high > max) max = c.high;
    if (c.volume > maxVol) maxVol = c.volume;
  }

  // Add 4% vertical margin to top and bottom
  const diff = max - min || 1;
  const margin = diff * 0.04;

  return {
    minPrice: Math.max(1, Math.round(min - margin)),
    maxPrice: Math.round(max + margin),
    maxVolume: maxVol * 1.2 || 10,
  };
}
