import { TradingPair, OrderBook, OrderBookEntry, MarketTrade } from '../types/trading';

/**
 * Generate initial realistic order book bids & asks
 */
export function generateInitialOrderBook(pair: TradingPair, depthCount: number = 10): OrderBook {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];

  const basePrice = pair.lastPrice;
  // Step size proportional to price
  const stepPercent = 0.0006; // 0.06% step

  let cumulativeBidTotal = 0;
  let cumulativeAskTotal = 0;

  // Generate Bids (Buy orders, descending price)
  for (let i = 0; i < depthCount; i++) {
    const spreadOffset = 0.0003; // initial minimum gap
    const price = Math.round(basePrice * (1 - spreadOffset - i * stepPercent));
    // Amount variation
    const baseMultiplier = pair.priceDecimals === 0 && basePrice > 1000000 ? 0.05 : 50;
    const amount = Number((baseMultiplier * (1 + Math.sin(i * 1.5) * 0.4 + Math.random() * 0.5)).toFixed(pair.amountDecimals));
    const total = Math.round(price * amount);
    cumulativeBidTotal += total;

    bids.push({
      price,
      amount,
      total,
      depthPercent: 0,
    });
  }

  // Generate Asks (Sell orders, ascending price)
  for (let i = 0; i < depthCount; i++) {
    const spreadOffset = 0.0003;
    const price = Math.round(basePrice * (1 + spreadOffset + i * stepPercent));
    const baseMultiplier = pair.priceDecimals === 0 && basePrice > 1000000 ? 0.05 : 50;
    const amount = Number((baseMultiplier * (1 + Math.cos(i * 1.5) * 0.4 + Math.random() * 0.5)).toFixed(pair.amountDecimals));
    const total = Math.round(price * amount);
    cumulativeAskTotal += total;

    asks.push({
      price,
      amount,
      total,
      depthPercent: 0,
    });
  }

  // Calculate visual depth bars (cumulative volume percentage)
  let runBid = 0;
  bids.forEach((b) => {
    runBid += b.total;
    b.depthPercent = Math.min(100, Math.round((runBid / cumulativeBidTotal) * 100));
  });

  let runAsk = 0;
  asks.forEach((a) => {
    runAsk += a.total;
    a.depthPercent = Math.min(100, Math.round((runAsk / cumulativeAskTotal) * 100));
  });

  const bestBid = bids[0]?.price || basePrice;
  const bestAsk = asks[0]?.price || basePrice;
  const spread = Math.max(0, bestAsk - bestBid);
  const spreadPercent = Number(((spread / bestAsk) * 100).toFixed(3));

  return {
    bids,
    asks,
    spread,
    spreadPercent,
  };
}

/**
 * Generate historical/initial trades stream
 */
export function generateInitialTrades(pair: TradingPair, count: number = 20): MarketTrade[] {
  const trades: MarketTrade[] = [];
  const now = Date.now();
  let currentPrice = pair.lastPrice;

  for (let i = 0; i < count; i++) {
    const side = Math.random() > 0.48 ? 'BUY' : 'SELL';
    const delta = (Math.random() - 0.5) * 0.001 * currentPrice;
    currentPrice = Math.round(currentPrice + delta);

    const baseAmount = pair.priceDecimals === 0 && pair.lastPrice > 1000000 ? 0.02 : 25;
    const amount = Number((baseAmount * (0.2 + Math.random() * 1.8)).toFixed(pair.amountDecimals));
    const total = Math.round(currentPrice * amount);

    trades.push({
      id: `trade_${now - i * 4000}_${i}`,
      price: currentPrice,
      amount,
      total,
      side,
      timestamp: now - i * 4500,
    });
  }

  return trades;
}

/**
 * Simulate live tick fluctuation
 */
export function simulatePriceTick(
  pair: TradingPair,
  currentOrderBook: OrderBook
): {
  updatedPair: TradingPair;
  updatedOrderBook: OrderBook;
  newTrade: MarketTrade;
  priceDirection: 'up' | 'down';
} {
  // Random fluctuation between -0.15% and +0.15%
  const pctChange = (Math.random() - 0.495) * 0.003;
  const priceDiff = pair.lastPrice * pctChange;
  const newPrice = Math.max(1, Math.round(pair.lastPrice + priceDiff));

  const priceDirection = newPrice >= pair.lastPrice ? 'up' : 'down';
  const side = priceDirection === 'up' ? 'BUY' : 'SELL';

  const baseAmount = pair.priceDecimals === 0 && pair.lastPrice > 1000000 ? 0.03 : 30;
  const tradeAmount = Number((baseAmount * (0.1 + Math.random() * 1.2)).toFixed(pair.amountDecimals));
  const tradeTotal = Math.round(newPrice * tradeAmount);

  const newTrade: MarketTrade = {
    id: `trade_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    price: newPrice,
    amount: tradeAmount,
    total: tradeTotal,
    side,
    timestamp: Date.now(),
  };

  // Update 24h stats
  const high24h = Math.max(pair.high24h, newPrice);
  const low24h = Math.min(pair.low24h, newPrice);
  const volume24h = pair.volume24h + tradeTotal;
  const baseVolume24h = Number((pair.baseVolume24h + tradeAmount).toFixed(pair.amountDecimals));

  // Update % change roughly
  const estimatedOpen = pair.lastPrice / (1 + pair.priceChange24h / 100);
  const updatedChange = Number((((newPrice - estimatedOpen) / estimatedOpen) * 100).toFixed(2));

  const updatedPair: TradingPair = {
    ...pair,
    lastPrice: newPrice,
    high24h,
    low24h,
    volume24h,
    baseVolume24h,
    priceChange24h: updatedChange,
  };

  // Re-shift order book slightly around new price
  const updatedOrderBook = generateInitialOrderBook(updatedPair, currentOrderBook.bids.length || 10);

  return {
    updatedPair,
    updatedOrderBook,
    newTrade,
    priceDirection,
  };
}
