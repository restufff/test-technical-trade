import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Navbar from '../Navbar';
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

describe('Navbar Component', () => {
  it('renders branding and simulator mode badge', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText(/QA-Pre-Test|INDODAX/i)).toBeInTheDocument();
    expect(screen.getByText(/Trading Simulator|DEMO SIMULATOR/i)).toBeInTheDocument();
  });

  it('renders Faucet Deposit button and Login button when unauthenticated', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText(/Faucet Saldo/i)).toBeInTheDocument();
    expect(screen.getByText(/Masuk/i)).toBeInTheDocument();
  });
});
