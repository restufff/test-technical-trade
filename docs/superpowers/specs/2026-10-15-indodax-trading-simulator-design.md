# Indodax Crypto Trading Web App (Simulation) - Design Document

## 1. Intent & Overview
A high-fidelity, modern static crypto trading web application inspired by Indodax, built with React, Next.js, and TypeScript. It features a dark-themed exchange interface with simulated real-time market data, interactive candlestick/area charting, live order book, market trades stream, static authentication (demo accounts with persistent state in `localStorage`), simulated order execution (Limit and Market Buy/Sell), open orders management with cancellation, and portfolio wallet balances with a deposit/faucet feature.

## 2. Goals & Key Features
- **Modern UI & Aesthetic**: Indodax dark theme palette (navy/deep slate `#0b111e`, vibrant cyan `#00b8d9`, emerald green `#0ecb81`, ruby red `#f6465d`), crisp tabular data, responsive exchange layout, and smooth animations.
- **Static Authentication**: Pre-configured demo user accounts (e.g., "demo@indodax.mock" / "password123") with 1-click login, user profile modal showing KYC verification status, and persistent session in `localStorage`.
- **Trading Pairs**: Multiple IDR pairs (BTC/IDR, ETH/IDR, USDT/IDR, SOL/IDR, DOGE/IDR) with 24h stats (High, Low, Volume, 24h % Change).
- **Interactive Price Chart**: Custom SVG/Canvas candlestick & volume chart with timeframe selector (1m, 5m, 15m, 1h, 1D), zoom/pan, tooltip crosshairs, and live tick updates.
- **Real-time Order Book**: Live bids and asks depth table with depth volume bars, spread indicator, and click-to-populate order form.
- **Trading Form (Buy & Sell)**:
  - Limit and Market orders.
  - Percentage quick buttons (25%, 50%, 75%, 100%).
  - Real-time fee and total calculations in IDR.
  - Instant validation (balance check, minimum order size).
- **Simulated Order Matching Engine**:
  - Market orders execute immediately at the best order book price.
  - Limit orders enter the "Open Orders" book; if market prices cross the limit price, orders trigger execution automatically.
  - Cancel order with balance refund.
- **Portfolio & Wallet**:
  - Live balances of IDR and crypto assets.
  - Estimated total portfolio value in IDR.
  - Simulated Faucet/Deposit modal to top up IDR test funds anytime.
- **Audio & Toast Feedback**: High-polish user feedback for placed orders, fills, and errors.

## 3. Tech Stack
- Framework: Next.js 14+ (App Router, Static Export compatible).
- Language: TypeScript.
- Styling: Tailwind CSS & Lucide React icons for a modern, sleek interface.
- State Management: React Context / Zustand / React Hook state with `localStorage` persistence.
- Testing: Jest / React Testing Library or Vitest for unit & integration testing.
