'use client';

import React, { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import { formatIDR, formatPercent } from '@/utils/formatters';
import { Search, X, TrendingUp, TrendingDown, Check } from 'lucide-react';

interface PairSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PairSelectorModal({ isOpen, onClose }: PairSelectorModalProps) {
  const { pairs, currentPair, setPair } = useMarket();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = pairs.filter(
    (p) =>
      p.symbol.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.baseAsset.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-testid="modal-pair-selector" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0f172a] border border-[#1e2d4a] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#1e2d4a]">
          <div>
            <h2 className="text-lg font-bold text-white">Pilih Market Kripto</h2>
            <p className="text-xs text-gray-400">Pair trading dengan Rupiah (IDR)</p>
          </div>
          <button
            data-testid="btn-close-pair-selector"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a263f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#1e2d4a] bg-[#0b111e]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              data-testid="input-search-pair"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari koin (contoh: BTC, Ethereum, USDT)..."
              autoFocus
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#142038] border border-[#1e2d4a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indodax-cyan transition-colors"
            />
          </div>
        </div>

        {/* Pair List */}
        <div data-testid="pair-list-container" className="overflow-y-auto divide-y divide-[#18233c] p-2 flex-grow">
          {filtered.length === 0 ? (
            <div data-testid="pair-search-empty" className="py-12 text-center text-sm text-gray-400">
              Tidak ada koin yang sesuai dengan pencarian &quot;{search}&quot;
            </div>
          ) : (
            filtered.map((pair) => {
              const isSelected = pair.id === currentPair.id;
              const isUp = pair.priceChange24h >= 0;

              return (
                <button
                  key={pair.id}
                  data-testid={`pair-item-${pair.id}`}
                  onClick={() => {
                    setPair(pair.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-indodax-cyan/10 border border-indodax-cyan/30'
                      : 'hover:bg-[#142038] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-full bg-[#1e2d4a] flex items-center justify-center font-bold text-xs text-indodax-cyan">
                      {pair.baseAsset.substring(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span data-testid={`pair-symbol-${pair.id}`} className="font-bold text-white text-sm">{pair.symbol}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indodax-cyan" />}
                      </div>
                      <span className="text-xs text-gray-400">{pair.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div data-testid={`pair-price-${pair.id}`} className="font-semibold text-white text-sm tabular-nums">
                      {formatIDR(pair.lastPrice)}
                    </div>
                    <div
                      data-testid={`pair-change-${pair.id}`}
                      className={`text-xs font-semibold flex items-center justify-end gap-0.5 tabular-nums ${
                        isUp ? 'text-trading-buy' : 'text-trading-sell'
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {formatPercent(pair.priceChange24h)}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
