'use client';

import React from 'react';
import { useTrading } from '@/context/TradingContext';
import { useMarket } from '@/context/MarketContext';
import { formatIDR, formatCrypto } from '@/utils/formatters';
import { X, Wallet, PlusCircle } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { balances, totalPortfolioIDR, setIsDepositModalOpen } = useTrading();
  const { pairs } = useMarket();

  if (!isOpen) return null;

  return (
    <div data-testid="modal-wallet" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0f172a] border border-[#1e2d4a] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#18233c] bg-[#0d1424]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indodax-cyan/20 border border-indodax-cyan/40 flex items-center justify-center text-indodax-cyan">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dompet & Saldo Portofolio</h2>
              <p className="text-xs text-gray-400">Total Estimasi Nilai Akun</p>
            </div>
          </div>
          <button
            data-testid="btn-close-wallet"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a263f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portfolio Summary Card */}
        <div className="p-6 bg-[#0b111e] border-b border-[#18233c] flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Total Estimasi Aset (IDR)</span>
            <div data-testid="wallet-total-balance" className="text-2xl font-black text-white font-mono tabular-nums mt-0.5">
              {formatIDR(totalPortfolioIDR)}
            </div>
          </div>
          <button
            data-testid="btn-wallet-faucet"
            onClick={() => {
              onClose();
              setIsDepositModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-trading-buy hover:bg-trading-buyHover text-[#0b111e] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Faucet Saldo
          </button>
        </div>

        {/* Asset Table */}
        <div className="overflow-y-auto p-4 flex-grow">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-[#18233c]">
              <tr>
                <th className="pb-2">Koin</th>
                <th className="pb-2 text-right">Tersedia</th>
                <th className="pb-2 text-right">Terkunci</th>
                <th className="pb-2 text-right">Estimasi (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141f33]">
              {Object.entries(balances).map(([asset, val]) => {
                const pair = pairs.find((p) => p.baseAsset === asset);
                const price = asset === 'IDR' ? 1 : pair ? pair.lastPrice : 0;
                const totalAmount = (val.available || 0) + (val.locked || 0);
                const est = Math.round(totalAmount * price);

                return (
                  <tr key={asset} data-testid={`wallet-asset-row-${asset}`} className="hover:bg-[#121c30] transition-colors">
                    <td className="py-2.5 font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#18243c] flex items-center justify-center text-[10px] text-indodax-cyan">
                        {asset.substring(0, 3)}
                      </div>
                      {asset}
                    </td>
                    <td className="py-2.5 text-right text-gray-200">
                      {asset === 'IDR' ? formatIDR(val.available) : formatCrypto(val.available, 4)}
                    </td>
                    <td className="py-2.5 text-right text-gray-400">
                      {asset === 'IDR' ? formatIDR(val.locked) : formatCrypto(val.locked, 4)}
                    </td>
                    <td className="py-2.5 text-right font-bold text-indodax-cyan">
                      {formatIDR(est)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
