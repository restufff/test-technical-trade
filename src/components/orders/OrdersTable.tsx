'use client';

import React, { useState } from 'react';
import { useTrading } from '@/context/TradingContext';
import { useMarket } from '@/context/MarketContext';
import { formatIDR, formatCrypto, formatTime } from '@/utils/formatters';
import { ListOrdered, Clock, Wallet, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function OrdersTable() {
  const { openOrders, orderHistory, cancelOrder, balances, setIsDepositModalOpen } = useTrading();
  const { pairs } = useMarket();
  const [activeTab, setActiveTab] = useState<'open' | 'history' | 'assets'>('open');

  return (
    <div className="w-full bg-[#0f172a] rounded-xl border border-[#1e2d4a] overflow-hidden select-none flex flex-col min-h-[280px]">
      {/* Tabs Header */}
      <div className="px-4 py-2 border-b border-[#18233c] flex items-center justify-between bg-[#0d1424]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'open'
                ? 'bg-[#18243c] text-indodax-cyan border border-indodax-cyan/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-[#131c2e]'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            Order Terbuka
            {openOrders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indodax-cyan/20 text-indodax-cyan font-mono font-bold">
                {openOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#18243c] text-indodax-cyan border border-indodax-cyan/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-[#131c2e]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Riwayat Order
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'assets'
                ? 'bg-[#18243c] text-indodax-cyan border border-indodax-cyan/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-[#131c2e]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            Aset & Saldo
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-grow overflow-x-auto overflow-y-auto max-h-[350px]">
        {/* Tab 1: Open Orders */}
        {activeTab === 'open' && (
          <div>
            {openOrders.length === 0 ? (
              <div className="py-16 text-center text-xs text-gray-500 flex flex-col items-center justify-center">
                <ListOrdered className="w-8 h-8 text-gray-600 mb-2" />
                <span>Belum ada order terbuka</span>
                <span className="text-[11px] text-gray-600 mt-0.5">
                  Order limit yang belum terisi akan muncul di sini.
                </span>
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0b111e] text-[10px] text-gray-400 uppercase tracking-wider border-b border-[#141f33]">
                  <tr>
                    <th className="py-2.5 px-4">Waktu</th>
                    <th className="py-2.5 px-4">Pair</th>
                    <th className="py-2.5 px-4">Tipe</th>
                    <th className="py-2.5 px-4">Sisi</th>
                    <th className="py-2.5 px-4 text-right">Harga</th>
                    <th className="py-2.5 px-4 text-right">Jumlah</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                    <th className="py-2.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141f33]">
                  {openOrders.map((order) => {
                    const isBuy = order.side === 'BUY';
                    const pair = pairs.find((p) => p.id === order.pairId);
                    return (
                      <tr key={order.id} className="hover:bg-[#121c30] transition-colors">
                        <td className="py-2.5 px-4 text-gray-400">{formatTime(order.createdAt, true)}</td>
                        <td className="py-2.5 px-4 font-bold text-white">{pair?.symbol || order.pairId}</td>
                        <td className="py-2.5 px-4 text-gray-300">{order.type}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isBuy
                                ? 'bg-trading-buy/15 text-trading-buy border border-trading-buy/30'
                                : 'bg-trading-sell/15 text-trading-sell border border-trading-sell/30'
                            }`}
                          >
                            {order.side}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-white">{formatIDR(order.price)}</td>
                        <td className="py-2.5 px-4 text-right text-gray-200">
                          {formatCrypto(order.amount, 4)} {pair?.baseAsset}
                        </td>
                        <td className="py-2.5 px-4 text-right text-indodax-cyan font-bold">
                          {formatIDR(order.total)}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="px-2.5 py-1 rounded bg-trading-sell/15 hover:bg-trading-sell/25 text-trading-sell border border-trading-sell/30 text-[10px] font-bold transition-all flex items-center gap-1 mx-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                            Batalkan
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Order History */}
        {activeTab === 'history' && (
          <div>
            {orderHistory.length === 0 ? (
              <div className="py-16 text-center text-xs text-gray-500 flex flex-col items-center justify-center">
                <Clock className="w-8 h-8 text-gray-600 mb-2" />
                <span>Belum ada riwayat transaksi order</span>
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0b111e] text-[10px] text-gray-400 uppercase tracking-wider border-b border-[#141f33]">
                  <tr>
                    <th className="py-2.5 px-4">Waktu</th>
                    <th className="py-2.5 px-4">Pair</th>
                    <th className="py-2.5 px-4">Tipe</th>
                    <th className="py-2.5 px-4">Sisi</th>
                    <th className="py-2.5 px-4 text-right">Harga</th>
                    <th className="py-2.5 px-4 text-right">Jumlah</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141f33]">
                  {orderHistory.map((order) => {
                    const isBuy = order.side === 'BUY';
                    const isFilled = order.status === 'FILLED';
                    const pair = pairs.find((p) => p.id === order.pairId);

                    return (
                      <tr key={order.id} className="hover:bg-[#121c30] transition-colors">
                        <td className="py-2.5 px-4 text-gray-400">{formatTime(order.createdAt, true)}</td>
                        <td className="py-2.5 px-4 font-bold text-white">{pair?.symbol || order.pairId}</td>
                        <td className="py-2.5 px-4 text-gray-300">{order.type}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isBuy
                                ? 'bg-trading-buy/15 text-trading-buy border border-trading-buy/30'
                                : 'bg-trading-sell/15 text-trading-sell border border-trading-sell/30'
                            }`}
                          >
                            {order.side}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-white">{formatIDR(order.price)}</td>
                        <td className="py-2.5 px-4 text-right text-gray-200">
                          {formatCrypto(order.amount, 4)} {pair?.baseAsset}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-gray-200">
                          {formatIDR(order.total)}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {isFilled ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-trading-buy px-2 py-0.5 rounded-full bg-trading-buy/15 border border-trading-buy/30">
                              <CheckCircle2 className="w-3 h-3" /> Terisi
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 px-2 py-0.5 rounded-full bg-[#1b263e] border border-[#2a3a5a]">
                              <XCircle className="w-3 h-3" /> Dibatalkan
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: Assets & Balances */}
        {activeTab === 'assets' && (
          <div className="p-3">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0b111e] text-[10px] text-gray-400 uppercase tracking-wider border-b border-[#141f33]">
                <tr>
                  <th className="py-2 px-3">Aset</th>
                  <th className="py-2 px-3 text-right">Tersedia</th>
                  <th className="py-2 px-3 text-right">Terkunci (Order)</th>
                  <th className="py-2 px-3 text-right">Total Aset</th>
                  <th className="py-2 px-3 text-right">Estimasi (IDR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141f33]">
                {Object.entries(balances).map(([asset, val]) => {
                  const pair = pairs.find((p) => p.baseAsset === asset);
                  const price = asset === 'IDR' ? 1 : pair ? pair.lastPrice : 0;
                  const totalAmount = (val.available || 0) + (val.locked || 0);
                  const estimatedIDR = Math.round(totalAmount * price);

                  return (
                    <tr key={asset} className="hover:bg-[#121c30] transition-colors">
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indodax-cyan/20 flex items-center justify-center text-[9px] text-indodax-cyan">
                          {asset.substring(0, 3)}
                        </div>
                        {asset}
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-200">
                        {asset === 'IDR' ? formatIDR(val.available) : formatCrypto(val.available, 4)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-400">
                        {asset === 'IDR' ? formatIDR(val.locked) : formatCrypto(val.locked, 4)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-white">
                        {asset === 'IDR' ? formatIDR(totalAmount) : `${formatCrypto(totalAmount, 4)} ${asset}`}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-indodax-cyan">
                        {formatIDR(estimatedIDR)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
