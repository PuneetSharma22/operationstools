import PropTypes from "prop-types";
import { fmt } from "./roiMath";
import { BENCHMARKS } from "./constants";

// Hand-rolled SVG/CSS charts for the ROI results panel. They are deliberately
// dependency-free: each is a few dozen lines, prints cleanly, and needs no
// charting library in the bundle.

/** Invested vs gain, as a two-segment ring with the ROI in the middle. */
export function DonutChart({ invested, returned }) {
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
DonutChart.propTypes = {
  invested: PropTypes.number.isRequired,
  returned: PropTypes.number.isRequired,
};

/**
 * Semicircular gauge. The needle pivots at bottom-centre and sweeps from left
 * (-180°, ROI = -100%) to right (0°, ROI = +300%); anything outside that
 * range is clamped to the end stops.
 */
export function Gauge({ roi }) {
  const MIN_ROI = -100, MAX_ROI = 300;
  const W = 180, H = 106, cx = 90, cy = 92, R = 68;
  const toRad = (d) => d * Math.PI / 180;

  // Map ROI value → angle in degrees (-180 to 0)
  const roiToDeg = (v) => {
    const clamped = Math.min(Math.max(v, MIN_ROI), MAX_ROI);
    return -180 + ((clamped - MIN_ROI) / (MAX_ROI - MIN_ROI)) * 180;
  };

  // Point on the arc circle at a given degree
  const pt = (deg) => ({ x: cx + R * Math.cos(toRad(deg)), y: cy + R * Math.sin(toRad(deg)) });

  // SVG arc path between two angles
  const arc = (d1, d2) => {
    if (Math.abs(d2 - d1) < 0.5) return "";
    const p1 = pt(d1), p2 = pt(d2);
    const large = (d2 - d1) > 180 ? 1 : 0;
    return `M${p1.x.toFixed(2)},${p1.y.toFixed(2)} A${R},${R} 0 ${large},1 ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  };

  const zeroDeg = roiToDeg(0);
  const needleDeg = roiToDeg(roi);

  const tip = { x: cx + (R - 6) * Math.cos(toRad(needleDeg)), y: cy + (R - 6) * Math.sin(toRad(needleDeg)) };
  const base = { x: cx + 10 * Math.cos(toRad(needleDeg + 180)), y: cy + 10 * Math.sin(toRad(needleDeg + 180)) };

  const zInner = { x: cx + (R - 9) * Math.cos(toRad(zeroDeg)), y: cy + (R - 9) * Math.sin(toRad(zeroDeg)) };
  const zOuter = { x: cx + (R + 9) * Math.cos(toRad(zeroDeg)), y: cy + (R + 9) * Math.sin(toRad(zeroDeg)) };
  const zLabel = { x: cx + (R + 18) * Math.cos(toRad(zeroDeg)), y: cy + (R + 18) * Math.sin(toRad(zeroDeg)) };

  const color = roi < 0 ? "#EF4444" : roi <= 15 ? "#10B981" : roi <= 50 ? "#F59E0B" : roi <= 200 ? "#F97316" : "#EF4444";

  // Active arc: from zero toward the needle, in whichever direction
  const activeArc = roi >= 0 ? arc(zeroDeg, Math.min(needleDeg, -0.1)) : arc(needleDeg, zeroDeg);

  const lossLabel = pt(-175);
  const strongLabel = pt(-5);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible">
        <path d={arc(-180, 0)} fill="none" stroke="#E2E8F0" strokeWidth="11" strokeLinecap="round" />
        <path d={arc(-180, zeroDeg)} fill="none" stroke="#FECACA" strokeWidth="11" />
        <path d={arc(zeroDeg, 0)} fill="none" stroke="#BBF7D0" strokeWidth="11" />
        {activeArc && <path d={activeArc} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" />}
        <line x1={zInner.x} y1={zInner.y} x2={zOuter.x} y2={zOuter.y} stroke="#94A3B8" strokeWidth="1.5" />
        <text x={zLabel.x} y={zLabel.y + 3} textAnchor="middle" fontSize="8" fill="#94A3B8">0%</text>
        {/* Needle shadow, then needle, then hub */}
        <line x1={base.x + 1} y1={base.y + 1} x2={tip.x + 1} y2={tip.y + 1} stroke="rgba(0,0,0,0.1)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1={base.x} y1={base.y} x2={tip.x} y2={tip.y} stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={6} fill="#1E293B" />
        <circle cx={cx} cy={cy} r={3.5} fill="white" />
        <text x={cx} y={cy - 26} textAnchor="middle" fontSize="15" fontWeight="800" fill={color}>
          {roi > 0 ? "+" : ""}{roi.toFixed(1)}%
        </text>
        <text x={lossLabel.x + 8} y={lossLabel.y + 14} textAnchor="middle" fontSize="8.5" fill="#EF4444">Loss</text>
        <text x={strongLabel.x - 8} y={strongLabel.y + 14} textAnchor="middle" fontSize="8.5" fill="#059669">Strong</text>
      </svg>
    </div>
  );
}
Gauge.propTypes = { roi: PropTypes.number.isRequired };

/** Invested vs returned, as two proportional horizontal bars. */
export function BarChart({ invested, returned, symbol }) {
  const max = Math.max(invested, returned, 1);
  const bars = [
    { label: "Invested", value: invested, color: "#2563EB" },
    { label: "Returned", value: returned, color: returned >= invested ? "#10B981" : "#EF4444" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      {bars.map((bar) => (
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
BarChart.propTypes = {
  invested: PropTypes.number.isRequired,
  returned: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
};

/** The user's annualized return stacked against the market benchmarks. */
export function BenchmarkBar({ annualized }) {
  const max = Math.max(...BENCHMARKS.map((b) => b.roi), annualized, 5);
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
      {BENCHMARKS.map((b) => (
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
BenchmarkBar.propTypes = { annualized: PropTypes.number.isRequired };
