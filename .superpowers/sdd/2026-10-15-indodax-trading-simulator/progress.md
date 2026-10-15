# SDD ledger — plan: docs/superpowers/plans/2026-10-15-indodax-trading-simulator.md
Pre-flight: scan clean.
- Task 2 Produces `formatIDR`, `formatCrypto`, `mockMarkets`, `TradingPair`, `Order`, `Trade`, `UserAccount`, `WalletBalances` -> Consumed by Tasks 3, 4, 5, 6, 7, 8, 9, 10, 11.
- Task 3 Produces `useAuth` -> Consumed by Tasks 5, 6, 9.
- Task 4 Produces `useMarket` -> Consumed by Tasks 5, 6, 7, 8, 9, 10.
- Task 5 Produces `useTrading` -> Consumed by Tasks 6, 9, 10.
- Task 7, 8, 9, 10 Produce UI Components -> Consumed by Task 11 (Main Page Assembly).
Pre-flight: clean, no interface conflicts.
