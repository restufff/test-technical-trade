'use client';

import React, { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import { formatIDR, formatCrypto, formatPercent } from '@/utils/formatters';
import PairSelectorModal from './PairSelectorModal';
import { ChevronDown, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function MarketTickerBar() {
  const { currentPair, priceFlash } = useMarket();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const isUp = currentPair.priceChange24h >= 0;

  return (
    <>
      <div className="w-full bg-[#0d1424] border-b border-[#18233c] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Pair Selector Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#142038] hover:bg-[#1a2b4c] border border-[#1f3152] hover:border-indodax-cyan/40 transition-all text-white font-bold"
          >
            <div className="w-6 h-6 rounded-full bg-indodax-cyan/20 flex items-center justify-center text-[10px] text-indodax-cyan font-black">
              {currentPair.baseAsset.substring(0, 3)}
            </div>
            <span className="text-sm font-bold tracking-wide">{currentPair.symbol}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <span className="text-xs text-gray-400 hidden sm:inline">{currentPair.name}</span>
        </div>

        {/* Center: Live Price & 24h Stats */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Last Price */}
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium">Harga Terakhir</span>
            <div
              className={`text-base font-bold tabular-nums transition-colors duration-300 ${
                priceFlash === 'up'
                  ? 'text-trading-buy'
                  : priceFlash === 'down'
                  ? 'text-trading-sell'
                  : isUp
                  ? 'text-trading-buy'
                  : 'text-trading-sell'
              }`}
            >
              {formatIDR(currentPair.lastPrice)}
            </div>
          </div>

          {/* 24h Change */}
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium">Perubahan 24j</span>
            <div
              className={`font-semibold flex items-center gap-1 tabular-nums ${
                isUp ? 'text-trading-buy' : 'text-trading-sell'
              }`}
            >
              {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {formatPercent(currentPair.priceChange24h)}
            </div>
          </div>

          {/* 24h High */}
          <div className="flex flex-col hidden md:flex">
            <span className="text-[10px] text-gray-400 font-medium">Tertinggi 24j</span>
            <span className="text-white font-medium tabular-nums">
              {formatIDR(currentPair.high24h)}
            </span>
          </div>

          {/* 24h Low */}
          <div className="flex flex-col hidden md:flex">
            <span className="text-[10px] text-gray-400 font-medium">Terendah 24j</span>
            <span className="text-white font-medium tabular-nums">
              {formatIDR(currentPair.low24h)}
            </span>
          </div>

          {/* 24h Volume IDR */}
          <div className="flex flex-col hidden lg:flex">
            <span className="text-[10px] text-gray-400 font-medium">Volume 24j (IDR)</span>
            <span className="text-gray-200 font-medium tabular-nums">
              {formatIDR(currentPair.volume24h)}
            </span>
          </div>

          {/* 24h Base Volume */}
          <div className="flex flex-col hidden xl:flex">
            <span className="text-[10px] text-gray-400 font-medium">Volume ({currentPair.baseAsset})</span>
            <span className="text-gray-200 font-medium tabular-nums">
              {formatCrypto(currentPair.baseVolume24h, 2)} {currentPair.baseAsset}
            </span>
          </div>
        </div>

        {/* Right: Live Status Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded bg-[#131d31] border border-[#1d2b45] text-[11px] text-gray-400">
          <Activity className="w-3 h-3 text-trading-buy animate-pulse" />
          <span className="text-trading-buy font-medium">Live Feed</span>
        </div>
      </div>

      <PairSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />
    </>
  );
}
