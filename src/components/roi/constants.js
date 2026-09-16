// Reference data for the ROI calculator: market benchmarks, supported
// currencies, compounding options and the quick-pick presets.

/** Long-run Indian averages the user's annualized return is compared against. */
export const BENCHMARKS = [
  { label: "FD (Bank)", roi: 7, color: "#6366F1" },
  { label: "Gold", roi: 12, color: "#F59E0B" },
  { label: "Nifty 50", roi: 14, color: "#10B981" },
  { label: "Real Estate", roi: 9, color: "#3B82F6" },
];

export const CURRENCIES = [
  { symbol: "₹", code: "INR" },
  { symbol: "$", code: "USD" },
  { symbol: "€", code: "EUR" },
  { symbol: "£", code: "GBP" },
];

/** `n` is the number of compounding periods per year. */
export const COMPOUND_FREQ = [
  { label: "Monthly", n: 12 },
  { label: "Quarterly", n: 4 },
  { label: "Half-yearly", n: 2 },
  { label: "Annually", n: 1 },
];

export const AMOUNT_PRESETS = [
  { label: "10K", value: 10000 }, { label: "50K", value: 50000 },
  { label: "1L", value: 100000 }, { label: "5L", value: 500000 },
  { label: "10L", value: 1000000 }, { label: "1Cr", value: 10000000 },
];

export const TENURE_PRESETS = [
  { label: "6M", value: 6 }, { label: "1Yr", value: 12 },
  { label: "2Yr", value: 24 }, { label: "3Yr", value: 36 },
  { label: "5Yr", value: 60 },
];

/** Indicative savings-account rates, for the quick-pick row. */
export const BANK_RATES = [
  { name: "SBI", rate: 2.7 }, { name: "HDFC", rate: 3.0 },
  { name: "Kotak 811", rate: 3.5 }, { name: "IDFC FIRST", rate: 6.0 },
  { name: "AU Small Finance", rate: 7.0 },
];

export const ROI_TABS = [
  { key: "basic", label: "Basic ROI" },
  { key: "advanced", label: "Advanced" },
  { key: "compare", label: "Compare" },
  { key: "whatif", label: "What-if" },
  { key: "others", label: "Others" },
];
