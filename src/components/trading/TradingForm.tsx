'use client';

import React, { useState, useEffect } from 'react';
import { useMarket } from '@/context/MarketContext';
import { useTrading } from '@/context/TradingContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastNotification';
import { OrderSide, OrderType } from '@/types/trading';
import { formatIDR, formatCrypto, parseNumericInput } from '@/utils/formatters';
import QuickPercentageButtons from './QuickPercentageButtons';
import { Wallet } from 'lucide-react';

interface TradingFormProps {
  selectedPrice?: number | null;
  selectedAmount?: number | null;
}

export default function TradingForm({ selectedPrice, selectedAmount }: TradingFormProps) {
  const { currentPair } = useMarket();
  const { balances, placeOrder } = useTrading();
  const { isAuthenticated, setIsLoginModalOpen } = useAuth();
  const { showToast } = useToast();

  const [side, setSide] = useState<OrderSide>('BUY');
  const [type, setType] = useState<OrderType>('LIMIT');
  const [priceStr, setPriceStr] = useState<string>(currentPair.lastPrice.toString());
  const [amountStr, setAmountStr] = useState<string>('');
  const [activePercent, setActivePercent] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync price when selected from order book or pair changes
  useEffect(() => {
    if (selectedPrice) {
      setPriceStr(selectedPrice.toString());
    } else {
      setPriceStr(currentPair.lastPrice.toString());
    }
  }, [selectedPrice, currentPair.id]);

  // Sync amount when selected from order book
  useEffect(() => {
    if (selectedAmount) {
      setAmountStr(selectedAmount.toString());
    }
  }, [selectedAmount]);

  const effectivePrice = type === 'MARKET' ? currentPair.lastPrice : parseNumericInput(priceStr);
  const effectiveAmount = parseNumericInput(amountStr);
  const total = Math.round(effectivePrice * effectiveAmount);

  const feePercent = type === 'MARKET' ? currentPair.takerFeePercent : currentPair.makerFeePercent;
  const estimatedFee = Math.round(total * (feePercent / 100));

  const availableIDR = balances.IDR?.available || 0;
  const availableCrypto = balances[currentPair.baseAsset]?.available || 0;

  // Handle Quick Percentages
  const handlePercentageSelect = (percentage: number) => {
    setActivePercent(percentage);
    if (side === 'BUY') {
      const budget = (availableIDR * (percentage / 100)) / (1 + feePercent / 100);
      const calculatedAmount = effectivePrice > 0 ? budget / effectivePrice : 0;
      setAmountStr(
        calculatedAmount > 0
          ? calculatedAmount.toFixed(currentPair.amountDecimals > 4 ? 4 : currentPair.amountDecimals)
          : ''
      );
    } else {
      const calculatedAmount = availableCrypto * (percentage / 100);
      setAmountStr(
        calculatedAmount > 0
          ? calculatedAmount.toFixed(currentPair.amountDecimals > 4 ? 4 : currentPair.amountDecimals)
          : ''
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (effectiveAmount <= 0) {
      const msg = 'Masukkan jumlah aset yang valid.';
      showToast({ type: 'error', title: 'Order Gagal', message: msg });
      return;
    }

    if (effectivePrice <= 0) {
      const msg = 'Harga harus lebih besar dari 0.';
      showToast({ type: 'error', title: 'Order Gagal', message: msg });
      return;
    }

    setIsSubmitting(true);
    const result = await placeOrder({
      pairId: currentPair.id,
      side,
      type,
      price: effectivePrice,
      amount: effectiveAmount,
    });
    setIsSubmitting(false);

    if (result.success) {
      setAmountStr('');
      setActivePercent(null);

      showToast({
        type: type === 'MARKET' ? 'success' : 'info',
        title: type === 'MARKET' ? 'Order Berhasil Terisi' : 'Order Terpasang',
        message: result.message,
      });
    } else {
      showToast({
        type: 'error',
        title: 'Order Gagal',
        message: result.message,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0f172a] rounded-xl border border-[#1e2d4a] overflow-hidden select-none">
      {/* Side Tabs (Beli vs Jual) */}
      <div className="grid grid-cols-2 p-1.5 bg-[#0d1424] border-b border-[#18233c] gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            setSide('BUY');
            setActivePercent(null);
          }}
          className={`py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
            side === 'BUY'
              ? 'bg-trading-buy text-[#0b111e] shadow-lg shadow-trading-buy/20'
              : 'text-gray-400 hover:text-white hover:bg-[#152035]'
          }`}
        >
          Beli {currentPair.baseAsset}
        </button>
        <button
          type="button"
          onClick={() => {
            setSide('SELL');
            setActivePercent(null);
          }}
          className={`py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
            side === 'SELL'
              ? 'bg-trading-sell text-white shadow-lg shadow-trading-sell/20'
              : 'text-gray-400 hover:text-white hover:bg-[#152035]'
          }`}
        >
          Jual {currentPair.baseAsset}
        </button>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between overflow-y-auto space-y-3.5">
        {/* Order Type Tabs (Limit vs Market) */}
        <div className="flex items-center space-x-2 border-b border-[#18233c] pb-2">
          <button
            type="button"
            onClick={() => setType('LIMIT')}
            className={`text-xs font-bold pb-1 transition-colors relative ${
              type === 'LIMIT' ? 'text-indodax-cyan' : 'text-gray-400 hover:text-white'
            }`}
          >
            Limit
            {type === 'LIMIT' && (
              <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-indodax-cyan rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setType('MARKET')}
            className={`text-xs font-bold pb-1 transition-colors relative ${
              type === 'MARKET' ? 'text-indodax-cyan' : 'text-gray-400 hover:text-white'
            }`}
          >
            Market
            {type === 'MARKET' && (
              <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-indodax-cyan rounded-full" />
            )}
          </button>
        </div>

        {/* Balance Display Bar */}
        <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#0b111e] border border-[#1b263e]">
          <span className="text-gray-400 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-indodax-cyan" />
            Tersedia:
          </span>
          <span className="font-bold text-white tabular-nums">
            {side === 'BUY'
              ? formatIDR(availableIDR)
              : `${formatCrypto(availableCrypto, currentPair.amountDecimals)} ${currentPair.baseAsset}`}
          </span>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3 flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            {/* Price Input */}
            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>Harga Order</span>
                <span>IDR</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  disabled={type === 'MARKET'}
                  value={type === 'MARKET' ? 'Harga Pasar Terbaik (Market)' : priceStr}
                  onChange={(e) => {
                    setPriceStr(e.target.value);
                    setActivePercent(null);
                  }}
                  className={`w-full px-3 py-2 text-xs rounded-lg font-mono tabular-nums border ${
                    type === 'MARKET'
                      ? 'bg-[#141d30] border-[#1f2b42] text-gray-400 cursor-not-allowed'
                      : 'bg-[#0b111e] border-[#1e2d4a] text-white focus:outline-none focus:border-indodax-cyan'
                  }`}
                />
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>Jumlah</span>
                <span>{currentPair.baseAsset}</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={amountStr}
                  placeholder={`Min ${currentPair.minOrderAmount}`}
                  onChange={(e) => {
                    setAmountStr(e.target.value);
                    setActivePercent(null);
                  }}
                  className="w-full px-3 py-2 text-xs bg-[#0b111e] border border-[#1e2d4a] rounded-lg text-white font-mono tabular-nums placeholder-gray-600 focus:outline-none focus:border-indodax-cyan"
                />
              </div>
            </div>

            {/* Quick Percentage Chips */}
            <QuickPercentageButtons
              onSelect={handlePercentageSelect}
              activePercent={activePercent}
            />

            {/* Order Total & Fee Calculation */}
            <div className="space-y-1.5 p-2.5 rounded-lg bg-[#0d1424] border border-[#18233c] text-xs">
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>Estimasi Biaya ({feePercent}%)</span>
                <span className="text-gray-300 font-mono tabular-nums">{formatIDR(estimatedFee)}</span>
              </div>
              <div className="flex justify-between text-white font-semibold pt-1 border-t border-[#1b2742]">
                <span>Total Biaya</span>
                <span className="text-indodax-cyan font-bold font-mono tabular-nums">
                  {formatIDR(side === 'BUY' ? total + estimatedFee : total - estimatedFee)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                side === 'BUY'
                  ? 'bg-trading-buy hover:bg-trading-buyHover text-[#0b111e] shadow-trading-buy/20'
                  : 'bg-trading-sell hover:bg-trading-sellHover text-white shadow-trading-sell/20'
              }`}
            >
              {isSubmitting
                ? 'Memproses Order...'
                : !isAuthenticated
                ? 'Masuk untuk Trading'
                : `${side === 'BUY' ? 'Beli' : 'Jual'} ${currentPair.baseAsset}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
