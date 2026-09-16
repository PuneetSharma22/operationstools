import PropTypes from "prop-types";
import { SavePdfButton } from "./inputs";

/** Results for the "Others" tab — whichever deposit calculator is active. */
export default function OthersResultPanel({ result, onPrint }) {
  if (!result) {
    return (
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>👆</div>
        <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>Select an account type and fill in the details to see results here</p>
      </div>
    );
  }

  const { cards, risk, interpretation } = result;
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Results</h2>
        <SavePdfButton onClick={onPrint} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 16 }}>
        {cards.map((c) => (
          <div key={c.label} style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 18px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>{c.label}</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: c.accent }}>{c.value}</span>
          </div>
        ))}
      </div>

      <div style={{ background: risk.bg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${risk.color}25` }}>
        <p style={{ fontSize: 12, color: risk.color, fontWeight: 700, margin: "0 0 5px" }}>{risk.icon} {risk.label}</p>
        <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.65 }}>{interpretation}</p>
      </div>
    </div>
  );
}

OthersResultPanel.propTypes = {
  /** null until a calculator has produced a figure. */
  result: PropTypes.shape({
    cards: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string, value: PropTypes.string, accent: PropTypes.string,
    })).isRequired,
    risk: PropTypes.shape({ label: PropTypes.string, color: PropTypes.string, bg: PropTypes.string, icon: PropTypes.string }).isRequired,
    interpretation: PropTypes.string.isRequired,
  }),
  onPrint: PropTypes.func.isRequired,
};
