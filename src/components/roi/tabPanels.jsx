import PropTypes from "prop-types";
import { SliderInput } from "./inputs";
import { fmt, calcROI } from "./roiMath";
import { COMPOUND_FREQ } from "./constants";

// The left-hand input panels, one per tab on the ROI calculator.

const cardStyle = { background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 };
const headingStyle = { fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 20px" };

/** Amount in / amount out / holding period, plus the inflation toggle. */
export function InvestmentDetailsPanel({
  symbol, invested, setInvested, returned, setReturned, years, setYears,
  amountPresets, inflationOn, setInflationOn, inflationRate, setInflationRate,
}) {
  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>Investment Details</h2>
      <SliderInput label="Amount Invested" value={invested} min={1000} max={10000000} step={1000} onChange={setInvested} symbol={symbol} presets={amountPresets} />
      <SliderInput label="Amount Returned" value={returned} min={0} max={20000000} step={1000} onChange={setReturned} symbol={symbol} presets={amountPresets} />
      <SliderInput label="Time Period" value={years} min={0.5} max={30} step={0.5} onChange={setYears} suffix="yrs" />

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid #F1F5F9" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 600 }}>
          <div onClick={() => setInflationOn(!inflationOn)} style={{ width: 36, height: 20, borderRadius: 10, background: inflationOn ? "#2563EB" : "#E2E8F0", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 2, left: inflationOn ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
          Adjust for inflation
        </label>
        {inflationOn && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <input type="number" value={inflationRate} min={0} max={20} step={0.5}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              style={{ width: 60, height: 32, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 8px", fontSize: 13, fontWeight: 600, textAlign: "center" }} />
            <span style={{ fontSize: 13, color: "#94A3B8" }}>% / yr</span>
          </div>
        )}
      </div>
    </div>
  );
}
InvestmentDetailsPanel.propTypes = {
  symbol: PropTypes.string.isRequired,
  invested: PropTypes.number.isRequired,
  setInvested: PropTypes.func.isRequired,
  returned: PropTypes.number.isRequired,
  setReturned: PropTypes.func.isRequired,
  years: PropTypes.number.isRequired,
  setYears: PropTypes.func.isRequired,
  amountPresets: PropTypes.array,
  inflationOn: PropTypes.bool.isRequired,
  setInflationOn: PropTypes.func.isRequired,
  inflationRate: PropTypes.number.isRequired,
  setInflationRate: PropTypes.func.isRequired,
};

/** Advanced tab: how often returns compound. */
export function CompoundingPanel({ compoundFreq, setCompoundFreq }) {
  return (
    <div style={cardStyle}>
      <h2 style={{ ...headingStyle, margin: "0 0 16px" }}>Compounding Frequency</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {COMPOUND_FREQ.map((f) => (
          <button key={f.label} onClick={() => setCompoundFreq(f)} style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: compoundFreq.n === f.n ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0",
            background: compoundFreq.n === f.n ? "#EFF6FF" : "#fff",
            color: compoundFreq.n === f.n ? "#2563EB" : "#64748B",
          }}>{f.label}</button>
        ))}
      </div>
    </div>
  );
}
CompoundingPanel.propTypes = {
  compoundFreq: PropTypes.shape({ label: PropTypes.string, n: PropTypes.number }).isRequired,
  setCompoundFreq: PropTypes.func.isRequired,
};

/** Compare tab: a second investment B side by side with A. */
export function ComparePanel({
  symbol, amountPresets, inv2, setInv2, ret2, setRet2, years2, setYears2,
  roi, annualized, gain, roi2, annualized2,
}) {
  const rows = [
    { label: "Investment A", roi, ann: annualized, gain },
    { label: "Investment B (FD)", roi: roi2, ann: annualized2, gain: ret2 - inv2 },
  ];
  return (
    <div style={cardStyle}>
      <h2 style={{ ...headingStyle, margin: "0 0 4px" }}>Investment B</h2>
      <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 20px" }}>Compare against an FD or alternative investment</p>
      <SliderInput label="Amount Invested (B)" value={inv2} min={1000} max={10000000} step={1000} onChange={setInv2} symbol={symbol} presets={amountPresets} />
      <SliderInput label="Amount Returned (B)" value={ret2} min={0} max={20000000} step={1000} onChange={setRet2} symbol={symbol} presets={amountPresets} />
      <SliderInput label="Time Period (B)" value={years2} min={0.5} max={30} step={0.5} onChange={setYears2} suffix="yrs" />
      <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px", marginTop: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {rows.map((item, i) => (
            <div key={item.label} style={{ background: "#fff", borderRadius: 10, padding: "12px 14px", border: `1.5px solid ${item.roi > (i === 0 ? roi2 : roi) ? "#10B981" : "#E2E8F0"}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.roi >= 0 ? "#10B981" : "#EF4444" }}>{item.roi.toFixed(1)}%</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>ROI</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginTop: 8 }}>{item.ann.toFixed(2)}% p.a.</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>Annualized</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: item.gain >= 0 ? "#10B981" : "#EF4444", marginTop: 8 }}>
                {item.gain >= 0 ? "+" : ""}{fmt(item.gain, symbol)}
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>Gain/Loss</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", background: roi > roi2 ? "#ECFDF5" : roi < roi2 ? "#FEF2F2" : "#F8FAFC", borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: roi > roi2 ? "#059669" : roi < roi2 ? "#DC2626" : "#64748B", margin: 0, fontWeight: 600 }}>
            {roi > roi2 ? `✓ Investment A outperforms B by ${(roi - roi2).toFixed(1)}pp`
              : roi < roi2 ? `Investment B outperforms A by ${(roi2 - roi).toFixed(1)}pp`
                : "Both investments have equal ROI"}
          </p>
        </div>
      </div>
    </div>
  );
}
ComparePanel.propTypes = {
  symbol: PropTypes.string.isRequired,
  amountPresets: PropTypes.array,
  inv2: PropTypes.number.isRequired,
  setInv2: PropTypes.func.isRequired,
  ret2: PropTypes.number.isRequired,
  setRet2: PropTypes.func.isRequired,
  years2: PropTypes.number.isRequired,
  setYears2: PropTypes.func.isRequired,
  roi: PropTypes.number.isRequired,
  annualized: PropTypes.number.isRequired,
  gain: PropTypes.number.isRequired,
  roi2: PropTypes.number.isRequired,
  annualized2: PropTypes.number.isRequired,
};

/** What-if tab: scale the return up or down and see the ROI move. */
export function WhatIfPanel({ whatIfBoost, setWhatIfBoost, invested, returned, roi }) {
  return (
    <div style={cardStyle}>
      <h2 style={{ ...headingStyle, margin: "0 0 4px" }}>What-if Scenario</h2>
      <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 20px" }}>How does your ROI change if returns improve or worsen?</p>
      <SliderInput label="Return boost/cut" value={whatIfBoost} min={-50} max={100} step={5} onChange={setWhatIfBoost} suffix="%" />
      <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Base ROI</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{calcROI(invested, returned).toFixed(2)}%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#2563EB", fontWeight: 600 }}>With {whatIfBoost > 0 ? "+" : ""}{whatIfBoost}% scenario</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>{roi.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}
WhatIfPanel.propTypes = {
  whatIfBoost: PropTypes.number.isRequired,
  setWhatIfBoost: PropTypes.func.isRequired,
  invested: PropTypes.number.isRequired,
  returned: PropTypes.number.isRequired,
  roi: PropTypes.number.isRequired,
};

/** Risk band + plain-English reading, under the input panels. */
export function InterpretationCard({ risk, interpretation }) {
  return (
    <div style={{ background: risk.bg, borderRadius: 12, padding: "16px 18px", border: `1px solid ${risk.color}30` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{risk.icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: risk.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>{risk.label}</span>
      </div>
      <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>{interpretation}</p>
    </div>
  );
}
InterpretationCard.propTypes = {
  risk: PropTypes.shape({ bg: PropTypes.string, color: PropTypes.string, icon: PropTypes.string, label: PropTypes.string }).isRequired,
  interpretation: PropTypes.string.isRequired,
};
