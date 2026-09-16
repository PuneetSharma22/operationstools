import PropTypes from "prop-types";

/**
 * Dark hero strip at the top of a document generator page: breadcrumb, title,
 * one-line pitch, and the "Generate in Bulk" call to action.
 * Shared by the fuel and rent generator pages.
 */
export default function DocumentToolHero({ crumb, title, subtitle, onBulkClick }) {
  return (
    <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 60%,#1e1b4b 100%)" }} className="fuel-hero-padding">
      <div style={{ padding: "40px 24px 36px", maxWidth: 1280, margin: "0 auto" }} className="fuel-hero-padding">
        <nav style={{ marginBottom: 16, fontSize: 13, color: "#475569" }}>
          <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a><span style={{ margin: "0 8px" }}>›</span>
          <a href="/documents" style={{ color: "#475569", textDecoration: "none" }}>Documents</a><span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "#94A3B8" }}>{crumb}</span>
        </nav>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.02em" }}>{title}</h1>
            <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>{subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} className="no-print">
            <button
              onClick={onBulkClick}
              style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.18)", padding: "10px 18px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, backdropFilter: "blur(8px)", transition: "background 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
              Generate in Bulk
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

DocumentToolHero.propTypes = {
  /** Last breadcrumb segment, e.g. "Fuel Bill Generator". */
  crumb: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  onBulkClick: PropTypes.func.isRequired,
};
