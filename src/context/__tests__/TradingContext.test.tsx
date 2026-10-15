import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../AuthContext';
import { MarketProvider } from '../MarketContext';
import { TradingProvider, useTrading } from '../TradingContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <MarketProvider autoTick={false}>
      <TradingProvider>{children}</TradingProvider>
    </MarketProvider>
  </AuthProvider>
);

describe('TradingContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default mock balances', () => {
    const { result } = renderHook(() => useTrading(), { wrapper });
    expect(result.current.balances.IDR.available).toBe(50000000);
    expect(result.current.balances.BTC.available).toBe(0.05);
    expect(result.current.openOrders).toEqual([]);
  });

  it('executes Market Buy order immediately and deducts IDR and adds crypto', async () => {
    const { result: authResult } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await authResult.current.login('demo@indodax.mock', 'password123');
    });

    const { result } = renderHook(() => useTrading(), { wrapper });
    const initialIDR = result.current.balances.IDR.available;
    const initialBTC = result.current.balances.BTC.available;

    let orderRes;
    await act(async () => {
      orderRes = await result.current.placeOrder({
        pairId: 'btc_idr',
        side: 'BUY',
        type: 'MARKET',
        price: 1000000000,
        amount: 0.01,
      });
    });

    expect(orderRes?.success).toBe(true);
    // Cost = 10,000,000 + 0.1% fee = 10,010,000
    expect(result.current.balances.IDR.available).toBeLessThan(initialIDR);
    expect(result.current.balances.BTC.available).toBeCloseTo(initialBTC + 0.01, 6);
    expect(result.current.orderHistory.length).toBe(1);
    expect(result.current.orderHistory[0].status).toBe('FILLED');
  });

  it('places Limit Sell order, locks crypto, and allows cancellation', async () => {
    const { result: authResult } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await authResult.current.login('demo@indodax.mock', 'password123');
    });

    const { result } = renderHook(() => useTrading(), { wrapper });
    const initialBTC = result.current.balances.BTC.available;

    let orderRes;
    await act(async () => {
      orderRes = await result.current.placeOrder({
        pairId: 'btc_idr',
        side: 'SELL',
        type: 'LIMIT',
        price: 1200000000,
        amount: 0.02,
      });
    });

    expect(orderRes?.success).toBe(true);
    // 0.02 BTC should be locked
    expect(result.current.balances.BTC.available).toBeCloseTo(initialBTC - 0.02, 6);
    expect(result.current.balances.BTC.locked).toBeCloseTo(0.02, 6);
    expect(result.current.openOrders.length).toBe(1);

    const orderId = result.current.openOrders[0].id;

    // Now cancel the order
    act(() => {
      result.current.cancelOrder(orderId);
    });

    // 0.02 BTC should be unlocked back to available
    expect(result.current.balances.BTC.available).toBeCloseTo(initialBTC, 6);
    expect(result.current.balances.BTC.locked).toBe(0);
    expect(result.current.openOrders.length).toBe(0);
    expect(result.current.orderHistory.find((o) => o.id === orderId)?.status).toBe('CANCELLED');
  });

  it('rejects order when available balance is insufficient', async () => {
    const { result: authResult } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await authResult.current.login('demo@indodax.mock', 'password123');
    });

    const { result } = renderHook(() => useTrading(), { wrapper });

    let orderRes;
    await act(async () => {
      orderRes = await result.current.placeOrder({
        pairId: 'btc_idr',
        side: 'BUY',
        type: 'LIMIT',
        price: 1000000000,
        amount: 100, // costs 100 Billion IDR, far exceeding balance
      });
    });

    expect(orderRes?.success).toBe(false);
    expect(orderRes?.message).toContain('Saldo IDR tidak mencukupi');
    expect(result.current.openOrders.length).toBe(0);
  });

  it('allows depositing funds via faucet simulation', () => {
    const { result } = renderHook(() => useTrading(), { wrapper });
    const initialIDR = result.current.balances.IDR.available;

    act(() => {
      result.current.depositFunds(10000000);
    });

    expect(result.current.balances.IDR.available).toBe(initialIDR + 10000000);
  });
});
