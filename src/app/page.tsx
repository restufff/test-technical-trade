'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { MarketProvider } from '@/context/MarketContext';
import { TradingProvider } from '@/context/TradingContext';
import { ToastProvider } from '@/components/ui/ToastNotification';

import Navbar from '@/components/layout/Navbar';
import MarketTickerBar from '@/components/market/MarketTickerBar';
import TradingChart from '@/components/chart/TradingChart';
import OrderBook from '@/components/orderbook/OrderBook';
import MarketTrades from '@/components/orderbook/MarketTrades';
import TradingForm from '@/components/trading/TradingForm';
import OrdersTable from '@/components/orders/OrdersTable';
import Footer from '@/components/layout/Footer';

import LoginModal from '@/components/auth/LoginModal';
import UserProfileModal from '@/components/auth/UserProfileModal';
import DepositFaucetModal from '@/components/portfolio/DepositFaucetModal';

function ExchangeContent() {
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'orderbook' | 'trades'>('orderbook');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSelectPrice = (price: number) => {
    setSelectedPrice(price);
  };

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0b111e] text-gray-100">
        <Navbar />
        <MarketTickerBar />
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indodax-cyan border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400 font-semibold tracking-wide">
              Memuat Indodax Trading Platform...
            </span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b111e] text-gray-100">
      {/* Top Fixed Navigation & 24h Ticker */}
      <Navbar />
      <MarketTickerBar />

      {/* Main Exchange Workspace Grid */}
      <main className="flex-grow max-w-[1920px] w-full mx-auto p-2 sm:p-3 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3">
        {/* Left / Center Section (Chart + Orders Table) - spans 8 cols on desktop */}
        <section className="lg:col-span-8 flex flex-col gap-2 sm:gap-3">
          {/* Chart Component */}
          <div className="h-[430px] sm:h-[480px] w-full">
            <TradingChart />
          </div>

          {/* User Orders & Portfolio Table */}
          <div className="flex-grow min-h-[300px]">
            <OrdersTable />
          </div>
        </section>

        {/* Right Section (Order Book / Trades + Trading Form) - spans 4 cols on desktop */}
        <section className="lg:col-span-4 flex flex-col gap-2 sm:gap-3">
          {/* Tab Switcher for Orderbook vs Market Trades */}
          <div className="h-[400px] flex flex-col min-h-0">
            <div className="flex items-center space-x-1 mb-1.5 px-1 shrink-0">
              <button
                onClick={() => setRightPanelTab('orderbook')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  rightPanelTab === 'orderbook'
                    ? 'bg-[#18243c] text-indodax-cyan border border-indodax-cyan/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#131c2e]'
                }`}
              >
                Order Book
              </button>
              <button
                onClick={() => setRightPanelTab('trades')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  rightPanelTab === 'trades'
                    ? 'bg-[#18243c] text-indodax-cyan border border-indodax-cyan/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#131c2e]'
                }`}
              >
                Market Trades
              </button>
            </div>

            <div className="flex-grow min-h-0">
              {rightPanelTab === 'orderbook' ? (
                <OrderBook
                  onSelectPrice={handleSelectPrice}
                  onSelectAmount={handleSelectAmount}
                />
              ) : (
                <MarketTrades />
              )}
            </div>
          </div>

          {/* Buy / Sell Trading Form Entry Widget */}
          <div className="flex-grow shrink-0">
            <TradingForm
              selectedPrice={selectedPrice}
              selectedAmount={selectedAmount}
            />
          </div>
        </section>
      </main>

      {/* Global Modals */}
      <LoginModal />
      <UserProfileModal />
      <DepositFaucetModal />

      {/* Modern Footer */}
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MarketProvider autoTick={true}>
          <TradingProvider>
            <ExchangeContent />
          </TradingProvider>
        </MarketProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
