import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import HomePage from '../page';

describe('Main Exchange Trading Page', () => {
  it('renders exchange layout elements: Navbar, TickerBar, Chart, OrderBook, TradingForm, and OrdersTable', () => {
    render(<HomePage />);

    // Brand and Demo badge
    expect(screen.getByText(/QA-Pre-Test|INDODAX/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Trading Simulator|DEMO SIMULATOR/i).length).toBeGreaterThan(0);

    // Chart header
    expect(screen.getByText('Waktu:')).toBeInTheDocument();

    // Order Book (in panel switcher and header)
    expect(screen.getAllByText('Order Book').length).toBeGreaterThan(0);

    // Trading Form tabs
    expect(screen.getByText('Market')).toBeInTheDocument();

    // Orders Table tabs
    expect(screen.getByText(/Riwayat Order/i)).toBeInTheDocument();
  });
});
