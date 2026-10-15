'use client';

import React from 'react';

interface QuickPercentageButtonsProps {
  onSelect: (percentage: number) => void;
  activePercent?: number | null;
}

export default function QuickPercentageButtons({
  onSelect,
  activePercent,
}: QuickPercentageButtonsProps) {
  const percentages = [25, 50, 75, 100];

  return (
    <div className="grid grid-cols-4 gap-1.5 my-2">
      {percentages.map((pct) => (
        <button
          key={pct}
          type="button"
          onClick={() => onSelect(pct)}
          className={`py-1 rounded text-[11px] font-semibold transition-all ${
            activePercent === pct
              ? 'bg-[#1e2e4e] text-indodax-cyan border border-indodax-cyan/50 font-bold'
              : 'bg-[#121a2d] hover:bg-[#18233b] text-gray-400 hover:text-white border border-[#1b263e]'
          }`}
        >
          {pct}%
        </button>
      ))}
    </div>
  );
}
