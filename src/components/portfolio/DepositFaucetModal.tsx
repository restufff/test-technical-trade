'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { useToast } from '@/components/ui/ToastNotification';
import { formatIDR } from '@/utils/formatters';
import { X, PlusCircle, CheckCircle2, Coins, Sparkles } from 'lucide-react';

export default function DepositFaucetModal() {
  const { isDepositModalOpen, setIsDepositModalOpen, depositFunds, balances } = useTrading();
  const { showToast } = useToast();
  const [amount, setAmount] = useState<number>(50000000);
  const [success, setSuccess] = useState(false);

  if (!isDepositModalOpen) return null;

  const presets = [10000000, 25000000, 50000000, 100000000];

  const handleDeposit = () => {
    if (amount <= 0) return;
    depositFunds(amount);
    setSuccess(true);

    showToast({
      type: 'success',
      title: 'Klaim Saldo Berhasil',
      message: `Saldo ${formatIDR(amount)} berhasil ditambahkan ke dompet akun Anda!`,
    });

    setTimeout(() => {
      setSuccess(false);
      setIsDepositModalOpen(false);
    }, 1000);
  };

  return (
    <div data-testid="modal-faucet" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-[#1e2d4a] shadow-2xl overflow-hidden">
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-trading-buy via-indodax-cyan to-indodax-blue" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-trading-buy/20 border border-trading-buy/40 flex items-center justify-center text-trading-buy font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
                Faucet Saldo Demo
                <Sparkles className="w-4 h-4 text-indodax-cyan animate-spin" />
              </h2>
              <p className="text-xs text-gray-400">Tambah Saldo IDR Simulasi Tanpa Batas</p>
            </div>
          </div>
          <button
            data-testid="btn-close-faucet"
            onClick={() => setIsDepositModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a263f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-2 space-y-4">
          <div className="p-3 rounded-xl bg-[#0b111e] border border-[#1e2d4a] flex items-center justify-between text-xs">
            <span className="text-gray-400">Saldo IDR Saat Ini:</span>
            <span data-testid="faucet-current-balance" className="font-bold text-trading-buy text-sm tabular-nums">
              {formatIDR(balances.IDR?.available || 0)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Pilih Nominal Top-Up:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  data-testid={`btn-faucet-preset-${preset}`}
                  onClick={() => setAmount(preset)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    amount === preset
                      ? 'bg-indodax-cyan/15 border-indodax-cyan text-white shadow-md shadow-indodax-cyan/10'
                      : 'bg-[#142038] border-[#1e2d4a] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="text-xs font-bold">{formatIDR(preset)}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Instant credit</div>
                </button>
              ))}
            </div>
          </div>

          {success ? (
            <div data-testid="faucet-success-message" className="py-3 px-4 rounded-xl bg-trading-buy/20 border border-trading-buy text-trading-buy text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Saldo {formatIDR(amount)} berhasil ditambahkan ke dompet!
            </div>
          ) : (
            <button
              data-testid="btn-faucet-submit"
              onClick={handleDeposit}
              className="w-full py-3 rounded-xl bg-trading-buy hover:bg-trading-buyHover text-[#0b111e] font-extrabold text-sm shadow-lg shadow-trading-buy/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <PlusCircle className="w-4 h-4" />
              Klaim Saldo {formatIDR(amount)}
            </button>
          )}

          <p className="text-center text-[11px] text-gray-500">
            *Saldo faucet ini adalah dana simulasi untuk latihan trading.
          </p>
        </div>
      </div>
    </div>
  );
}
