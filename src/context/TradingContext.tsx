'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Order, OrderSide, OrderType, WalletBalances } from '../types/trading';
import { DEFAULT_USER_BALANCES } from '../data/mockMarkets';
import { useMarket } from './MarketContext';
import { useAuth } from './AuthContext';

interface PlaceOrderParams {
  pairId: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  amount: number;
}

interface TradingContextType {
  balances: WalletBalances;
  openOrders: Order[];
  orderHistory: Order[];
  placeOrder: (params: PlaceOrderParams) => Promise<{ success: boolean; message: string; order?: Order }>;
  cancelOrder: (orderId: string) => { success: boolean; message: string };
  depositFunds: (amountIDR: number) => void;
  resetBalances: () => void;
  totalPortfolioIDR: number;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
}

const BALANCES_KEY = 'indodax_wallet_balances';
const OPEN_ORDERS_KEY = 'indodax_open_orders';
const ORDER_HISTORY_KEY = 'indodax_order_history';

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const { pairs, currentPair } = useMarket();
  const { user, setIsLoginModalOpen } = useAuth();

  // Consistent initial state for SSR
  const [balances, setBalances] = useState<WalletBalances>(() =>
    JSON.parse(JSON.stringify(DEFAULT_USER_BALANCES))
  );
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount only
  useEffect(() => {
    try {
      const savedBal = localStorage.getItem(BALANCES_KEY);
      if (savedBal) setBalances(JSON.parse(savedBal));

      const savedOrders = localStorage.getItem(OPEN_ORDERS_KEY);
      if (savedOrders) setOpenOrders(JSON.parse(savedOrders));

      const savedHistory = localStorage.getItem(ORDER_HISTORY_KEY);
      if (savedHistory) setOrderHistory(JSON.parse(savedHistory));
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  // Sync to localStorage after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(BALANCES_KEY, JSON.stringify(balances));
    } catch {
      // ignore
    }
  }, [balances, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(OPEN_ORDERS_KEY, JSON.stringify(openOrders));
    } catch {
      // ignore
    }
  }, [openOrders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orderHistory));
    } catch {
      // ignore
    }
  }, [orderHistory, isHydrated]);

  // Compute Total Portfolio in IDR
  const totalPortfolioIDR = React.useMemo(() => {
    let total = (balances.IDR?.available || 0) + (balances.IDR?.locked || 0);

    pairs.forEach((pair) => {
      const assetBalance = balances[pair.baseAsset];
      if (assetBalance) {
        const assetTotal = (assetBalance.available || 0) + (assetBalance.locked || 0);
        total += assetTotal * pair.lastPrice;
      }
    });

    return Math.round(total);
  }, [balances, pairs]);

  // Check and auto-fill open limit orders when price updates
  useEffect(() => {
    if (openOrders.length === 0) return;

    let ordersChanged = false;
    const remainingOpen: Order[] = [];
    const filledOrders: Order[] = [];
    const updatedBalances = { ...balances };

    openOrders.forEach((order) => {
      const pair = pairs.find((p) => p.id === order.pairId);
      if (!pair) {
        remainingOpen.push(order);
        return;
      }

      let isTriggered = false;
      if (order.side === 'BUY' && pair.lastPrice <= order.price) {
        isTriggered = true;
      } else if (order.side === 'SELL' && pair.lastPrice >= order.price) {
        isTriggered = true;
      }

      if (isTriggered) {
        ordersChanged = true;
        const filled: Order = {
          ...order,
          filledAmount: order.amount,
          status: 'FILLED',
        };
        filledOrders.push(filled);

        if (order.side === 'BUY') {
          const lockedAmount = order.total + order.fee;
          if (updatedBalances.IDR) {
            updatedBalances.IDR.locked = Math.max(0, updatedBalances.IDR.locked - lockedAmount);
          }
          if (!updatedBalances[pair.baseAsset]) {
            updatedBalances[pair.baseAsset] = { available: 0, locked: 0 };
          }
          updatedBalances[pair.baseAsset].available += order.amount;
        } else {
          if (updatedBalances[pair.baseAsset]) {
            updatedBalances[pair.baseAsset].locked = Math.max(
              0,
              updatedBalances[pair.baseAsset].locked - order.amount
            );
          }
          const netIDR = order.total - order.fee;
          if (!updatedBalances.IDR) {
            updatedBalances.IDR = { available: 0, locked: 0 };
          }
          updatedBalances.IDR.available += netIDR;
        }
      } else {
        remainingOpen.push(order);
      }
    });

    if (ordersChanged) {
      setOpenOrders(remainingOpen);
      setOrderHistory((prev) => [...filledOrders, ...prev]);
      setBalances(updatedBalances);
    }
  }, [pairs, openOrders, balances]);

  // Place order
  const placeOrder = useCallback(
    async (params: PlaceOrderParams): Promise<{ success: boolean; message: string; order?: Order }> => {
      if (!user) {
        setIsLoginModalOpen(true);
        return { success: false, message: 'Silakan masuk ke akun demo terlebih dahulu.' };
      }

      const { pairId, side, type, price, amount } = params;
      const pair = pairs.find((p) => p.id === pairId) || currentPair;

      if (!pair) {
        return { success: false, message: 'Pair trading tidak valid.' };
      }

      if (amount <= 0) {
        return { success: false, message: 'Jumlah aset harus lebih dari 0.' };
      }

      const total = Math.round(price * amount);
      if (total < pair.minOrderTotal) {
        return {
          success: false,
          message: `Minimal total order adalah Rp ${pair.minOrderTotal.toLocaleString('id-ID')}`,
        };
      }

      const feePercent = type === 'MARKET' ? pair.takerFeePercent : pair.makerFeePercent;
      const fee = Math.round(total * (feePercent / 100));

      const updatedBalances = { ...balances };
      if (!updatedBalances[pair.baseAsset]) {
        updatedBalances[pair.baseAsset] = { available: 0, locked: 0 };
      }
      if (!updatedBalances.IDR) {
        updatedBalances.IDR = { available: 0, locked: 0 };
      }

      // Balance validations
      if (side === 'BUY') {
        const requiredIDR = total + fee;
        if (updatedBalances.IDR.available < requiredIDR) {
          return {
            success: false,
            message: `Saldo IDR tidak mencukupi (Perlu Rp ${requiredIDR.toLocaleString('id-ID')}, Tersedia Rp ${Math.round(updatedBalances.IDR.available).toLocaleString('id-ID')})`,
          };
        }
      } else {
        if (updatedBalances[pair.baseAsset].available < amount) {
          return {
            success: false,
            message: `Saldo ${pair.baseAsset} tidak mencukupi (Perlu ${amount} ${pair.baseAsset}, Tersedia ${updatedBalances[pair.baseAsset].available} ${pair.baseAsset})`,
          };
        }
      }

      const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      if (type === 'MARKET') {
        if (side === 'BUY') {
          updatedBalances.IDR.available -= total + fee;
          updatedBalances[pair.baseAsset].available += amount;
        } else {
          updatedBalances[pair.baseAsset].available -= amount;
          updatedBalances.IDR.available += total - fee;
        }

        const newOrder: Order = {
          id: orderId,
          pairId: pair.id,
          side,
          type,
          price,
          amount,
          filledAmount: amount,
          total,
          fee,
          status: 'FILLED',
          createdAt: Date.now(),
        };

        setBalances(updatedBalances);
        setOrderHistory((prev) => [newOrder, ...prev]);

        return {
          success: true,
          message: `Order Market ${side} ${amount} ${pair.baseAsset} berhasil dieksekusi!`,
          order: newOrder,
        };
      } else {
        if (side === 'BUY') {
          const lockIDR = total + fee;
          updatedBalances.IDR.available -= lockIDR;
          updatedBalances.IDR.locked += lockIDR;
        } else {
          updatedBalances[pair.baseAsset].available -= amount;
          updatedBalances[pair.baseAsset].locked += amount;
        }

        const newOrder: Order = {
          id: orderId,
          pairId: pair.id,
          side,
          type,
          price,
          amount,
          filledAmount: 0,
          total,
          fee,
          status: 'OPEN',
          createdAt: Date.now(),
        };

        setBalances(updatedBalances);
        setOpenOrders((prev) => [newOrder, ...prev]);

        return {
          success: true,
          message: `Order Limit ${side} ${amount} ${pair.baseAsset} berhasil dibuat!`,
          order: newOrder,
        };
      }
    },
    [user, pairs, currentPair, balances, setIsLoginModalOpen]
  );

  // Cancel order
  const cancelOrder = useCallback(
    (orderId: string): { success: boolean; message: string } => {
      const order = openOrders.find((o) => o.id === orderId);
      if (!order) {
        return { success: false, message: 'Order tidak ditemukan atau sudah selesai.' };
      }

      const pair = pairs.find((p) => p.id === order.pairId) || currentPair;
      const updatedBalances = { ...balances };

      if (order.side === 'BUY') {
        const lockedIDR = order.total + order.fee;
        if (updatedBalances.IDR) {
          updatedBalances.IDR.locked = Math.max(0, updatedBalances.IDR.locked - lockedIDR);
          updatedBalances.IDR.available += lockedIDR;
        }
      } else {
        if (updatedBalances[pair.baseAsset]) {
          updatedBalances[pair.baseAsset].locked = Math.max(
            0,
            updatedBalances[pair.baseAsset].locked - order.amount
          );
          updatedBalances[pair.baseAsset].available += order.amount;
        }
      }

      const cancelledOrder: Order = {
        ...order,
        status: 'CANCELLED',
      };

      setBalances(updatedBalances);
      setOpenOrders((prev) => prev.filter((o) => o.id !== orderId));
      setOrderHistory((prev) => [cancelledOrder, ...prev]);

      return { success: true, message: 'Order berhasil dibatalkan.' };
    },
    [openOrders, pairs, currentPair, balances]
  );

  // Faucet Deposit
  const depositFunds = useCallback((amountIDR: number) => {
    setBalances((prev) => ({
      ...prev,
      IDR: {
        available: (prev.IDR?.available || 0) + amountIDR,
        locked: prev.IDR?.locked || 0,
      },
    }));
  }, []);

  // Reset to default
  const resetBalances = useCallback(() => {
    setBalances(JSON.parse(JSON.stringify(DEFAULT_USER_BALANCES)));
    setOpenOrders([]);
    setOrderHistory([]);
    try {
      localStorage.removeItem(BALANCES_KEY);
      localStorage.removeItem(OPEN_ORDERS_KEY);
      localStorage.removeItem(ORDER_HISTORY_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <TradingContext.Provider
      value={{
        balances,
        openOrders,
        orderHistory,
        placeOrder,
        cancelOrder,
        depositFunds,
        resetBalances,
        totalPortfolioIDR,
        isDepositModalOpen,
        setIsDepositModalOpen,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading(): TradingContextType {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}
