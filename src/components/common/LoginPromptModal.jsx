import PropTypes from "prop-types";
import Modal from "./Modal";

/**
 * Shown when an anonymous visitor clicks "Generate in Bulk". Bulk generation
 * spends credits and therefore needs an account; single documents never do.
 *
 * `unitLabel` is the only thing that differed between the fuel and rent
 * copies of this modal ("Single bills…" vs "Single receipts…").
 */
export default function LoginPromptModal({ onClose, unitLabel = "bills" }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "32px 28px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 20px", background: "linear-gradient(135deg,#EFF6FF,#EEF2FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>⚡</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 10px" }}>Sign in to generate in bulk</h2>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65, margin: "0 0 28px" }}>
          Bulk generation uses credits. Create a free account to get started.<br />
          Single {unitLabel} are always free — no login needed.
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <a href="/login" style={{ flex: 1, height: 44, borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#0F172A", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Log in</a>
          <a href="/signup" style={{ flex: 1, height: 44, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Sign up free →</a>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Continue without account</button>
      </div>
    </Modal>
  );
}

LoginPromptModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  /** Plural noun for the free single-document case, e.g. "bills"/"receipts". */
  unitLabel: PropTypes.string,
};
