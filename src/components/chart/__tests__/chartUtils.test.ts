import { describe, it, expect } from 'vitest';
import {
  generateHistoricalCandles,
  updateLatestCandle,
  calculateChartBounds,
} from '../chartUtils';

describe('Chart Utilities', () => {
  describe('generateHistoricalCandles', () => {
    it('generates the specified number of valid OHLCV candles', () => {
      const candles = generateHistoricalCandles(1000000000, '15m', 30);
      expect(candles.length).toBe(30);

      candles.forEach((c) => {
        expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
        expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
        expect(c.volume).toBeGreaterThan(0);
        expect(c.time).toBeGreaterThan(0);
      });
    });
  });

  describe('updateLatestCandle', () => {
    it('updates current candle close, high, and low on live tick', () => {
      const initial = generateHistoricalCandles(1000000000, '15m', 10);
      const last = initial[initial.length - 1];

      const newHighPrice = last.high + 5000000;
      const updated = updateLatestCandle(initial, newHighPrice);

      const updatedLast = updated[updated.length - 1];
      expect(updatedLast.close).toBe(newHighPrice);
      expect(updatedLast.high).toBe(newHighPrice);
    });
  });

  describe('calculateChartBounds', () => {
    it('accurately computes min, max price with margin and max volume', () => {
      const candles = generateHistoricalCandles(1000000000, '15m', 20);
      const bounds = calculateChartBounds(candles);

      expect(bounds.maxPrice).toBeGreaterThan(bounds.minPrice);
      expect(bounds.maxVolume).toBeGreaterThan(0);
    });
  });
});
