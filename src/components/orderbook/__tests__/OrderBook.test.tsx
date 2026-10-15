import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import OrderBook from '../OrderBook';
import { MarketProvider } from '@/context/MarketContext';
import { INITIAL_PAIRS } from '@/data/mockMarkets';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <MarketProvider autoTick={false}>
      {ui}
    </MarketProvider>
  );
};

describe('OrderBook Component', () => {
  it('renders order book headers and spread section', () => {
    renderWithProvider(<OrderBook />);

    expect(screen.getByText('Order Book')).toBeInTheDocument();
    expect(screen.getByText(/Harga/i)).toBeInTheDocument();
    expect(screen.getByText(/Spread/i)).toBeInTheDocument();
  });

  it('triggers onSelectPrice when a price row is clicked', () => {
    const handleSelectPrice = vi.fn();
    renderWithProvider(<OrderBook onSelectPrice={handleSelectPrice} />);

    // Query rows by test id or find row containing price
    const buttons = screen.getAllByRole('button');
    // Skip the 3 mode buttons (both, bids, asks)
    const priceRowButton = buttons.find(b => !b.title);
    expect(priceRowButton).toBeDefined();

    if (priceRowButton) {
      fireEvent.click(priceRowButton);
      expect(handleSelectPrice).toHaveBeenCalled();
    }
  });
});
