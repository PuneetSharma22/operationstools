// Shared FAQ content for the ROI Calculator page — used both for the
// visible FAQ section (ROISeoSection.jsx) and the FAQPage structured data
// (ROICalculatorPage.jsx). Kept in one place so the two can never drift:
// Google requires FAQPage schema to match the page's visible FAQ content.
export const FAQS = [
  { q: "What is a return on investment calculator?", a: "A return on investment calculator (ROI calculator) does the ROI, annualized return, and break-even math for you automatically. Enter what you invested and what you got back, and it instantly shows your percentage return, compares it against benchmarks like FD or Nifty 50, and can adjust for inflation to show your real, purchasing-power growth." },
  { q: "What is ROI?", a: "ROI (Return on Investment) measures the gain or loss from an investment relative to its cost. Formula: ROI% = ((Amount Returned − Amount Invested) ÷ Amount Invested) × 100." },
  { q: "Can I use this for stocks, mutual funds, FDs, or a business investment?", a: "Yes. The calculator only needs an amount invested, amount returned, and a holding period — it works the same way whether that's a stock trade, a mutual fund, a fixed deposit, or money put into equipment or a business expansion." },
  { q: "What is a good ROI in India?", a: "A good ROI depends on the investment type. Bank FDs offer ~7% p.a., gold averages ~12% over 10 years, and Nifty 50 has historically returned ~14% p.a. Any annualized return above 15% is considered strong." },
  { q: "What is annualized ROI?", a: "Annualized ROI (also called CAGR) normalizes the return over a multi-year period to show the equivalent annual rate. It accounts for compounding frequency — monthly, quarterly, or annually." },
  { q: "How is break-even calculated?", a: "Break-even point is the number of years it takes to recover your investment at the current annual gain rate. Break-even = Amount Invested ÷ Annual Gain." },
  { q: "What does inflation-adjusted ROI mean?", a: "Real ROI subtracts the inflation rate from your nominal ROI. If your investment returns 12% but inflation is 6%, your real purchasing power only grew by ~6%." },
  { q: "Is this ROI calculator free?", a: "Yes — completely free, no login required, and your data never leaves your device." },
];
