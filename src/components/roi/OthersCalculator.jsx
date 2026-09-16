import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { SliderInput, MonthsInput, PresetRow, CalculatorCard } from "./inputs";
import { fmt, getRiskLevel, calcFD, calcRD, calcSavings } from "./roiMath";
import { COMPOUND_FREQ, TENURE_PRESETS, BANK_RATES } from "./constants";

// The "Others" tab: deposit-product calculators that share the results panel
// on the right via an `onResult` callback. Each one computes its result with
// useMemo and pushes it up in an effect, so the parent re-renders once per
// meaningful input change rather than on every keystroke of the parent.

const DEPOSIT_TYPES = [
  { key: "fd", icon: "🏦", label: "Fixed Deposit" },
  { key: "rd", icon: "📅", label: "Recurring Deposit" },
  { key: "savings", icon: "💰", label: "Savings Account" },
];

const RD_PRESET_PROPS = { accent: "#10B981", tint: "#ECFDF5", activeText: "#059669" };
const BANK_PRESET_PROPS = { accent: "#F97316", tint: "#FFF7ED", activeText: "#EA580C", padY: 4 };

/** Pushes `result` to the parent whenever it changes. */
function usePublishResult(result, onResult) {
  useEffect(() => {
    if (onResult) onResult(result);
  }, [result, onResult]);
}

function FDCalculator({ s, amountPresets, onResult }) {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(3);
  const [freq, setFreq] = useState(COMPOUND_FREQ[1]);

  const result = useMemo(() => {
    const { maturity, interest, roi } = calcFD(principal, rate, years, freq.n);
    return {
      cards: [
        { label: "Maturity Amount", value: fmt(maturity, s), accent: "#10B981" },
        { label: "Interest Earned", value: fmt(interest, s), accent: "#2563EB" },
        { label: "Total ROI", value: `${roi.toFixed(2)}%`, accent: "#7C3AED" },
      ],
      risk: getRiskLevel(roi),
      interpretation: `At ${rate}% p.a. compounded ${freq.label.toLowerCase()}, ${s}${principal.toLocaleString("en-IN")} grows to ${fmt(maturity, s)} in ${years} year${years !== 1 ? "s" : ""}. That's ${s}${Math.round(interest / (years * 12)).toLocaleString("en-IN")}/month in interest on average.`,
    };
  }, [principal, rate, years, freq, s]);

  usePublishResult(result, onResult);

  return (
    <CalculatorCard icon="🏦" iconBg="#EFF6FF" title="Fixed Deposit Calculator" subtitle="Compound interest on lump sum deposit">
      <SliderInput label="Principal Amount" value={principal} min={1000} max={10000000} step={1000} onChange={setPrincipal} symbol={s} presets={amountPresets} />
      <SliderInput label="Interest Rate (p.a.)" value={rate} min={1} max={20} step={0.25} onChange={setRate} suffix="%" />
      <SliderInput label="Tenure" value={years} min={0.5} max={10} step={0.5} onChange={setYears} suffix="yrs" />
      <div style={{ marginBottom: 4 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>Compounding Frequency</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COMPOUND_FREQ.map((f) => (
            <button key={f.label} onClick={() => setFreq(f)} style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: freq.n === f.n ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0",
              background: freq.n === f.n ? "#EFF6FF" : "#fff",
              color: freq.n === f.n ? "#2563EB" : "#64748B",
            }}>{f.label}</button>
          ))}
        </div>
      </div>
    </CalculatorCard>
  );
}
FDCalculator.propTypes = { s: PropTypes.string.isRequired, amountPresets: PropTypes.array, onResult: PropTypes.func };

function RDCalculator({ s, onResult }) {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [months, setMonths] = useState(24);

  const result = useMemo(() => {
    const { totalInvested, interest, maturity, annualRate } = calcRD(monthly, rate, months);
    return {
      cards: [
        { label: "Total Invested", value: fmt(totalInvested, s), accent: "#2563EB" },
        { label: "Interest Earned", value: fmt(interest, s), accent: "#10B981" },
        { label: "Maturity Amount", value: fmt(maturity, s), accent: "#7C3AED" },
      ],
      risk: getRiskLevel((interest / totalInvested) * 100),
      interpretation: `Depositing ${s}${monthly.toLocaleString("en-IN")}/month for ${months} months at ${rate}% p.a. gives you ${fmt(maturity, s)}. Effective annualized return: ${annualRate.toFixed(2)}% p.a.`,
      extra: { totalInvested, maturity },
    };
  }, [monthly, rate, months, s]);

  usePublishResult(result, onResult);

  return (
    <CalculatorCard icon="📅" iconBg="#F0FDF4" title="Recurring Deposit Calculator" subtitle="Monthly savings with fixed interest (Indian SI method)">
      <SliderInput label="Monthly Deposit" value={monthly} min={100} max={100000} step={100} onChange={setMonthly} symbol={s}
        presets={[{ label: "1K", value: 1000 }, { label: "5K", value: 5000 }, { label: "10K", value: 10000 }, { label: "25K", value: 25000 }]} />
      <SliderInput label="Interest Rate (p.a.)" value={rate} min={1} max={12} step={0.25} onChange={setRate} suffix="%" />
      <MonthsInput label="Tenure" value={months} onChange={setMonths} presets={TENURE_PRESETS} presetProps={RD_PRESET_PROPS} />
    </CalculatorCard>
  );
}
RDCalculator.propTypes = { s: PropTypes.string.isRequired, onResult: PropTypes.func };

function SavingsCalculator({ s, onResult }) {
  const [balance, setBalance] = useState(50000);
  const [rate, setRate] = useState(3.5);
  const [months, setMonths] = useState(12);
  const [monthlyAdd, setMonthlyAdd] = useState(0);

  const result = useMemo(() => {
    const { total, interest, roi, monthlyInterest } = calcSavings(balance, rate, months, monthlyAdd);
    return {
      cards: [
        { label: "Final Balance", value: fmt(total, s), accent: "#7C3AED" },
        { label: "Interest Earned", value: fmt(interest, s), accent: "#10B981" },
        { label: "Monthly Interest", value: fmt(monthlyInterest, s), accent: "#F97316" },
      ],
      risk: getRiskLevel(roi),
      interpretation: `At ${rate}% p.a. on ${s}${balance.toLocaleString("en-IN")} balance${monthlyAdd > 0 ? ` + ${s}${monthlyAdd.toLocaleString("en-IN")}/month` : ""} for ${months} months, you earn ${fmt(interest, s)} in interest. Final balance: ${fmt(total, s)}.`,
    };
  }, [balance, rate, months, monthlyAdd, s]);

  usePublishResult(result, onResult);

  return (
    <CalculatorCard icon="💰" iconBg="#FFF7ED" title="Savings Account Calculator" subtitle="Monthly compounding on your savings balance">
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>Quick pick — Indian bank rates</p>
        <PresetRow
          presets={BANK_RATES.map((b) => ({ label: `${b.name} ${b.rate}%`, value: b.rate }))}
          value={rate}
          onChange={setRate}
          {...BANK_PRESET_PROPS}
        />
      </div>
      <SliderInput label="Current Balance" value={balance} min={0} max={5000000} step={1000} onChange={setBalance} symbol={s}
        presets={[{ label: "10K", value: 10000 }, { label: "50K", value: 50000 }, { label: "1L", value: 100000 }, { label: "5L", value: 500000 }]} />
      <SliderInput label="Interest Rate (p.a.)" value={rate} min={1} max={10} step={0.1} onChange={setRate} suffix="%" />
      <SliderInput label="Monthly Addition" value={monthlyAdd} min={0} max={100000} step={500} onChange={setMonthlyAdd} symbol={s} />
      <MonthsInput label="Period" value={months} onChange={setMonths} />
    </CalculatorCard>
  );
}
SavingsCalculator.propTypes = { s: PropTypes.string.isRequired, onResult: PropTypes.func };

/** FD / RD / Savings behind a compact inline tab switcher. */
export default function OthersCalculator({ s, amountPresets, onResult }) {
  const [type, setType] = useState("fd");

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: "6px", marginBottom: 16, display: "flex", gap: 4 }}>
        {DEPOSIT_TYPES.map((t) => (
          <button key={t.key} onClick={() => { setType(t.key); if (onResult) onResult(null); }} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            padding: "9px 8px", borderRadius: 8, cursor: "pointer", border: "none",
            background: type === t.key ? "linear-gradient(135deg,#2563EB,#4F46E5)" : "transparent",
            color: type === t.key ? "#fff" : "#64748B",
            fontSize: 13, fontWeight: 600, transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 15 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      {type === "fd" && <FDCalculator s={s} amountPresets={amountPresets} onResult={onResult} />}
      {type === "rd" && <RDCalculator s={s} onResult={onResult} />}
      {type === "savings" && <SavingsCalculator s={s} onResult={onResult} />}
    </div>
  );
}

OthersCalculator.propTypes = {
  /** Currency symbol. */
  s: PropTypes.string.isRequired,
  amountPresets: PropTypes.array,
  /** Receives the active calculator's result, or null when switching type. */
  onResult: PropTypes.func,
};
