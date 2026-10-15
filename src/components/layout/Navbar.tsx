'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTrading } from '@/context/TradingContext';
import { formatIDR } from '@/utils/formatters';
import {
  Wallet,
  User,
  PlusCircle,
  Eye,
  EyeOff,
  CheckCircle,
  LogIn,
  Layers,
  RotateCcw,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, setIsLoginModalOpen, setIsProfileModalOpen } = useAuth();
  const { totalPortfolioIDR, setIsDepositModalOpen, resetBalances } = useTrading();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <header className="w-full bg-[#0b111e] border-b border-[#18233c] sticky top-0 z-40 select-none">
      <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5">
            {/* Indodax Stylized Modern Logo */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indodax-blue to-indodax-cyan shadow-lg shadow-indodax-cyan/20">
              <span className="text-[#0b111e] font-black text-sm tracking-tighter">IDX</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wider text-white">
                INDODAX
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indodax-cyan/15 text-indodax-cyan border border-indodax-cyan/30">
                <span className="w-1.5 h-1.5 rounded-full bg-indodax-cyan animate-ping" />
                DEMO SIMULATOR
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-lg bg-[#142038] text-indodax-cyan border border-indodax-cyan/30 flex items-center gap-1.5 cursor-pointer">
              <Layers className="w-3.5 h-3.5" />
              Spot Exchange
            </span>
          </nav>
        </div>

        {/* Right: Portfolio, Faucet, & Auth */}
        <div className="flex items-center space-x-3">
          {/* Portfolio Balance Widget */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#121a2d] border border-[#1e2d4a]">
            <Wallet className="w-3.5 h-3.5 text-indodax-cyan" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-400 font-medium leading-none">Total Portofolio</span>
              <span className="text-xs font-bold text-white tabular-nums leading-tight">
                {showBalance ? formatIDR(totalPortfolioIDR) : '••••••••••••'}
              </span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-gray-200 transition-colors p-0.5"
              title={showBalance ? 'Sembunyikan Saldo' : 'Tampilkan Saldo'}
            >
              {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Faucet Top-Up Button */}
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-trading-buy/15 hover:bg-trading-buy/25 border border-trading-buy/40 text-trading-buy font-bold text-xs transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Faucet Saldo</span>
          </button>

          {/* Reset button (small) */}
          <button
            onClick={resetBalances}
            title="Reset saldo ke kondisi awal"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#152238] border border-transparent hover:border-[#223354] transition-all hidden sm:block"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Auth Button or User Profile */}
          {isAuthenticated && user ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-xl bg-[#142038] hover:bg-[#1a2b4c] border border-[#1f3152] transition-all text-xs"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indodax-cyan to-trading-buy flex items-center justify-center text-[#0b111e] font-bold text-[10px]">
                {user.name.charAt(0)}
              </div>
              <span className="font-semibold text-white max-w-[100px] truncate hidden sm:inline">
                {user.name.split(' ')[0]}
              </span>
              <CheckCircle className="w-3.5 h-3.5 text-trading-buy" />
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indodax-cyan hover:bg-indodax-cyanHover text-[#0b111e] font-bold text-xs transition-all shadow-md shadow-indodax-cyan/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
