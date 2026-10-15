# Indodax Crypto Trading Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-performance, modern static crypto trading web application inspired by Indodax using React, Next.js, and TypeScript with static authentication, simulated real-time market data, interactive charts, and complete paper trading capabilities.

**Architecture:** Client-centric Next.js App Router application optimized for static export. State is decoupled into modular React Contexts and hooks (`AuthContext`, `MarketContext`, `TradingContext`) with `localStorage` persistence, ensuring zero backend dependency while providing realistic order book simulation, limit/market order execution, and wallet management.

**Tech Stack:** Next.js 14, React 18/19, TypeScript, Tailwind CSS, Lucide React, Vitest & React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-15-indodax-trading-simulator-design.md`

## Global Constraints
- Must be a static web application (`output: 'export'` compatible Next.js app) with no external database requirements.
- Uses static authentication with preset demo accounts and persistent `localStorage` session.
- Visual theme follows Indodax dark mode (navy/deep slate background `#0b111e`, cyan primary `#00b8d9`, emerald buy `#0ecb81`, coral sell `#f6465d`).
- Indonesian Rupiah (IDR) formatting with proper digit grouping (e.g., `Rp 1.050.000.000`) and appropriate crypto decimals (up to 8 decimals).
- All trading operations (Buy, Sell, Cancel, Faucet Deposit) update balances immediately with zero race conditions.

## Review Focus
- Insufficient balance handling: Rejecting Buy if IDR < order total or Sell if crypto < order amount.
- Limit order fill logic: Correctly triggering limit buy/sell when simulated market price reaches or crosses limit price.
- Order cancellation: Restoring locked funds back to available balance without loss or duplication.
- Static export compatibility: Ensuring `window` / `localStorage` references are SSR-safe and do not cause hydration mismatch.
- Percentage quick buttons (25%, 50%, 75%, 100%): Accurately calculating amounts minus fees to prevent over-allocation.

---

### Task 1: Project Initialization & Configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `next.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

**Interfaces:**
- Produces: Runnable Next.js project with Tailwind CSS, Lucide React, and Vitest test runner.

- [ ] **Step 1: Initialize Next.js project dependencies in `package.json`**
Configure Next.js, React, Tailwind CSS, lucide-react, vitest, and testing utilities.

- [ ] **Step 2: Run npm install**
Run: `npm install`
Expected: Dependencies installed successfully.

- [ ] **Step 3: Setup configuration files**
Create `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, and `vitest.config.ts`.

- [ ] **Step 4: Verify build and test configuration**
Run: `npx vitest run` or smoke check
Expected: Runner executes with 0 errors.

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "chore: initialize next.js trading app project configuration"
```

---

### Task 2: Core Domain Models & Formatting Utilities

**Files:**
- Create: `src/types/trading.ts`
- Create: `src/utils/formatters.ts`
- Create: `src/data/mockMarkets.ts`
- Test: `src/utils/__tests__/formatters.test.ts`

**Interfaces:**
- Produces: `formatIDR(val: number): string`, `formatCrypto(val: number, decimals?: number): string`, `formatPercent(val: number): string`, types `TradingPair`, `Order`, `Trade`, `UserAccount`, `WalletBalances`.

- [ ] **Step 1: Write failing unit test for formatters**
Assert `formatIDR(1050000000)` outputs `"Rp 1.050.000.000"`, `formatCrypto(0.0125, 4)` outputs `"0.0125"`, `formatPercent(2.45)` outputs `"+2.45%"`.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/utils/__tests__/formatters.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement domain types, mock markets, and formatters**
Implement `src/types/trading.ts`, `src/data/mockMarkets.ts`, and `src/utils/formatters.ts`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/utils/__tests__/formatters.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/types/ src/data/ src/utils/
git commit -m "feat: add domain types, mock market data, and formatters with tests"
```

---

### Task 3: Static Authentication Context & Modal

**Files:**
- Create: `src/context/AuthContext.tsx`
- Create: `src/components/auth/LoginModal.tsx`
- Create: `src/components/auth/UserProfileModal.tsx`
- Test: `src/context/__tests__/AuthContext.test.tsx`

**Interfaces:**
- Consumes: `UserAccount` from `src/types/trading.ts`.
- Produces: `useAuth(): { user, isAuthenticated, login, logout, updateProfile }`.

- [ ] **Step 1: Write test for AuthContext**
Test login with predefined credentials (`demo@indodax.mock`), saving to `localStorage`, and logout clearing the session.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/context/__tests__/AuthContext.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement AuthContext and LoginModal**
Implement SSR-safe auth state in `src/context/AuthContext.tsx` and modern modal in `src/components/auth/LoginModal.tsx` with quick 1-click demo login buttons.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/context/__tests__/AuthContext.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/context/ src/components/auth/
git commit -m "feat: implement static auth context and login modal with tests"
```

---

### Task 4: Market Simulation Engine & Order Book Store

**Files:**
- Create: `src/context/MarketContext.tsx`
- Create: `src/utils/marketGenerator.ts`
- Test: `src/utils/__tests__/marketGenerator.test.ts`

**Interfaces:**
- Consumes: `mockMarkets` from `src/data/mockMarkets.ts`.
- Produces: `useMarket(): { currentPair, setPair, pairs, orderBook, recentTrades, tickerStats }`.

- [ ] **Step 1: Write test for market generator**
Test initial order book depth generation (bids < current price, asks > current price), and price tick jitter simulation.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/utils/__tests__/marketGenerator.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement MarketContext and marketGenerator**
Create realistic live order book bids/asks ladders, continuous simulated ticker fluctuations, and recent market trade generations.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/utils/__tests__/marketGenerator.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/context/MarketContext.tsx src/utils/marketGenerator.ts src/utils/__tests__/
git commit -m "feat: implement market simulation engine and order book context"
```

---

### Task 5: Trading Store & Wallet Engine

**Files:**
- Create: `src/context/TradingContext.tsx`
- Test: `src/context/__tests__/TradingContext.test.tsx`

**Interfaces:**
- Consumes: `useMarket` and `useAuth`.
- Produces: `useTrading(): { balances, openOrders, orderHistory, placeOrder, cancelOrder, depositFunds, resetBalances }`.

- [ ] **Step 1: Write test for TradingContext**
Test placing Market Buy (deducts IDR, adds crypto), placing Limit Sell (locks crypto in open order), and cancelling open order (unlocks crypto).

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/context/__tests__/TradingContext.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement TradingContext with balance locks and auto-execution**
Handle order placement validation, fees calculation (0.1%), order status tracking, and simulated deposit faucet.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/context/__tests__/TradingContext.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/context/TradingContext.tsx src/context/__tests__/
git commit -m "feat: implement trading store and wallet engine with tests"
```

---

### Task 6: Modern Navigation Header & Market Ticker Bar

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/market/MarketTickerBar.tsx`
- Create: `src/components/market/PairSelectorModal.tsx`
- Test: `src/components/layout/__tests__/Navbar.test.tsx`

**Interfaces:**
- Consumes: `useAuth`, `useMarket`, `useTrading`.
- Produces: Header navigation with Indodax branding, 24h ticker summary (Last Price, 24h Change, High, Low, Volume), Deposit Faucet button, and User Profile menu.

- [ ] **Step 1: Write test for Navbar component**
Test rendering of pair details, balance summary, and login/user state.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/components/layout/__tests__/Navbar.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement Navbar, MarketTickerBar, and PairSelectorModal**
Build modern UI with glassmorphic cards, glowing price change badges, and quick pair search.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/layout/__tests__/Navbar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/components/layout/ src/components/market/
git commit -m "feat: implement modern navbar and ticker bar components"
```

---

### Task 7: Interactive Candlestick & Volume Chart

**Files:**
- Create: `src/components/chart/TradingChart.tsx`
- Create: `src/components/chart/chartUtils.ts`
- Test: `src/components/chart/__tests__/chartUtils.test.ts`

**Interfaces:**
- Consumes: `currentPair` from `useMarket`.
- Produces: Interactive Candlestick / Area Chart with timeframe toggles (1m, 5m, 15m, 1h, 1D), volume histogram, price crosshair tooltips, and real-time tick animation.

- [ ] **Step 1: Write test for chart candle generator utility**
Test generation of initial historical candles (OHLCV) and updating current candle on live tick.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/components/chart/__tests__/chartUtils.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement SVG/Canvas Candlestick Chart**
Build interactive responsive chart component with high performance and zero external canvas bugs.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/chart/__tests__/chartUtils.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/components/chart/
git commit -m "feat: implement interactive candlestick and volume chart"
```

---

### Task 8: Real-Time Order Book & Market Trades Stream

**Files:**
- Create: `src/components/orderbook/OrderBook.tsx`
- Create: `src/components/orderbook/MarketTrades.tsx`
- Test: `src/components/orderbook/__tests__/OrderBook.test.tsx`

**Interfaces:**
- Consumes: `orderBook`, `recentTrades`, and callback to select price/amount in order form.
- Produces: Visual depth ladder (red asks on top, green bids on bottom, spread in middle, cumulative depth bars) and live trade stream.

- [ ] **Step 1: Write test for OrderBook component**
Test rendering bids and asks, clicking a price triggers selection callback.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/components/orderbook/__tests__/OrderBook.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement OrderBook and MarketTrades components**
Implement tabular depth view with animated row flashes on price updates.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/orderbook/__tests__/OrderBook.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/components/orderbook/
git commit -m "feat: implement order book depth ladder and market trades stream"
```

---

### Task 9: Buy & Sell Trading Form Component

**Files:**
- Create: `src/components/trading/TradingForm.tsx`
- Create: `src/components/trading/QuickPercentageButtons.tsx`
- Test: `src/components/trading/__tests__/TradingForm.test.tsx`

**Interfaces:**
- Consumes: `useTrading`, `useMarket`, `useAuth`.
- Produces: Dual Buy (Green) / Sell (Red) order forms with Limit & Market tabs, percentage sliders, estimated fee calculations, and instant validation errors.

- [ ] **Step 1: Write test for TradingForm**
Test switching between Limit/Market, percentage button calculations, and submitting Buy/Sell orders.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/components/trading/__tests__/TradingForm.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement TradingForm and QuickPercentageButtons**
Build high-polish trade widget with IDR and Crypto balance displays, input validation, and execution trigger.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/trading/__tests__/TradingForm.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/components/trading/
git commit -m "feat: implement buy and sell trading form with percentage controls"
```

---

### Task 10: Orders Table, Portfolio Assets & Faucet Modal

**Files:**
- Create: `src/components/orders/OrdersTable.tsx`
- Create: `src/components/portfolio/WalletModal.tsx`
- Create: `src/components/portfolio/DepositFaucetModal.tsx`
- Test: `src/components/orders/__tests__/OrdersTable.test.tsx`

**Interfaces:**
- Consumes: `useTrading`, `useMarket`.
- Produces: Tabbed tables for Open Orders (with Cancel button), Order History, Trade History, and simulated IDR deposit faucet modal.

- [ ] **Step 1: Write test for OrdersTable and cancel order action**
Test rendering open orders and clicking Cancel button calls `cancelOrder`.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/components/orders/__tests__/OrdersTable.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement OrdersTable, WalletModal, and DepositFaucetModal**
Build clear tables with status tags (Filled, Open, Cancelled) and intuitive deposit faucet modal with quick Rp 10M / Rp 50M / Rp 100M top-up.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/orders/__tests__/OrdersTable.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/components/orders/ src/components/portfolio/
git commit -m "feat: implement orders table, portfolio assets, and deposit faucet modal"
```

---

### Task 11: Main Exchange Page Assembly & Toast Notification System

**Files:**
- Create: `src/components/ui/ToastNotification.tsx`
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Test: `src/app/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: All components from Tasks 2-10.
- Produces: Complete responsive Indodax exchange trading application page with toast notifications and sound effects.

- [ ] **Step 1: Write integration smoke test for main trading page**
Verify exchange dashboard renders header, ticker, chart, orderbook, trade form, and orders table.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run src/app/__tests__/page.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Assemble full exchange in `src/app/page.tsx` and integrate toast notifications**
Combine grid layout, responsive breakpoints, sticky trade panel, and notification feedback.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/app/__tests__/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/app/ src/components/ui/
git commit -m "feat: assemble main exchange trading page with toast notifications"
```

---

### Task 12: Production Build & Full Static Export Verification

**Files:**
- Modify: `next.config.mjs` (ensure `output: 'export'` compatibility)
- Test: All tests in test suite

**Interfaces:**
- Produces: Verified, production-ready static Next.js build in `out/` directory.

- [ ] **Step 1: Run full test suite**
Run: `npm test` or `npx vitest run`
Expected: 100% tests PASS.

- [ ] **Step 2: Run production static build**
Run: `npm run build`
Expected: Static build completes with zero errors and generates HTML/JS/CSS assets.

- [ ] **Step 3: Commit and finalize**
```bash
git add .
git commit -m "chore: verify static export build and test suite passing"
```
