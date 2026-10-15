import { describe, it, expect } from 'vitest';
import { generateInitialOrderBook, generateInitialTrades, simulatePriceTick } from '../marketGenerator';
import { INITIAL_PAIRS } from '../../data/mockMarkets';

describe('Market Generator', () => {
  const btcPair = INITIAL_PAIRS[0];

  describe('generateInitialOrderBook', () => {
    it('creates valid bids below market price and asks above market price', () => {
      const orderBook = generateInitialOrderBook(btcPair, 10);

      expect(orderBook.bids.length).toBe(10);
      expect(orderBook.asks.length).toBe(10);

      // Best bid must be lower than best ask
      expect(orderBook.bids[0].price).toBeLessThan(orderBook.asks[0].price);
      expect(orderBook.spread).toBeGreaterThan(0);

      // Bids must be sorted descending
      for (let i = 0; i < orderBook.bids.length - 1; i++) {
        expect(orderBook.bids[i].price).toBeGreaterThan(orderBook.bids[i + 1].price);
      }

      // Asks must be sorted ascending
      for (let i = 0; i < orderBook.asks.length - 1; i++) {
        expect(orderBook.asks[i].price).toBeLessThan(orderBook.asks[i + 1].price);
      }

      // Depth percent should be between 0 and 100
      orderBook.bids.forEach((entry) => {
        expect(entry.depthPercent).toBeGreaterThanOrEqual(0);
        expect(entry.depthPercent).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('generateInitialTrades', () => {
    it('generates chronological market trades', () => {
      const trades = generateInitialTrades(btcPair, 15);
      expect(trades.length).toBe(15);
      expect(trades[0].price).toBeGreaterThan(0);
      expect(trades[0].amount).toBeGreaterThan(0);
      expect(['BUY', 'SELL']).toContain(trades[0].side);
    });
  });

  describe('simulatePriceTick', () => {
    it('generates realistic price tick and updates orderbook', () => {
      const initialBook = generateInitialOrderBook(btcPair, 10);
      const result = simulatePriceTick(btcPair, initialBook);

      expect(result.updatedPair).toBeDefined();
      expect(result.updatedOrderBook.bids.length).toBe(10);
      expect(result.newTrade).toBeDefined();
      expect(['up', 'down']).toContain(result.priceDirection);
    });
  });
});
