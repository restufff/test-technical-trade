import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import OrdersTable from '../OrdersTable';
import { AuthProvider } from '@/context/AuthContext';
import { MarketProvider } from '@/context/MarketContext';
import { TradingProvider } from '@/context/TradingContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <MarketProvider autoTick={false}>
        <TradingProvider>{ui}</TradingProvider>
      </MarketProvider>
    </AuthProvider>
  );
};

describe('OrdersTable Component', () => {
  it('renders tab options: Open Orders, Order History, and Asset Wallet', () => {
    renderWithProviders(<OrdersTable />);

    expect(screen.getByRole('button', { name: /Order Terbuka/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Riwayat Order/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Aset & Saldo/i })).toBeInTheDocument();
  });

  it('renders empty state when there are no open orders', () => {
    renderWithProviders(<OrdersTable />);
    expect(screen.getByText(/Belum ada order terbuka/i)).toBeInTheDocument();
  });
});
