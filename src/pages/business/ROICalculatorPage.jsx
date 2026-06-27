import { useState, useRef, useEffect } from "react";

// ─── Benchmarks ───────────────────────────────────────────────────────────────
const BENCHMARKS = [
  { label: "FD (Bank)", roi: 7, color: "#6366F1" },
  { label: "Gold", roi: 12, color: "#F59E0B" },
  { label: "Nifty 50", roi: 14, color: "#10B981" },
  { label: "Real Estate", roi: 9, color: "#3B82F6" },
];

const CURRENCIES = [
  { symbol: "₹", code: "INR" },
  { symbol: "$", code: "USD" },
  { symbol: "€", code: "EUR" },
  { symbol: "£", code: "GBP" },
];

const COMPOUND_FREQ = [
  { label: "Monthly", n: 12 },
  { label: "Quarterly", n: 4 },
  { label: "Half-yearly", n: 2 },
  { label: "Annually", n: 1 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(val, symbol) {
  if (val >= 1e7) return `${symbol}${(val / 1e7).toFixed(2)}Cr`;
  if (val >= 1e5) return `${symbol}${(val / 1e5).toFixed(2)}L`;
  if (val >= 1e3) return `${symbol}${(val / 1e3).toFixed(1)}K`;
  return `${symbol}${Math.round(val).toLocaleString("en-IN")}`;
}

function calcROI(invested, returned) {
  if (!invested || invested === 0) return 0;
  return ((returned - invested) / invested) * 100;
}

function calcAnnualized(invested, returned, years, n) {
  if (!invested || !years || invested === 0 || years === 0) return 0;
  return (Math.pow(returned / invested, 1 / (years * n)) - 1) * n * 100;
}

function getRiskLevel(roi) {
  if (roi <= 0) return { label: "Loss", color: "#EF4444", bg: "#FEF2F2", icon: "↓" };
  if (roi <= 15) return { label: "Conservative", color: "#10B981", bg: "#ECFDF5", icon: "✓" };
  if (roi <= 50) return { label: "Moderate", color: "#F59E0B", bg: "#FFFBEB", icon: "~" };
  if (roi <= 200) return { label: "High Return", color: "#F97316", bg: "#FFF7ED", icon: "!" };
  return { label: "Unrealistic — verify inputs", color: "#EF4444", bg: "#FEF2F2", icon: "⚠" };
}

function getInterpretation(roi, annualized, years, symbol, gain) {
  if (roi <= 0) return `You lost ${Math.abs(roi).toFixed(1)}% on this investment. Consider reviewing the strategy.`;
  if (roi <= 10) return `A modest return. Better than keeping cash, but below most market benchmarks.`;
  if (roi <= 30) return `A solid return${years > 1 ? ` over ${years} years` : ""}. Comparable to a good fixed deposit.`;
  if (roi <= 100) return `Strong performance. Your money grew by ${symbol}${Math.abs(gain).toLocaleString("en-IN")} — better than most FDs and comparable to equity markets.`;
  return `Exceptional return of ${roi.toFixed(1)}%. Annualized, that's ${annualized.toFixed(1)}% per year — significantly above market benchmarks.`;
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ invested, returned, symbol }) {
  const gain = returned - invested;
  const total = Math.max(returned, invested, 1);
  const investedPct = (invested / total) * 100;
  const gainPct = (Math.abs(gain) / total) * 100;
  const isLoss = gain < 0;
  const r = 54, cx = 64, cy = 64, circ = 2 * Math.PI * r, gap = 3;
  const investedDash = (investedPct / 100) * circ;
  const gainDash = (gainPct / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="16" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2563EB" strokeWidth="16"
          strokeDasharray={`${investedDash - gap} ${circ - investedDash + gap}`}
          strokeDashoffset={circ * 0.25} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={isLoss ? "#EF4444" : "#10B981"} strokeWidth="16"
          strokeDasharray={`${gainDash - gap} ${circ - gainDash + gap}`}
          strokeDashoffset={circ * 0.25 - investedDash} strokeLinecap="round" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F172A">
          {isLoss ? "" : "+"}{((returned - invested) / Math.max(invested, 1) * 100).toFixed(1)}%
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#94A3B8">ROI</text>
      </svg>
      <div style={{ display: "flex", gap: 14, fontSize: 11 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "#2563EB" }} />
          <span style={{ color: "#64748B" }}>Invested</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: isLoss ? "#EF4444" : "#10B981" }} />
          <span style={{ color: "#64748B" }}>{isLoss ? "Loss" : "Gain"}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Improved Gauge ───────────────────────────────────────────────────────────
function Gauge({ roi }) {
  // Semicircle: needle pivots at bottom-centre, sweeps from left (-180°) to right (0°)
  // ROI range: -100% (far left) to +300% (far right)
  const MIN_ROI = -100, MAX_ROI = 300;
  const W = 180, H = 106, cx = 90, cy = 92, R = 68;
  const toRad = d => d * Math.PI / 180;

  // Map ROI value → angle in degrees (-180 to 0)
  const roiToDeg = v => {
    const clamped = Math.min(Math.max(v, MIN_ROI), MAX_ROI);
    return -180 + ((clamped - MIN_ROI) / (MAX_ROI - MIN_ROI)) * 180;
  };

  // Point on the arc circle at given degree
  const pt = deg => ({
    x: cx + R * Math.cos(toRad(deg)),
    y: cy + R * Math.sin(toRad(deg)),
  });

  // SVG arc path between two angles
  const arc = (d1, d2) => {
    if (Math.abs(d2 - d1) < 0.5) return "";
    const p1 = pt(d1), p2 = pt(d2);
    const large = (d2 - d1) > 180 ? 1 : 0;
    return `M${p1.x.toFixed(2)},${p1.y.toFixed(2)} A${R},${R} 0 ${large},1 ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  };

  const zeroDeg = roiToDeg(0);       // angle where ROI = 0
  const needleDeg = roiToDeg(roi);   // current needle angle

  // Needle tip and base
  const tip = { x: cx + (R - 6) * Math.cos(toRad(needleDeg)), y: cy + (R - 6) * Math.sin(toRad(needleDeg)) };
  const base = { x: cx + 10 * Math.cos(toRad(needleDeg + 180)), y: cy + 10 * Math.sin(toRad(needleDeg + 180)) };

  // Zero tick
  const zInner = { x: cx + (R - 9) * Math.cos(toRad(zeroDeg)), y: cy + (R - 9) * Math.sin(toRad(zeroDeg)) };
  const zOuter = { x: cx + (R + 9) * Math.cos(toRad(zeroDeg)), y: cy + (R + 9) * Math.sin(toRad(zeroDeg)) };
  const zLabel = { x: cx + (R + 18) * Math.cos(toRad(zeroDeg)), y: cy + (R + 18) * Math.sin(toRad(zeroDeg)) };

  const color = roi < 0 ? "#EF4444" : roi <= 15 ? "#10B981" : roi <= 50 ? "#F59E0B" : roi <= 200 ? "#F97316" : "#EF4444";

  // Active arc: from zero toward needle
  const activeArc = roi >= 0
    ? arc(zeroDeg, Math.min(needleDeg, -0.1))
    : arc(needleDeg, zeroDeg);

  // Corner label positions
  const lossLabel = pt(-175);
  const strongLabel = pt(-5);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible">
        {/* Background track */}
        <path d={arc(-180, 0)} fill="none" stroke="#E2E8F0" strokeWidth="11" strokeLinecap="round" />
        {/* Loss zone */}
        <path d={arc(-180, zeroDeg)} fill="none" stroke="#FECACA" strokeWidth="11" />
        {/* Gain zone */}
        <path d={arc(zeroDeg, 0)} fill="none" stroke="#BBF7D0" strokeWidth="11" />
        {/* Active highlight */}
        {activeArc && <path d={activeArc} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" />}
        {/* Zero tick */}
        <line x1={zInner.x} y1={zInner.y} x2={zOuter.x} y2={zOuter.y} stroke="#94A3B8" strokeWidth="1.5" />
        <text x={zLabel.x} y={zLabel.y + 3} textAnchor="middle" fontSize="8" fill="#94A3B8">0%</text>
        {/* Needle shadow */}
        <line x1={base.x + 1} y1={base.y + 1} x2={tip.x + 1} y2={tip.y + 1} stroke="rgba(0,0,0,0.1)" strokeWidth="3.5" strokeLinecap="round" />
        {/* Needle */}
        <line x1={base.x} y1={base.y} x2={tip.x} y2={tip.y} stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Hub */}
        <circle cx={cx} cy={cy} r={6} fill="#1E293B" />
        <circle cx={cx} cy={cy} r={3.5} fill="white" />
        {/* Value display */}
        <text x={cx} y={cy - 26} textAnchor="middle" fontSize="15" fontWeight="800" fill={color}>
          {roi > 0 ? "+" : ""}{roi.toFixed(1)}%
        </text>
        {/* Corner labels */}
        <text x={lossLabel.x + 8} y={lossLabel.y + 14} textAnchor="middle" fontSize="8.5" fill="#EF4444">Loss</text>
        <text x={strongLabel.x - 8} y={strongLabel.y + 14} textAnchor="middle" fontSize="8.5" fill="#059669">Strong</text>
      </svg>
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ invested, returned, symbol }) {
  const max = Math.max(invested, returned, 1);
  const bars = [
    { label: "Invested", value: invested, color: "#2563EB" },
    { label: "Returned", value: returned, color: returned >= invested ? "#10B981" : "#EF4444" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      {bars.map(bar => (
        <div key={bar.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: "#64748B" }}>{bar.label}</span>
            <span style={{ fontWeight: 600, color: "#0F172A", fontSize: 12 }}>{fmt(bar.value, symbol)}</span>
          </div>
          <div style={{ background: "#F1F5F9", borderRadius: 4, height: 10, overflow: "hidden" }}>
            <div style={{ width: `${(bar.value / max) * 100}%`, height: "100%", background: bar.color, borderRadius: 4, transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Benchmark Bar ────────────────────────────────────────────────────────────
function BenchmarkBar({ annualized }) {
  const max = Math.max(...BENCHMARKS.map(b => b.roi), annualized, 5);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>vs Market Benchmarks</div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
          <span style={{ color: "#2563EB", fontWeight: 700 }}>Your Investment</span>
          <span style={{ fontWeight: 700, color: "#2563EB" }}>{annualized.toFixed(1)}% p.a.</span>
        </div>
        <div style={{ background: "#F1F5F9", borderRadius: 4, height: 8 }}>
          <div style={{ width: `${Math.min((annualized / max) * 100, 100)}%`, height: "100%", background: "linear-gradient(90deg,#2563EB,#4F46E5)", borderRadius: 4, transition: "width 0.5s ease" }} />
        </div>
      </div>
      {BENCHMARKS.map(b => (
        <div key={b.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
            <span style={{ color: "#64748B" }}>{b.label}</span>
            <span style={{ color: "#64748B" }}>{b.roi}% p.a.</span>
          </div>
          <div style={{ background: "#F1F5F9", borderRadius: 4, height: 6 }}>
            <div style={{ width: `${(b.roi / max) * 100}%`, height: "100%", background: b.color, borderRadius: 4, opacity: 0.45 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Slider + Input ───────────────────────────────────────────────────────────
function SliderInput({ label, value, min, max, step, onChange, symbol, suffix, presets }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {symbol && <span style={{ fontSize: 13, color: "#94A3B8" }}>{symbol}</span>}
          <input type="number" value={value} min={min} max={max} step={step}
            onChange={e => onChange(Number(e.target.value))}
            style={{ width: 110, height: 36, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 14, fontWeight: 600, color: "#0F172A", outline: "none", textAlign: "right" }} />
          {suffix && <span style={{ fontSize: 13, color: "#94A3B8" }}>{suffix}</span>}
        </div>
      </div>
      <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 4, background: "#E2E8F0", borderRadius: 2 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#2563EB,#4F46E5)", borderRadius: 2 }} />
        </div>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", width: "100%", opacity: 0, cursor: "pointer", height: 20 }} />
      </div>
      {presets && (
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {presets.map(p => (
            <button key={p.label} onClick={() => onChange(p.value)} style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 999,
              border: value === p.value ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0",
              background: value === p.value ? "#EFF6FF" : "#fff",
              color: value === p.value ? "#2563EB" : "#64748B",
              cursor: "pointer", fontWeight: 600,
            }}>{p.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "14px 16px", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent || "#0F172A", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── SEO Section ─────────────────────────────────────────────────────────────
function SEOSection() {
  const faqs = [
    { q: "What is ROI?", a: "ROI (Return on Investment) measures the gain or loss from an investment relative to its cost. Formula: ROI% = ((Amount Returned − Amount Invested) ÷ Amount Invested) × 100." },
    { q: "What is a good ROI in India?", a: "A good ROI depends on the investment type. Bank FDs offer ~7% p.a., gold averages ~12% over 10 years, and Nifty 50 has historically returned ~14% p.a. Any annualized return above 15% is considered strong." },
    { q: "What is annualized ROI?", a: "Annualized ROI (also called CAGR) normalizes the return over a multi-year period to show the equivalent annual rate. It accounts for compounding frequency — monthly, quarterly, or annually." },
    { q: "How is break-even calculated?", a: "Break-even point is the number of years it takes to recover your investment at the current annual gain rate. Break-even = Amount Invested ÷ Annual Gain." },
    { q: "What does inflation-adjusted ROI mean?", a: "Real ROI subtracts the inflation rate from your nominal ROI. If your investment returns 12% but inflation is 6%, your real purchasing power only grew by ~6%." },
    { q: "Is this ROI calculator free?", a: "Yes — completely free, no login required, and your data never leaves your device." },
  ];

  return (
    <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px" }}>

        {/* What is ROI */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", margin: "0 0 16px", letterSpacing: "-0.01em" }}>What is ROI?</h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, margin: "0 0 16px" }}>
            Return on Investment (ROI) is a performance metric used to evaluate the efficiency of an investment. It tells you how much profit or loss you made relative to the amount you originally invested — expressed as a percentage.
          </p>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, margin: "0 0 20px" }}>
            The basic ROI formula is: <strong style={{ color: "#0F172A" }}>ROI% = ((Amount Returned − Amount Invested) ÷ Amount Invested) × 100</strong>. For example, if you invested ₹1,00,000 and got back ₹1,50,000, your ROI is 50%.
          </p>
          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "20px 24px", border: "1px solid #E2E8F0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
              {[
                { label: "Basic ROI", formula: "(Return − Cost) ÷ Cost × 100", color: "#2563EB" },
                { label: "Annualized ROI", formula: "(Return ÷ Cost)^(1÷Years) − 1", color: "#7C3AED" },
                { label: "Real ROI", formula: "Nominal ROI − Inflation Rate × Years", color: "#059669" },
              ].map(f => (
                <div key={f.label} style={{ padding: "14px 16px", background: "#fff", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: f.color, marginBottom: 6 }}>{f.label}</div>
                  <code style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{f.formula}</code>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why use */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 20px", letterSpacing: "-0.01em" }}>Why use an ROI Calculator?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { icon: "📊", title: "Compare investments", body: "Objectively compare FDs, stocks, real estate, or business ventures on the same scale." },
              { icon: "🎯", title: "Set return targets", body: "Work backwards from a goal — know exactly what return rate you need to reach your target." },
              { icon: "📈", title: "Track performance", body: "Measure how an existing investment is performing against benchmarks like Nifty 50 or gold." },
              { icon: "💡", title: "Justify business spend", body: "Evaluate whether a marketing campaign, equipment purchase, or expansion is worth the cost." },
            ].map(f => (
              <div key={f.title} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 16px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Benchmarks table */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 16px", letterSpacing: "-0.01em" }}>ROI Benchmarks in India (2024–25)</h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 20px", lineHeight: 1.7 }}>
            Use these benchmarks to contextualise your investment returns. Historical averages are approximate and vary with market conditions.
          </p>
          <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Investment Type", "Typical Annual Return", "Risk Level", "Liquidity"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Savings Account", ret: "3–4%", risk: "Very Low", liq: "Instant" },
                  { type: "Fixed Deposit (1yr)", ret: "6.5–7.5%", risk: "Very Low", liq: "On maturity" },
                  { type: "Gold", ret: "10–14%", risk: "Low–Medium", liq: "High" },
                  { type: "Real Estate", ret: "8–12%", risk: "Medium", liq: "Low" },
                  { type: "Nifty 50 Index", ret: "12–16%", risk: "Medium–High", liq: "High" },
                  { type: "Direct Equity", ret: "Varies", risk: "High", liq: "High" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0F172A" }}>{row.type}</td>
                    <td style={{ padding: "12px 16px", color: "#059669", fontWeight: 600 }}>{row.ret}</td>
                    <td style={{ padding: "12px 16px", color: "#64748B" }}>{row.risk}</td>
                    <td style={{ padding: "12px 16px", color: "#64748B" }}>{row.liq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Print-only output ────────────────────────────────────────────────────────
function PrintOutput({ invested, returned, years, roi, annualized, gain, breakEven, currency, compoundFreq, inflationOn, inflationRate, realROI }) {
  const s = currency.symbol;
  const risk = getRiskLevel(roi);
  return (
    <div className="print-only" style={{ display: "none", padding: "32px" }}>
      <div style={{ borderBottom: "2px solid #0F172A", paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>ROI Calculator Report</h1>
        <p style={{ fontSize: 12, color: "#64748B", margin: "4px 0 0" }}>Generated by OpsTools · opstools.ai · {new Date().toLocaleDateString("en-IN")}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {[
          { label: "Amount Invested", value: `${s}${invested.toLocaleString("en-IN")}` },
          { label: "Amount Returned", value: `${s}${returned.toLocaleString("en-IN")}` },
          { label: "Time Period", value: `${years} years` },
          { label: "Compounding", value: compoundFreq.label },
          { label: "ROI", value: `${roi.toFixed(2)}%` },
          { label: "Annualized ROI", value: `${annualized.toFixed(2)}% p.a.` },
          { label: "Total Gain/Loss", value: `${gain >= 0 ? "+" : ""}${s}${Math.abs(gain).toLocaleString("en-IN")}` },
          { label: "Break-even", value: breakEven ? `${breakEven} years` : "N/A" },
        ].map(item => (
          <div key={item.label} style={{ padding: "12px 16px", border: "1px solid #E2E8F0", borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{item.value}</div>
          </div>
        ))}
      </div>
      {inflationOn && realROI !== null && (
        <div style={{ padding: "12px 16px", border: "1px solid #FDE68A", background: "#FFFBEB", borderRadius: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Real ROI (after {inflationRate}% inflation)</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: realROI >= 0 ? "#059669" : "#DC2626" }}>{realROI.toFixed(2)}%</div>
        </div>
      )}
      <div style={{ padding: "14px 16px", background: risk.bg, border: `1px solid ${risk.color}30`, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: risk.color, marginBottom: 6 }}>{risk.icon} {risk.label}</div>
        <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{getInterpretation(roi, annualized, years, s, gain)}</p>
      </div>
    </div>
  );
}

// ─── FD Calculator ────────────────────────────────────────────────────────────
function FDCalculator({ s, amountPresets, onResult }) {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(3);
  const [freq, setFreq] = useState(COMPOUND_FREQ[1]);

  const maturity = principal * Math.pow(1 + (rate / 100) / freq.n, freq.n * years);
  const interest = maturity - principal;
  const roi = (interest / principal) * 100;
  const risk = getRiskLevel(roi);

  useEffect(() => {
    if (!onResult) return;
    onResult({
      cards: [
        { label: "Maturity Amount", value: fmt(maturity, s), accent: "#10B981" },
        { label: "Interest Earned", value: fmt(interest, s), accent: "#2563EB" },
        { label: "Total ROI", value: `${roi.toFixed(2)}%`, accent: "#7C3AED" },
      ],
      risk,
      interpretation: `At ${rate}% p.a. compounded ${freq.label.toLowerCase()}, ${s}${principal.toLocaleString("en-IN")} grows to ${fmt(maturity, s)} in ${years} year${years !== 1 ? "s" : ""}. That's ${s}${Math.round(interest / (years * 12)).toLocaleString("en-IN")}/month in interest on average.`,
    });
  }, [principal, rate, years, freq, s]);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏦</div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Fixed Deposit Calculator</h2>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Compound interest on lump sum deposit</p>
        </div>
      </div>
      <SliderInput label="Principal Amount" value={principal} min={1000} max={10000000} step={1000} onChange={setPrincipal} symbol={s} presets={amountPresets} />
      <SliderInput label="Interest Rate (p.a.)" value={rate} min={1} max={20} step={0.25} onChange={setRate} suffix="%" />
      <SliderInput label="Tenure" value={years} min={0.5} max={10} step={0.5} onChange={setYears} suffix="yrs" />
      <div style={{ marginBottom: 4 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>Compounding Frequency</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COMPOUND_FREQ.map(f => (
            <button key={f.label} onClick={() => setFreq(f)} style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: freq.n === f.n ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0",
              background: freq.n === f.n ? "#EFF6FF" : "#fff",
              color: freq.n === f.n ? "#2563EB" : "#64748B",
            }}>{f.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RD Calculator ────────────────────────────────────────────────────────────
function RDCalculator({ s, onResult }) {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [months, setMonths] = useState(24);

  const n = months;
  const totalInvested = monthly * n;
  const interest = monthly * n * (n + 1) * rate / (2 * 12 * 100);
  const maturity = totalInvested + interest;
  const roi = (interest / totalInvested) * 100;
  const annRate = (roi / (months / 12));
  const risk = getRiskLevel(roi);

  const result = {
    cards: [
      { label: "Total Invested", value: fmt(totalInvested, s), accent: "#2563EB" },
      { label: "Interest Earned", value: fmt(interest, s), accent: "#10B981" },
      { label: "Maturity Amount", value: fmt(maturity, s), accent: "#7C3AED" },
    ],
    risk,
    interpretation: `Depositing ${s}${monthly.toLocaleString("en-IN")}/month for ${months} months at ${rate}% p.a. gives you ${fmt(maturity, s)}. Effective annualized return: ${annRate.toFixed(2)}% p.a.`,
    extra: { totalInvested, maturity },
  };
  useEffect(() => { if (onResult) onResult(result); }, [monthly, rate, months, s]);

  const monthPresets = [
    { label: "6M", value: 6 }, { label: "1Yr", value: 12 },
    { label: "2Yr", value: 24 }, { label: "3Yr", value: 36 },
    { label: "5Yr", value: 60 },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📅</div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Recurring Deposit Calculator</h2>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Monthly savings with fixed interest (Indian SI method)</p>
        </div>
      </div>
      <SliderInput label="Monthly Deposit" value={monthly} min={100} max={100000} step={100} onChange={setMonthly} symbol={s}
        presets={[{ label: "1K", value: 1000 }, { label: "5K", value: 5000 }, { label: "10K", value: 10000 }, { label: "25K", value: 25000 }]} />
      <SliderInput label="Interest Rate (p.a.)" value={rate} min={1} max={12} step={0.25} onChange={setRate} suffix="%" />
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Tenure</label>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="number" value={months} min={1} max={120} onChange={e => setMonths(Number(e.target.value))}
              style={{ width: 70, height: 36, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 14, fontWeight: 600, color: "#0F172A", outline: "none", textAlign: "right" }} />
            <span style={{ fontSize: 13, color: "#94A3B8" }}>months</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {monthPresets.map(p => (
            <button key={p.label} onClick={() => setMonths(p.value)} style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 999, cursor: "pointer", fontWeight: 600,
              border: months === p.value ? "1.5px solid #10B981" : "1.5px solid #E2E8F0",
              background: months === p.value ? "#ECFDF5" : "#fff",
              color: months === p.value ? "#059669" : "#64748B",
            }}>{p.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Savings Account Calculator ───────────────────────────────────────────────
function SavingsCalculator({ s, onResult }) {
  const [balance, setBalance] = useState(50000);
  const [rate, setRate] = useState(3.5);
  const [months, setMonths] = useState(12);
  const [monthlyAdd, setMonthlyAdd] = useState(0);

  const r = rate / 100 / 12;
  let total = balance;
  for (let i = 0; i < months; i++) total = total * (1 + r) + monthlyAdd;
  const totalDeposited = balance + monthlyAdd * months;
  const interest = total - totalDeposited;
  const roi = (interest / totalDeposited) * 100;
  const risk = getRiskLevel(roi);

  const BANK_RATES = [
    { name: "SBI", rate: 2.7 }, { name: "HDFC", rate: 3.0 },
    { name: "Kotak 811", rate: 3.5 }, { name: "IDFC FIRST", rate: 6.0 },
    { name: "AU Small Finance", rate: 7.0 },
  ];

  const result = {
    cards: [
      { label: "Final Balance", value: fmt(total, s), accent: "#7C3AED" },
      { label: "Interest Earned", value: fmt(interest, s), accent: "#10B981" },
      { label: "Monthly Interest", value: fmt(interest / months, s), accent: "#F97316" },
    ],
    risk,
    interpretation: `At ${rate}% p.a. on ${s}${balance.toLocaleString("en-IN")} balance${monthlyAdd > 0 ? ` + ${s}${monthlyAdd.toLocaleString("en-IN")}/month` : ""} for ${months} months, you earn ${fmt(interest, s)} in interest. Final balance: ${fmt(total, s)}.`,
  };
  useEffect(() => { if (onResult) onResult(result); }, [balance, rate, months, monthlyAdd, s]);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💰</div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Savings Account Calculator</h2>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Monthly compounding on your savings balance</p>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>Quick pick — Indian bank rates</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {BANK_RATES.map(b => (
            <button key={b.name} onClick={() => setRate(b.rate)} style={{
              fontSize: 11, padding: "4px 10px", borderRadius: 999, cursor: "pointer", fontWeight: 600,
              border: rate === b.rate ? "1.5px solid #F97316" : "1.5px solid #E2E8F0",
              background: rate === b.rate ? "#FFF7ED" : "#fff",
              color: rate === b.rate ? "#EA580C" : "#64748B",
            }}>{b.name} {b.rate}%</button>
          ))}
        </div>
      </div>
      <SliderInput label="Current Balance" value={balance} min={0} max={5000000} step={1000} onChange={setBalance} symbol={s}
        presets={[{ label: "10K", value: 10000 }, { label: "50K", value: 50000 }, { label: "1L", value: 100000 }, { label: "5L", value: 500000 }]} />
      <SliderInput label="Interest Rate (p.a.)" value={rate} min={1} max={10} step={0.1} onChange={setRate} suffix="%" />
      <SliderInput label="Monthly Addition" value={monthlyAdd} min={0} max={100000} step={500} onChange={setMonthlyAdd} symbol={s} />
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Period</label>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="number" value={months} min={1} max={120} onChange={e => setMonths(Number(e.target.value))}
              style={{ width: 70, height: 36, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 14, fontWeight: 600, color: "#0F172A", outline: "none", textAlign: "right" }} />
            <span style={{ fontSize: 13, color: "#94A3B8" }}>months</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Others Result Panel ──────────────────────────────────────────────────────
function OthersResultPanel({ result, onPrint }) {
  if (!result) return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "32px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>👆</div>
      <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>Select an account type and fill in the details to see results here</p>
    </div>
  );

  const { cards, risk, interpretation } = result;
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px" }}>
      {/* Header with Save PDF */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Results</h2>
        <button onClick={onPrint} style={{
          display: "flex", alignItems: "center", gap: 7, height: 36, padding: "0 16px",
          borderRadius: 8, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg,#2563EB,#4F46E5)",
          color: "#fff", fontSize: 13, fontWeight: 600,
          boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
          </svg>
          Save PDF
        </button>
      </div>

      {/* Result cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 16 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 18px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>{c.label}</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: c.accent }}>{c.value}</span>
          </div>
        ))}
      </div>

      {/* Interpretation */}
      <div style={{ background: risk.bg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${risk.color}25` }}>
        <p style={{ fontSize: 12, color: risk.color, fontWeight: 700, margin: "0 0 5px" }}>{risk.icon} {risk.label}</p>
        <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.65 }}>{interpretation}</p>
      </div>
    </div>
  );
}

// ─── Others Calculator (FD / RD / Savings with selector) ─────────────────────
function OthersCalculator({ s, amountPresets, onResult }) {
  const [type, setType] = useState("fd");

  const TYPES = [
    { key: "fd", icon: "🏦", label: "Fixed Deposit" },
    { key: "rd", icon: "📅", label: "Recurring Deposit" },
    { key: "savings", icon: "💰", label: "Savings Account" },
  ];

  return (
    <div>
      {/* Compact inline tab switcher */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: "6px", marginBottom: 16, display: "flex", gap: 4 }}>
        {TYPES.map(t => (
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ROICalculatorPage() {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [invested, setInvested] = useState(100000);
  const [returned, setReturned] = useState(150000);
  const [years, setYears] = useState(3);
  const [compoundFreq, setCompoundFreq] = useState(COMPOUND_FREQ[3]);
  const [inflationOn, setInflationOn] = useState(false);
  const [othersResult, setOthersResult] = useState(null);
  const [inflationRate, setInflationRate] = useState(6);
  const [whatIfBoost, setWhatIfBoost] = useState(0);
  const [activeTab, setActiveTab] = useState("basic");
  const [inv2, setInv2] = useState(200000);
  const [ret2, setRet2] = useState(260000);
  const [years2, setYears2] = useState(3);

  const s = currency.symbol;
  const boostedReturned = returned * (1 + whatIfBoost / 100);
  const roi = calcROI(invested, boostedReturned);
  const annualized = calcAnnualized(invested, boostedReturned, years, compoundFreq.n);
  const gain = boostedReturned - invested;
  const realROI = inflationOn ? roi - inflationRate * years : null;
  const risk = getRiskLevel(roi);
  const interpretation = getInterpretation(roi, annualized, years, s, gain);
  const breakEven = gain > 0 ? (invested / (gain / years)).toFixed(1) : null;
  const roi2 = calcROI(inv2, ret2);
  const annualized2 = calcAnnualized(inv2, ret2, years2, compoundFreq.n);

  const amountPresets = [
    { label: "10K", value: 10000 }, { label: "50K", value: 50000 },
    { label: "1L", value: 100000 }, { label: "5L", value: 500000 },
    { label: "10L", value: 1000000 }, { label: "1Cr", value: 10000000 },
  ];

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style>{`
        .roi-tab { cursor:pointer; padding:8px 18px; border-radius:8px; font-size:13px; font-weight:600; border:none; transition:all 0.15s; background:transparent; }
        .roi-tab.active { background:linear-gradient(135deg,#2563EB,#4F46E5); color:#fff; }
        .roi-tab:not(.active) { color:#64748B; }
        .roi-tab:not(.active):hover { background:#F1F5F9; color:#0F172A; }
        @media(max-width:768px) {
          .roi-grid { grid-template-columns:1fr !important; }
          .roi-stats { flex-wrap:wrap !important; }
          .roi-stats > div { min-width:calc(50% - 6px) !important; }
          .roi-tabs { overflow-x:auto; }
        }
        @media print {
          .no-print { display:none !important; }
          .print-only { display:none !important; }
          body { background:#fff !important; }
          .roi-results {
            position: static !important;
            display: block !important;
          }
          .roi-results-print-header {
            display: flex !important;
          }
        }
      `}</style>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 55%,#1e1b4b 100%)", padding: "40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#475569" }}>
            <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#94A3B8" }}>ROI Calculator</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                ROI Calculator
              </h1>
              <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>
                Calculate returns · Compare investments · Benchmark vs FD, Gold, Nifty50
              </p>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CURRENCIES.map(c => (
                <button key={c.code} onClick={() => setCurrency(c)} style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: currency.code === c.code ? "1.5px solid #2563EB" : "1.5px solid rgba(255,255,255,0.15)",
                  background: currency.code === c.code ? "#2563EB" : "rgba(255,255,255,0.06)",
                  color: currency.code === c.code ? "#fff" : "rgba(255,255,255,0.65)",
                }}>{c.symbol} {c.code}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 24px" }} className="no-print">
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4, padding: "8px 0", overflowX: "auto" }} className="roi-tabs">
          {[
            { key: "basic", label: "Basic ROI" },
            { key: "advanced", label: "Advanced" },
            { key: "compare", label: "Compare" },
            { key: "whatif", label: "What-if" },
            { key: "others", label: "Others" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`roi-tab ${activeTab === tab.key ? "active" : ""}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tool */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div className="roi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 28, alignItems: "start" }}>

          {/* LEFT — inputs, hidden on print */}
          <div className="no-print">
            {/* Basic inputs — only shown on basic/advanced/compare/whatif tabs */}
            {activeTab !== "others" && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 20px" }}>Investment Details</h2>
              <SliderInput label="Amount Invested" value={invested} min={1000} max={10000000} step={1000}
                onChange={setInvested} symbol={s} presets={amountPresets} />
              <SliderInput label="Amount Returned" value={returned} min={0} max={20000000} step={1000}
                onChange={setReturned} symbol={s} presets={amountPresets} />
              <SliderInput label="Time Period" value={years} min={0.5} max={30} step={0.5}
                onChange={setYears} suffix="yrs" />
              {/* Inflation toggle */}
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
                      onChange={e => setInflationRate(Number(e.target.value))}
                      style={{ width: 60, height: 32, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 8px", fontSize: 13, fontWeight: 600, textAlign: "center" }} />
                    <span style={{ fontSize: 13, color: "#94A3B8" }}>% / yr</span>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Others tab — FD / RD / Savings with internal selector */}
            {activeTab === "others" && (
              <OthersCalculator s={s} amountPresets={amountPresets} onResult={setOthersResult} />
            )}

            {/* Advanced tab */}
            {activeTab === "advanced" && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 16px" }}>Compounding Frequency</h2>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {COMPOUND_FREQ.map(f => (
                    <button key={f.label} onClick={() => setCompoundFreq(f)} style={{
                      padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      border: compoundFreq.n === f.n ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0",
                      background: compoundFreq.n === f.n ? "#EFF6FF" : "#fff",
                      color: compoundFreq.n === f.n ? "#2563EB" : "#64748B",
                    }}>{f.label}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Compare tab */}
            {activeTab === "compare" && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 4px" }}>Investment B</h2>
                <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 20px" }}>Compare against an FD or alternative investment</p>
                <SliderInput label="Amount Invested (B)" value={inv2} min={1000} max={10000000} step={1000} onChange={setInv2} symbol={s} presets={amountPresets} />
                <SliderInput label="Amount Returned (B)" value={ret2} min={0} max={20000000} step={1000} onChange={setRet2} symbol={s} presets={amountPresets} />
                <SliderInput label="Time Period (B)" value={years2} min={0.5} max={30} step={0.5} onChange={setYears2} suffix="yrs" />
                <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px", marginTop: 8 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { label: "Investment A", roi: roi, ann: annualized, gain: gain },
                      { label: "Investment B (FD)", roi: roi2, ann: annualized2, gain: ret2 - inv2 },
                    ].map((item, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "12px 14px", border: `1.5px solid ${item.roi > (i === 0 ? roi2 : roi) ? "#10B981" : "#E2E8F0"}` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 8 }}>{item.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: item.roi >= 0 ? "#10B981" : "#EF4444" }}>{item.roi.toFixed(1)}%</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>ROI</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginTop: 8 }}>{item.ann.toFixed(2)}% p.a.</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>Annualized</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: item.gain >= 0 ? "#10B981" : "#EF4444", marginTop: 8 }}>
                          {item.gain >= 0 ? "+" : ""}{fmt(item.gain, s)}
                        </div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>Gain/Loss</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, padding: "10px 14px", background: roi > roi2 ? "#ECFDF5" : roi < roi2 ? "#FEF2F2" : "#F8FAFC", borderRadius: 8 }}>
                    <p style={{ fontSize: 12, color: roi > roi2 ? "#059669" : roi < roi2 ? "#DC2626" : "#64748B", margin: 0, fontWeight: 600 }}>
                      {roi > roi2 ? `✓ Investment A outperforms B by ${(roi - roi2).toFixed(1)}pp` :
                       roi < roi2 ? `Investment B outperforms A by ${(roi2 - roi).toFixed(1)}pp` :
                       "Both investments have equal ROI"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* What-if tab */}
            {activeTab === "whatif" && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 4px" }}>What-if Scenario</h2>
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
            )}

            {/* Interpretation — only for basic ROI tabs */}
            {activeTab !== "others" && (
            <div style={{ background: risk.bg, borderRadius: 12, padding: "16px 18px", border: `1px solid ${risk.color}30` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>{risk.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: risk.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>{risk.label}</span>
              </div>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>{interpretation}</p>
            </div>
            )}
          </div>

          {/* RIGHT — Results panel */}
          {activeTab !== "others" && (
          <div className="roi-results" style={{ position: "sticky", top: 88 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 16 }}>
              {/* Print header — only visible when printing */}
              <div className="roi-results-print-header" style={{ display: "none", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #0F172A" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>ROI Calculator Report</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>opstools.ai · {new Date().toLocaleDateString("en-IN")}</div>
                </div>
              </div>
              {/* Results header with Save PDF button */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Results</h2>
                <button onClick={() => window.print()} style={{
                  display: "flex", alignItems: "center", gap: 7, height: 36, padding: "0 16px",
                  borderRadius: 8, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg,#2563EB,#4F46E5)",
                  color: "#fff", fontSize: 13, fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  Save PDF
                </button>
              </div>
              <div className="roi-stats" style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <StatCard label="ROI" value={`${roi.toFixed(2)}%`} sub={`Gain: ${fmt(Math.abs(gain), s)}`} accent={roi >= 0 ? "#10B981" : "#EF4444"} />
                <StatCard label="Annualized" value={`${annualized.toFixed(2)}%`} sub={`${compoundFreq.label}`} accent="#2563EB" />
              </div>
              <div className="roi-stats" style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                <StatCard label="Total Gain" value={`${gain >= 0 ? "+" : ""}${fmt(gain, s)}`} sub={`${years}yr period`} accent={gain >= 0 ? "#10B981" : "#EF4444"} />
                <StatCard label="Break-even" value={breakEven ? `${breakEven} yrs` : "N/A"} sub="At current rate" />
              </div>
              {inflationOn && realROI !== null && (
                <div style={{ background: "#FFF7ED", borderRadius: 10, padding: "12px 14px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#92400E", fontWeight: 600 }}>Real ROI (inflation-adjusted)</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: realROI >= 0 ? "#059669" : "#DC2626" }}>{realROI.toFixed(2)}%</span>
                </div>
              )}
              {/* Charts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, textAlign: "center", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Composition</p>
                  <DonutChart invested={invested} returned={boostedReturned} symbol={s} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, textAlign: "center", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Performance</p>
                  <Gauge roi={roi} />
                </div>
              </div>
              <BarChart invested={invested} returned={boostedReturned} symbol={s} />
            </div>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px" }}>
              <BenchmarkBar annualized={annualized} />
            </div>
          </div>
          )} {/* end activeTab !== "others" */}

          {/* RIGHT — Others result panel */}
          {activeTab === "others" && (
            <div style={{ position: "sticky", top: 88 }}>
              <OthersResultPanel result={othersResult} onPrint={() => window.print()} />
            </div>
          )}
        </div>
      </div>

      {/* SEO Section */}
      <SEOSection />
    </div>
  );
}
