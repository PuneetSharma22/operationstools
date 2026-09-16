import PropTypes from "prop-types";

// Input primitives for the ROI calculator: the slider+number combo used by
// every tab, a small numeric "months" box, a preset pill row, and the stat
// tile shown in the results panel.

const numberBoxStyle = { height: 36, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 14, fontWeight: 600, color: "#0F172A", outline: "none", textAlign: "right" };

/** Pill row of quick-pick values. */
export function PresetRow({ presets, value, onChange, accent = "#2563EB", tint = "#EFF6FF", activeText = "#2563EB", padY = 3 }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {presets.map((p) => (
        <button key={p.label} onClick={() => onChange(p.value)} style={{
          fontSize: 11, padding: `${padY}px 10px`, borderRadius: 999,
          border: value === p.value ? `1.5px solid ${accent}` : "1.5px solid #E2E8F0",
          background: value === p.value ? tint : "#fff",
          color: value === p.value ? activeText : "#64748B",
          cursor: "pointer", fontWeight: 600,
        }}>{p.label}</button>
      ))}
    </div>
  );
}
PresetRow.propTypes = {
  presets: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.number })).isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  accent: PropTypes.string,
  tint: PropTypes.string,
  activeText: PropTypes.string,
  /** Vertical padding in px — the bank-rate row runs slightly taller. */
  padY: PropTypes.number,
};

/**
 * Labelled slider with a paired number box, so a value can be dragged
 * approximately or typed exactly. The visible track is a plain div; the real
 * <input type="range"> sits transparently on top of it.
 */
export function SliderInput({ label, value, min, max, step, onChange, symbol, suffix, presets }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {symbol && <span style={{ fontSize: 13, color: "#94A3B8" }}>{symbol}</span>}
          <input type="number" value={value} min={min} max={max} step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ ...numberBoxStyle, width: 110 }} />
          {suffix && <span style={{ fontSize: 13, color: "#94A3B8" }}>{suffix}</span>}
        </div>
      </div>
      <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 4, background: "#E2E8F0", borderRadius: 2 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#2563EB,#4F46E5)", borderRadius: 2 }} />
        </div>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "absolute", width: "100%", opacity: 0, cursor: "pointer", height: 20 }} />
      </div>
      {presets && <div style={{ marginTop: 8 }}><PresetRow presets={presets} value={value} onChange={onChange} /></div>}
    </div>
  );
}
SliderInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  /** Currency symbol shown before the number box. */
  symbol: PropTypes.string,
  /** Unit shown after the number box, e.g. "%" or "yrs". */
  suffix: PropTypes.string,
  presets: PropTypes.array,
};

/** Number box for a tenure in months, with an optional preset row below. */
export function MonthsInput({ label, value, onChange, min = 1, max = 120, presets, presetProps }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="number" value={value} min={min} max={max} onChange={(e) => onChange(Number(e.target.value))}
            style={{ ...numberBoxStyle, width: 70 }} />
          <span style={{ fontSize: 13, color: "#94A3B8" }}>months</span>
        </div>
      </div>
      {presets && <PresetRow presets={presets} value={value} onChange={onChange} {...presetProps} />}
    </div>
  );
}
MonthsInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  presets: PropTypes.array,
  presetProps: PropTypes.object,
};

/** One headline figure in the results panel. */
export function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "14px 16px", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent || "#0F172A", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  sub: PropTypes.node,
  accent: PropTypes.string,
};

/** Gradient "Save PDF" button used above both results panels. */
export function SavePdfButton({ onClick }) {
  return (
    <button onClick={onClick} style={{
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
  );
}
SavePdfButton.propTypes = { onClick: PropTypes.func.isRequired };

/** Card shell shared by the calculators on the "Others" tab. */
export function CalculatorCard({ icon, iconBg, title, subtitle, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>{title}</h2>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
CalculatorCard.propTypes = {
  icon: PropTypes.node.isRequired,
  iconBg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node,
};
