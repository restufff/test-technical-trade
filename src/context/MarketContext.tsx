'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { TradingPair, OrderBook, MarketTrade } from '../types/trading';
import { INITIAL_PAIRS } from '../data/mockMarkets';
import { generateInitialOrderBook, generateInitialTrades, simulatePriceTick } from '../utils/marketGenerator';

interface MarketContextType {
  pairs: TradingPair[];
  currentPair: TradingPair;
  setPair: (pairId: string) => void;
  orderBook: OrderBook;
  recentTrades: MarketTrade[];
  priceFlash: 'up' | 'down' | null;
  triggerManualPriceTick?: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({
  children,
  initialPairs = INITIAL_PAIRS,
  autoTick = true,
}: {
  children: ReactNode;
  initialPairs?: TradingPair[];
  autoTick?: boolean;
}) {
  const [pairs, setPairs] = useState<TradingPair[]>(initialPairs);
  const [currentPairId, setCurrentPairId] = useState<string>(initialPairs[0].id);
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);

  const currentPair = pairs.find((p) => p.id === currentPairId) || pairs[0];

  const [orderBook, setOrderBook] = useState<OrderBook>(() =>
    generateInitialOrderBook(currentPair)
  );

  const [recentTrades, setRecentTrades] = useState<MarketTrade[]>(() =>
    generateInitialTrades(currentPair)
  );

  // Keep ref to avoid stale closures in interval
  const currentPairRef = useRef<TradingPair>(currentPair);
  currentPairRef.current = currentPair;
  const orderBookRef = useRef<OrderBook>(orderBook);
  orderBookRef.current = orderBook;

  // Switch pair handler
  const setPair = useCallback((pairId: string) => {
    const found = pairs.find((p) => p.id === pairId);
    if (!found) return;
    setCurrentPairId(pairId);
    setOrderBook(generateInitialOrderBook(found));
    setRecentTrades(generateInitialTrades(found));
    setPriceFlash(null);
  }, [pairs]);

  // Execute tick
  const executeTick = useCallback(() => {
    const pair = currentPairRef.current;
    const book = orderBookRef.current;

    const { updatedPair, updatedOrderBook, newTrade, priceDirection } = simulatePriceTick(pair, book);

    // Update current pair in pairs array
    setPairs((prev) =>
      prev.map((p) => (p.id === updatedPair.id ? updatedPair : p))
    );
    setOrderBook(updatedOrderBook);
    setRecentTrades((prev) => [newTrade, ...prev.slice(0, 39)]);

    setPriceFlash(priceDirection);
    setTimeout(() => {
      setPriceFlash(null);
    }, 800);
  }, []);

  // Interval timer for live market data
  useEffect(() => {
    if (!autoTick) return;

    const interval = setInterval(() => {
      executeTick();
    }, 2800);

    return () => clearInterval(interval);
  }, [autoTick, executeTick]);

  return (
    <MarketContext.Provider
      value={{
        pairs,
        currentPair,
        setPair,
        orderBook,
        recentTrades,
        priceFlash,
        triggerManualPriceTick: executeTick,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket(): MarketContextType {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}
