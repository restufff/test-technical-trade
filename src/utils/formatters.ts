/**
 * Format a number into Indonesian Rupiah (IDR) format: "Rp 1.050.000.000"
 */
export function formatIDR(value: number): string {
  if (isNaN(value)) return 'Rp 0';
  const isNegative = value < 0;
  const absValue = Math.abs(Math.round(value));
  const formatted = absValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

/**
 * Format crypto balance with sensible decimal places.
 */
export function formatCrypto(value: number, decimals: number = 2): string {
  if (isNaN(value) || value === 0) {
    return (0).toFixed(decimals);
  }

  // Format with fixed decimals
  const fixed = value.toFixed(decimals);

  // If decimals >= 4, trim trailing zeroes unless it has only 2 decimal places
  if (decimals > 4) {
    const trimmed = fixed.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
    return trimmed;
  }

  return fixed;
}

/**
 * Format percentage change: "+2.45%" or "-3.12%"
 */
export function formatPercent(value: number): string {
  if (isNaN(value)) return '0.00%';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

/**
 * Parse string user input (which may contain dots as thousand separators or commas as decimals)
 */
export function parseNumericInput(input: string): number {
  if (!input || typeof input !== 'string') return 0;

  let cleaned = input.trim();

  // If it matches IDR style with dots as thousand separators (e.g., "1.050.000")
  if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, '');
  } else {
    // Replace comma with dot if comma is used as decimal separator
    cleaned = cleaned.replace(',', '.');
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format timestamp into HH:mm:ss or DD/MM HH:mm
 */
export function formatTime(timestamp: number, includeDate: boolean = false): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  if (includeDate) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}:${seconds}`;
}
