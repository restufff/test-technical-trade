'use client';

import React, { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import { formatIDR, formatCrypto } from '@/utils/formatters';
import { TrendingUp, TrendingDown, Layers } from 'lucide-react';

interface OrderBookProps {
  onSelectPrice?: (price: number) => void;
  onSelectAmount?: (amount: number) => void;
}

export default function OrderBook({ onSelectPrice, onSelectAmount }: OrderBookProps) {
  const { currentPair, orderBook, priceFlash } = useMarket();
  const [viewMode, setViewMode] = useState<'both' | 'bids' | 'asks'>('both');

  const visibleCount = viewMode === 'both' ? 12 : 24;
  const asksToDisplay = [...orderBook.asks.slice(0, visibleCount)].reverse();
  const bidsToDisplay = orderBook.bids.slice(0, visibleCount);

  const isUp = currentPair.priceChange24h >= 0;

  const handleRowClick = (price: number, amount: number) => {
    if (onSelectPrice) onSelectPrice(price);
    if (onSelectAmount) onSelectAmount(amount);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0f172a] rounded-xl border border-[#1e2d4a] overflow-hidden select-none">
      {/* Header & View Mode Switcher (Fixed) */}
      <div className="px-3 py-2 border-b border-[#18233c] flex items-center justify-between bg-[#0d1424] shrink-0">
        <div className="flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-indodax-cyan" />
          <h3 className="text-xs font-bold text-white tracking-wide">Order Book</h3>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setViewMode('both')}
            title="Tampilkan Bids & Asks"
            className={`w-6 h-5 rounded flex flex-col items-center justify-center gap-0.5 transition-colors ${
              viewMode === 'both' ? 'bg-[#18243c] border border-indodax-cyan/40' : 'hover:bg-[#131c2e]'
            }`}
          >
            <div className="w-3.5 h-1 bg-trading-sell rounded-sm" />
            <div className="w-3.5 h-1 bg-trading-buy rounded-sm" />
          </button>
          <button
            onClick={() => setViewMode('bids')}
            title="Hanya Bids (Beli)"
            className={`w-6 h-5 rounded flex flex-col items-center justify-center gap-0.5 transition-colors ${
              viewMode === 'bids' ? 'bg-[#18243c] border border-trading-buy/40' : 'hover:bg-[#131c2e]'
            }`}
          >
            <div className="w-3.5 h-2.5 bg-trading-buy rounded-sm" />
          </button>
          <button
            onClick={() => setViewMode('asks')}
            title="Hanya Asks (Jual)"
            className={`w-6 h-5 rounded flex flex-col items-center justify-center gap-0.5 transition-colors ${
              viewMode === 'asks' ? 'bg-[#18243c] border border-trading-sell/40' : 'hover:bg-[#131c2e]'
            }`}
          >
            <div className="w-3.5 h-2.5 bg-trading-sell rounded-sm" />
          </button>
        </div>
      </div>

      {/* Table Column Headers (Fixed) */}
      <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] text-gray-400 font-semibold border-b border-[#141f33] bg-[#0b111e] shrink-0">
        <span>Harga (IDR)</span>
        <span className="text-right">Jumlah ({currentPair.baseAsset})</span>
        <span className="text-right">Total (IDR)</span>
      </div>

      {/* Scrollable Order Book Section */}
      <div className="flex-grow min-h-0 flex flex-col overflow-hidden text-[11px] font-mono tabular-nums">
        {/* Asks (Sell Orders) - Scrollable */}
        {(viewMode === 'both' || viewMode === 'asks') && (
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col divide-y divide-[#121b2f]/40 pr-0.5">
            {asksToDisplay.map((entry, idx) => (
              <button
                key={`ask-${idx}-${entry.price}`}
                onClick={() => handleRowClick(entry.price, entry.amount)}
                className="relative grid grid-cols-3 px-3 py-1 text-left hover:bg-[#18233b] transition-colors group cursor-pointer w-full shrink-0"
              >
                {/* Visual Depth Bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-trading-sell/15 pointer-events-none transition-all duration-300"
                  style={{ width: `${entry.depthPercent}%` }}
                />
                <span className="text-trading-sell font-semibold z-10 group-hover:underline">
                  {formatIDR(entry.price).replace('Rp ', '')}
                </span>
                <span className="text-right text-gray-300 z-10">
                  {formatCrypto(entry.amount, currentPair.amountDecimals > 4 ? 4 : currentPair.amountDecimals)}
                </span>
                <span className="text-right text-gray-400 z-10">
                  {formatIDR(entry.total).replace('Rp ', '')}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Center Spread & Last Price Bar (Fixed in middle, does not scroll) */}
        <div className="shrink-0 px-3 py-1.5 my-0.5 bg-[#0a101d] border-y border-[#18243d] flex items-center justify-between text-xs font-semibold z-10">
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-bold flex items-center gap-1 transition-colors ${
                priceFlash === 'up'
                  ? 'text-trading-buy'
                  : priceFlash === 'down'
                  ? 'text-trading-sell'
                  : isUp
                  ? 'text-trading-buy'
                  : 'text-trading-sell'
              }`}
            >
              {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {formatIDR(currentPair.lastPrice)}
            </span>
          </div>
          <div className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
            <span>Spread:</span>
            <span className="text-gray-200">{formatIDR(orderBook.spread)}</span>
            <span className="text-gray-400">({orderBook.spreadPercent}%)</span>
          </div>
        </div>

        {/* Bids (Buy Orders) - Scrollable */}
        {(viewMode === 'both' || viewMode === 'bids') && (
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col divide-y divide-[#121b2f]/40 pr-0.5">
            {bidsToDisplay.map((entry, idx) => (
              <button
                key={`bid-${idx}-${entry.price}`}
                onClick={() => handleRowClick(entry.price, entry.amount)}
                className="relative grid grid-cols-3 px-3 py-1 text-left hover:bg-[#18233b] transition-colors group cursor-pointer w-full shrink-0"
              >
                {/* Visual Depth Bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-trading-buy/15 pointer-events-none transition-all duration-300"
                  style={{ width: `${entry.depthPercent}%` }}
                />
                <span className="text-trading-buy font-semibold z-10 group-hover:underline">
                  {formatIDR(entry.price).replace('Rp ', '')}
                </span>
                <span className="text-right text-gray-300 z-10">
                  {formatCrypto(entry.amount, currentPair.amountDecimals > 4 ? 4 : currentPair.amountDecimals)}
                </span>
                <span className="text-right text-gray-400 z-10">
                  {formatIDR(entry.total).replace('Rp ', '')}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
