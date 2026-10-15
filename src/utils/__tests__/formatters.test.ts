import { describe, it, expect } from 'vitest';
import { formatIDR, formatCrypto, formatPercent, parseNumericInput } from '../formatters';

describe('Formatters', () => {
  describe('formatIDR', () => {
    it('formats large numbers into Indonesian Rupiah with dot separators', () => {
      expect(formatIDR(1050000000)).toBe('Rp 1.050.000.000');
      expect(formatIDR(50000)).toBe('Rp 50.000');
      expect(formatIDR(0)).toBe('Rp 0');
    });

    it('handles negative IDR amounts correctly', () => {
      expect(formatIDR(-1500000)).toBe('-Rp 1.500.000');
    });
  });

  describe('formatCrypto', () => {
    it('formats crypto amounts with specified decimals without trailing zeros if requested', () => {
      expect(formatCrypto(0.0125, 4)).toBe('0.0125');
      expect(formatCrypto(1.23456789, 8)).toBe('1.23456789');
      expect(formatCrypto(100, 2)).toBe('100.00');
      expect(formatCrypto(0)).toBe('0.00');
    });
  });

  describe('formatPercent', () => {
    it('formats positive percentage with plus sign and 2 decimals', () => {
      expect(formatPercent(2.45)).toBe('+2.45%');
      expect(formatPercent(0)).toBe('0.00%');
    });

    it('formats negative percentage with minus sign and 2 decimals', () => {
      expect(formatPercent(-3.12)).toBe('-3.12%');
    });
  });

  describe('parseNumericInput', () => {
    it('sanitizes string numbers and commas into valid floats', () => {
      expect(parseNumericInput('1.050.000')).toBe(1050000);
      expect(parseNumericInput('0,0125')).toBe(0.0125);
      expect(parseNumericInput('abc')).toBe(0);
    });
  });
});
