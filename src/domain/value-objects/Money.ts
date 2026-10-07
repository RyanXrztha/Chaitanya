/** Amounts are stored as whole or fractional Nepali Rupees. */
export type Npr = number;

const grouping = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const groupingDecimals = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Lakh/crore grouping, e.g. 12350 → "12,350", 125000 → "1,25,000". */
export function formatAmount(amount: Npr, opts: { decimals?: boolean } = {}): string {
  return (opts.decimals ? groupingDecimals : grouping).format(amount);
}

/** "NPR 4,000" — or "NPR 250.00" with decimals (product prices, receipts). */
export function formatNpr(amount: Npr, opts: { decimals?: boolean } = {}): string {
  return `NPR ${formatAmount(amount, opts)}`;
}

/** "Rs 1,000" — the short form used on price-range sliders. */
export function formatRs(amount: Npr): string {
  return `Rs ${formatAmount(amount)}`;
}
