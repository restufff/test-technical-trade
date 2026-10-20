'use client';

import React from 'react';
import { useMarket } from '@/context/MarketContext';
import { formatIDR, formatCrypto, formatTime } from '@/utils/formatters';
import { History } from 'lucide-react';

export default function MarketTrades() {
  const { currentPair, recentTrades } = useMarket();

  return (
    <div data-testid="market-trades" className="w-full h-full flex flex-col bg-[#0f172a] rounded-xl border border-[#1e2d4a] overflow-hidden select-none">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#18233c] flex items-center justify-between bg-[#0d1424]">
        <div className="flex items-center space-x-1.5">
          <History className="w-3.5 h-3.5 text-indodax-cyan" />
          <h3 className="text-xs font-bold text-white tracking-wide">Market Trades</h3>
        </div>
        <span className="text-[10px] text-gray-400">Riwayat Transaksi Publik</span>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] text-gray-400 font-semibold border-b border-[#141f33] bg-[#0b111e]">
        <span>Harga (IDR)</span>
        <span className="text-right">Jumlah ({currentPair.baseAsset})</span>
        <span className="text-right">Waktu</span>
      </div>

      {/* Trades List */}
      <div data-testid="market-trades-list" className="flex-grow overflow-y-auto divide-y divide-[#121b2f]/40 text-[11px] font-mono tabular-nums">
        {recentTrades.slice(0, 30).map((trade, idx) => {
          const isBuy = trade.side === 'BUY';
          return (
            <div
              key={trade.id}
              data-testid={`market-trade-row-${idx}`}
              className="grid grid-cols-3 px-3 py-1 hover:bg-[#142038] transition-colors"
            >
              <span className={`font-semibold ${isBuy ? 'text-trading-buy' : 'text-trading-sell'}`}>
                {formatIDR(trade.price).replace('Rp ', '')}
              </span>
              <span className="text-right text-gray-300">
                {formatCrypto(trade.amount, currentPair.amountDecimals > 4 ? 4 : currentPair.amountDecimals)}
              </span>
              <span suppressHydrationWarning className="text-right text-gray-400">
                {formatTime(trade.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
