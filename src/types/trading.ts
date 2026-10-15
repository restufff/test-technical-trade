export type OrderType = 'LIMIT' | 'MARKET';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'OPEN' | 'FILLED' | 'CANCELLED';

export interface TradingPair {
  id: string;               // e.g., 'btc_idr'
  symbol: string;           // e.g., 'BTC/IDR'
  baseAsset: string;        // e.g., 'BTC'
  quoteAsset: string;       // e.g., 'IDR'
  name: string;             // e.g., 'Bitcoin'
  lastPrice: number;        // e.g., 1050000000
  priceChange24h: number;   // e.g., 2.45 (%)
  high24h: number;          // e.g., 1080000000
  low24h: number;           // e.g., 1025000000
  volume24h: number;        // in quote asset (IDR)
  baseVolume24h: number;    // in base asset (BTC)
  priceDecimals: number;    // e.g., 0 for IDR, 4 for USDT
  amountDecimals: number;   // e.g., 8 for BTC
  minOrderAmount: number;   // e.g., 0.0001
  minOrderTotal: number;    // e.g., 10000 IDR
  takerFeePercent: number;  // e.g., 0.1 (%)
  makerFeePercent: number;  // e.g., 0.1 (%)
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  depthPercent: number;     // 0 - 100 for visual depth bar
}

export interface OrderBook {
  bids: OrderBookEntry[];   // Buy orders (descending price)
  asks: OrderBookEntry[];   // Sell orders (ascending price)
  spread: number;
  spreadPercent: number;
}

export interface MarketTrade {
  id: string;
  price: number;
  amount: number;
  total: number;
  side: OrderSide;
  timestamp: number;
}

export interface Order {
  id: string;
  pairId: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  amount: number;
  filledAmount: number;
  total: number;
  fee: number;
  status: OrderStatus;
  createdAt: number;
}

export interface WalletBalances {
  [asset: string]: {
    available: number;
    locked: number;          // locked in open limit orders
  };
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  kycStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED_LEVEL_1' | 'VERIFIED_LEVEL_2';
  memberSince: string;
}

export interface CandlestickData {
  time: number;             // timestamp in seconds or ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
