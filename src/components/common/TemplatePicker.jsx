import PropTypes from "prop-types";

/**
 * Numbered template chooser that sits directly above the live preview on the
 * fuel and rent generator pages (identical markup in both before extraction).
 */
export default function TemplatePicker({ templates, activeId, onSelect }) {
  const active = templates.find((t) => t.id === activeId);
  return (
    <div className="no-print" style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", marginBottom: 10 }}>Choose Template</p>
      <div style={{ display: "flex", gap: 8 }}>
        {templates.map((t, i) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            title={t.label}
            style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              border: activeId === t.id ? "2px solid #2563EB" : "2px solid #E2E8F0",
              background: activeId === t.id ? "#2563EB" : "#fff",
              color: activeId === t.id ? "#fff" : "#0F172A",
              boxShadow: activeId === t.id ? "0 2px 8px rgba(37,99,235,0.35)" : "none",
              fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 13, marginTop: 10, marginBottom: 0 }}>
        <span style={{ fontWeight: 700, color: "#0F172A" }}>{active?.label}</span>
        <span style={{ color: "#94A3B8" }}> — {active?.desc}</span>
      </p>
    </div>
  );
}

TemplatePicker.propTypes = {
  templates: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    desc: PropTypes.string,
  })).isRequired,
  activeId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
