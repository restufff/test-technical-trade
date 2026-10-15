import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TradingForm from '../TradingForm';
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

describe('TradingForm Component', () => {
  it('renders Buy and Sell tabs and Limit / Market order type selectors', () => {
    renderWithProviders(<TradingForm />);

    expect(screen.getByRole('button', { name: /Beli/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Jual/i })).toBeInTheDocument();
    expect(screen.getByText('Limit')).toBeInTheDocument();
    expect(screen.getByText('Market')).toBeInTheDocument();
  });

  it('renders 25%, 50%, 75%, 100% quick percentage buttons', () => {
    renderWithProviders(<TradingForm />);

    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
