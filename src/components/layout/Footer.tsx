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
            <strong>Trading Simulator:</strong> Static App For Pre-Test Only.
          </span>
        </div>
      </div>
    </footer>
  );
}
