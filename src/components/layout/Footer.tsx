'use client';

import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0f1b] border-t border-[#18233c] py-4 px-6 text-xs text-gray-500 mt-auto">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Disclaimer */}
        <div className="flex items-center space-x-2 text-center md:text-left">
          <ShieldCheck className="w-4 h-4 text-indodax-cyan shrink-0" />
          <span>
            <strong>Simulator Trading Indodax:</strong> Aplikasi static demo untuk edukasi & simulasi trading aset kripto dengan Rupiah. Tanpa dana riil.
          </span>
        </div>

        {/* Right: Tech & Status */}
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-trading-buy animate-pulse" />
            Sistem Operasional Normal
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1 text-gray-400">
            <Cpu className="w-3.5 h-3.5 text-indodax-cyan" />
            Next.js 14 + React + TypeScript
          </span>
        </div>
      </div>
    </footer>
  );
}
