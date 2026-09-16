// Pure calculation module for the ROI calculator — no React, no DOM.
// Every number the page displays is produced here, so the formulas can be
// read (and tested) in one place instead of being scattered through JSX.
//
// Calculation order for the main ROI tab:
//   1. `boostedReturned` applies the What-if slider to the entered return.
//   2. Simple ROI %      = (returned - invested) / invested x 100
//   3. Annualized (CAGR) = ((returned/invested)^(1/(years*n)) - 1) * n * 100,
//      where n is the compounding frequency — so the annualized figure is
//      comparable with a bank's quoted p.a. rate.
//   4. Real ROI subtracts inflation over the whole holding period, not per
//      year, matching how the page labels it ("inflation-adjusted").
//   5. Break-even divides the principal by the *average annual* gain.
//
// All of these guard against a zero/blank principal by returning 0 rather
// than Infinity or NaN.

/** Compact Indian-notation currency: ₹1.20Cr / ₹3.40L / ₹5.6K / ₹640. */
export function fmt(val, symbol) {
  const n = Number.isFinite(val) ? val : 0;
  if (n >= 1e7) return `${symbol}${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `${symbol}${(n / 1e5).toFixed(2)}L`;
  if (n >= 1e3) return `${symbol}${(n / 1e3).toFixed(1)}K`;
  return `${symbol}${Math.round(n).toLocaleString("en-IN")}`;
}

/** Simple return on investment, as a percentage. */
export function calcROI(invested, returned) {
  if (!invested || invested === 0) return 0;
  return ((returned - invested) / invested) * 100;
}

/**
 * Annualized return (CAGR), expressed as a nominal p.a. rate at the given
 * compounding frequency `n` (12 monthly, 4 quarterly, 2 half-yearly,
 * 1 annually).
 */
export function calcAnnualized(invested, returned, years, n) {
  if (!invested || !years || invested === 0 || years === 0) return 0;
  return (Math.pow(returned / invested, 1 / (years * n)) - 1) * n * 100;
}

/**
 * Years to recover the principal at the current average annual gain.
 * Returns null when there is no gain to recover it from.
 */
export function calcBreakEven(invested, gain, years) {
  if (!(gain > 0) || !years) return null;
  return (invested / (gain / years)).toFixed(1);
}

/** Nominal ROI less total inflation over the holding period. */
export function calcRealROI(roi, inflationRate, years) {
  return roi - inflationRate * years;
}

/** Banding used for the colour, icon and headline on the results panel. */
export function getRiskLevel(roi) {
  if (roi <= 0) return { label: "Loss", color: "#EF4444", bg: "#FEF2F2", icon: "↓" };
  if (roi <= 15) return { label: "Conservative", color: "#10B981", bg: "#ECFDF5", icon: "✓" };
  if (roi <= 50) return { label: "Moderate", color: "#F59E0B", bg: "#FFFBEB", icon: "~" };
  if (roi <= 200) return { label: "High Return", color: "#F97316", bg: "#FFF7ED", icon: "!" };
  return { label: "Unrealistic — verify inputs", color: "#EF4444", bg: "#FEF2F2", icon: "⚠" };
}

/** Plain-English reading of the result, matched to the same ROI bands. */
export function getInterpretation(roi, annualized, years, symbol, gain) {
  if (roi <= 0) return `You lost ${Math.abs(roi).toFixed(1)}% on this investment. Consider reviewing the strategy.`;
  if (roi <= 10) return `A modest return. Better than keeping cash, but below most market benchmarks.`;
  if (roi <= 30) return `A solid return${years > 1 ? ` over ${years} years` : ""}. Comparable to a good fixed deposit.`;
  if (roi <= 100) return `Strong performance. Your money grew by ${symbol}${Math.abs(gain).toLocaleString("en-IN")} — better than most FDs and comparable to equity markets.`;
  return `Exceptional return of ${roi.toFixed(1)}%. Annualized, that's ${annualized.toFixed(1)}% per year — significantly above market benchmarks.`;
}

/**
 * Fixed deposit: standard compound interest.
 *   maturity = P x (1 + r/n)^(n x t)
 */
export function calcFD(principal, ratePct, years, n) {
  const maturity = principal * Math.pow(1 + (ratePct / 100) / n, n * years);
  const interest = maturity - principal;
  return { maturity, interest, roi: principal ? (interest / principal) * 100 : 0 };
}

/**
 * Recurring deposit, using the simple-interest method Indian banks quote:
 *   interest = P x n x (n+1) x r / (2 x 12 x 100)
 * where n is the number of monthly instalments. Each instalment earns
 * interest for a different number of months, which is what the n(n+1)/2
 * triangular term captures.
 */
export function calcRD(monthly, ratePct, months) {
  const totalInvested = monthly * months;
  const interest = monthly * months * (months + 1) * ratePct / (2 * 12 * 100);
  const maturity = totalInvested + interest;
  const roi = totalInvested ? (interest / totalInvested) * 100 : 0;
  return {
    totalInvested,
    interest,
    maturity,
    roi,
    // Effective p.a. rate, i.e. the total ROI spread over the tenure.
    annualRate: months ? roi / (months / 12) : 0,
  };
}

/**
 * Savings account: monthly compounding on the running balance, with an
 * optional monthly top-up added *after* each month's interest is credited.
 */
export function calcSavings(balance, ratePct, months, monthlyAdd) {
  const r = ratePct / 100 / 12;
  let total = balance;
  for (let i = 0; i < months; i++) total = total * (1 + r) + monthlyAdd;
  const totalDeposited = balance + monthlyAdd * months;
  const interest = total - totalDeposited;
  return {
    total,
    totalDeposited,
    interest,
    roi: totalDeposited ? (interest / totalDeposited) * 100 : 0,
    monthlyInterest: months ? interest / months : 0,
  };
}
