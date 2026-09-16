import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * "Save ▾" split button offering PDF / PNG export of the live preview.
 * Shared by the fuel and rent generator pages, which each carried an
 * identical private copy.
 */
export default function SaveMenu({ onSave, downloading = false, small = false }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const choose = (format) => { setOpen(false); onSave(format); };

  return (
    <div ref={wrapRef} className="no-print" style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={downloading}
        style={{
          background: "linear-gradient(135deg,#2563EB,#4F46E5)", border: "none",
          borderRadius: 8, padding: small ? "6px 12px" : "8px 16px", color: "#fff",
          fontSize: small ? 12 : 13, fontWeight: 600, cursor: downloading ? "wait" : "pointer",
          opacity: downloading ? 0.7 : 1, display: "flex", alignItems: "center", gap: 6,
        }}
      >
        <svg width={small ? 12 : 13} height={small ? 12 : 13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {downloading ? "Saving…" : "Save"}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 12px 28px rgba(0,0,0,0.14)", overflow: "hidden", zIndex: 30, minWidth: 150 }}>
          <button onClick={() => choose("pdf")} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "#fff", border: "none", borderBottom: "1px solid #F1F5F9", fontSize: 13, color: "#0F172A", cursor: "pointer" }}>Save as PDF</button>
          <button onClick={() => choose("png")} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "#fff", border: "none", fontSize: 13, color: "#0F172A", cursor: "pointer" }}>Save as PNG</button>
        </div>
      )}
    </div>
  );
}

SaveMenu.propTypes = {
  /** Called with "pdf" or "png". */
  onSave: PropTypes.func.isRequired,
  /** Disables the button and shows "Saving…". */
  downloading: PropTypes.bool,
  /** Compact variant used inside the preview header. */
  small: PropTypes.bool,
};
