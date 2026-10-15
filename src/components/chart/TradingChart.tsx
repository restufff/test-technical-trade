'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useMarket } from '@/context/MarketContext';
import { CandlestickData } from '@/types/trading';
import {
  Timeframe,
  generateHistoricalCandles,
  updateLatestCandle,
  calculateChartBounds,
} from './chartUtils';
import { formatIDR, formatCrypto, formatTime } from '@/utils/formatters';
import { BarChart2, TrendingUp, Maximize2 } from 'lucide-react';

export default function TradingChart() {
  const { currentPair } = useMarket();
  const [timeframe, setTimeframe] = useState<Timeframe>('15m');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [candles, setCandles] = useState<CandlestickData[]>([]);
  const [hoveredCandle, setHoveredCandle] = useState<CandlestickData | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 420 });

  // Regenerate history on pair or timeframe change
  useEffect(() => {
    const data = generateHistoricalCandles(currentPair.lastPrice, timeframe, 42);
    setCandles(data);
  }, [currentPair.id, timeframe]);

  // Update latest candle on price tick
  useEffect(() => {
    setCandles((prev) => updateLatestCandle(prev, currentPair.lastPrice));
  }, [currentPair.lastPrice]);

  // Measure container dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: Math.max(340, containerRef.current.clientHeight),
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const bounds = useMemo(() => calculateChartBounds(candles), [candles]);

  // Chart layout geometry
  const padding = { top: 20, right: 80, bottom: 40, left: 10 };
  const chartWidth = Math.max(100, dimensions.width - padding.left - padding.right);
  const chartHeight = Math.max(100, dimensions.height - padding.top - padding.bottom);
  const volumeHeight = chartHeight * 0.22;
  const priceChartHeight = chartHeight - volumeHeight - 15;

  const candleCount = candles.length;
  const candleSlotWidth = chartWidth / (candleCount || 1);
  const candleBodyWidth = Math.max(3, candleSlotWidth * 0.72);

  const getYForPrice = (price: number) => {
    const range = bounds.maxPrice - bounds.minPrice || 1;
    const ratio = (price - bounds.minPrice) / range;
    return padding.top + priceChartHeight * (1 - ratio);
  };

  const getYForVolume = (volume: number) => {
    const ratio = volume / (bounds.maxVolume || 1);
    const yTop = padding.top + priceChartHeight + 15;
    return yTop + volumeHeight * (1 - ratio);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chartX = x - padding.left;
    const index = Math.floor(chartX / candleSlotWidth);

    if (index >= 0 && index < candles.length) {
      setHoveredCandle(candles[index]);
      setCrosshairPos({ x, y });
    } else {
      setHoveredCandle(null);
      setCrosshairPos(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
    setCrosshairPos(null);
  };

  const activeCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);

  // Generate 5 horizontal price gridlines
  const priceGridLines = useMemo(() => {
    const lines = [];
    const step = (bounds.maxPrice - bounds.minPrice) / 5;
    for (let i = 0; i <= 5; i++) {
      const price = bounds.minPrice + step * i;
      lines.push({
        price: Math.round(price),
        y: getYForPrice(price),
      });
    }
    return lines;
  }, [bounds, priceChartHeight]);

  const currentPriceY = getYForPrice(currentPair.lastPrice);

  return (
    <div className="w-full h-full flex flex-col bg-[#0f172a] rounded-xl border border-[#1e2d4a] overflow-hidden select-none">
      {/* Top Controls Toolbar */}
      <div className="px-4 py-2 border-b border-[#18233c] flex flex-wrap items-center justify-between gap-2 bg-[#0d1424]">
        {/* Timeframe Buttons */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] text-gray-400 font-semibold mr-1.5 hidden sm:inline">Waktu:</span>
          {(['1m', '5m', '15m', '1h', '1D'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-indodax-cyan/20 text-indodax-cyan border border-indodax-cyan/40'
                  : 'text-gray-400 hover:text-white hover:bg-[#152035]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Display Stats for Active Candle */}
        {activeCandle && (
          <div className="hidden xl:flex items-center space-x-4 text-[11px] font-mono tabular-nums">
            <span className="text-gray-400">
              O: <strong className="text-white">{formatIDR(activeCandle.open)}</strong>
            </span>
            <span className="text-gray-400">
              H: <strong className="text-trading-buy">{formatIDR(activeCandle.high)}</strong>
            </span>
            <span className="text-gray-400">
              L: <strong className="text-trading-sell">{formatIDR(activeCandle.low)}</strong>
            </span>
            <span className="text-gray-400">
              C: <strong className={activeCandle.close >= activeCandle.open ? 'text-trading-buy' : 'text-trading-sell'}>
                {formatIDR(activeCandle.close)}
              </strong>
            </span>
            <span className="text-gray-400">
              Vol: <strong className="text-gray-200">{formatCrypto(activeCandle.volume, 2)}</strong>
            </span>
          </div>
        )}

        {/* Right Toggle */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setChartType(chartType === 'candles' ? 'line' : 'candles')}
            className="p-1.5 rounded-md hover:bg-[#142038] text-gray-400 hover:text-white transition-colors"
            title="Ganti Tipe Chart"
          >
            {chartType === 'candles' ? <BarChart2 className="w-4 h-4 text-indodax-cyan" /> : <TrendingUp className="w-4 h-4 text-indodax-cyan" />}
          </button>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div ref={containerRef} className="relative flex-grow w-full min-h-[350px]">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair"
        >
          {/* Horizontal Price Gridlines */}
          {priceGridLines.map((line, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={line.y}
                x2={dimensions.width - padding.right}
                y2={line.y}
                stroke="#18243b"
                strokeDasharray="3 3"
              />
              <text
                x={dimensions.width - padding.right + 8}
                y={line.y + 3.5}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
              >
                {formatIDR(line.price)}
              </text>
            </g>
          ))}

          {/* Volume Separator Line */}
          <line
            x1={padding.left}
            y1={padding.top + priceChartHeight + 15}
            x2={dimensions.width - padding.right}
            y2={padding.top + priceChartHeight + 15}
            stroke="#18243b"
          />

          {/* Candlesticks & Volume Bars */}
          {candles.map((c, idx) => {
            const isBullish = c.close >= c.open;
            const candleColor = isBullish ? '#0ecb81' : '#f6465d';
            const xCenter = padding.left + idx * candleSlotWidth + candleSlotWidth / 2;

            const yOpen = getYForPrice(c.open);
            const yClose = getYForPrice(c.close);
            const yHigh = getYForPrice(c.high);
            const yLow = getYForPrice(c.low);

            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

            const yVolTop = getYForVolume(c.volume);
            const volBottom = padding.top + priceChartHeight + 15 + volumeHeight;
            const volHeight = Math.max(1, volBottom - yVolTop);

            return (
              <g key={idx}>
                {/* Volume bar */}
                <rect
                  x={xCenter - candleBodyWidth / 2}
                  y={yVolTop}
                  width={candleBodyWidth}
                  height={volHeight}
                  fill={candleColor}
                  opacity="0.3"
                />

                {chartType === 'candles' ? (
                  <>
                    {/* Wick */}
                    <line
                      x1={xCenter}
                      y1={yHigh}
                      x2={xCenter}
                      y2={yLow}
                      stroke={candleColor}
                      strokeWidth="1.2"
                    />
                    {/* Candle Body */}
                    <rect
                      x={xCenter - candleBodyWidth / 2}
                      y={bodyTop}
                      width={candleBodyWidth}
                      height={bodyHeight}
                      fill={candleColor}
                      rx="1"
                    />
                  </>
                ) : null}
              </g>
            );
          })}

          {/* Area / Line Chart mode */}
          {chartType === 'line' && (
            <polyline
              fill="none"
              stroke="#00b8d9"
              strokeWidth="2"
              points={candles
                .map((c, idx) => {
                  const x = padding.left + idx * candleSlotWidth + candleSlotWidth / 2;
                  const y = getYForPrice(c.close);
                  return `${x},${y}`;
                })
                .join(' ')}
            />
          )}

          {/* Current Live Price Line */}
          {currentPriceY >= padding.top && currentPriceY <= padding.top + priceChartHeight && (
            <g>
              <line
                x1={padding.left}
                y1={currentPriceY}
                x2={dimensions.width - padding.right}
                y2={currentPriceY}
                stroke="#00b8d9"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <rect
                x={dimensions.width - padding.right + 2}
                y={currentPriceY - 9}
                width={74}
                height={18}
                rx="4"
                fill="#00b8d9"
              />
              <text
                x={dimensions.width - padding.right + 6}
                y={currentPriceY + 3.5}
                fill="#0b111e"
                fontSize="9.5"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {formatIDR(currentPair.lastPrice)}
              </text>
            </g>
          )}

          {/* Crosshair Cursor */}
          {crosshairPos && (
            <g>
              {/* Vertical line */}
              <line
                x1={crosshairPos.x}
                y1={padding.top}
                x2={crosshairPos.x}
                y2={dimensions.height - padding.bottom}
                stroke="#94a3b8"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
              {/* Horizontal line */}
              <line
                x1={padding.left}
                y1={crosshairPos.y}
                x2={dimensions.width - padding.right}
                y2={crosshairPos.y}
                stroke="#94a3b8"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
            </g>
          )}
        </svg>

        {/* Time labels axis */}
        <div
          className="absolute bottom-1 left-0 right-0 flex justify-between px-6 text-[10px] text-gray-500 font-mono"
          style={{ paddingRight: padding.right + 10 }}
        >
          {candles
            .filter((_, i) => i % Math.max(1, Math.floor(candles.length / 5)) === 0)
            .map((c, i) => (
              <span key={i} suppressHydrationWarning>{formatTime(c.time)}</span>
            ))}
        </div>
      </div>
    </div>
  );
}
