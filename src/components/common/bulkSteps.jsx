import { useRef } from "react";
import PropTypes from "prop-types";

// The chrome of the bulk-generation wizard — credit balance, step dots,
// upload dropzone, progress and success screens. The fuel-bill and
// rent-receipt modals carried byte-identical copies of all of this; only the
// CSV column help text and the preview table actually differ between them,
// so those stay in the per-document modals.

const STEPS = ["upload", "preview", "generating", "done"];

export function CreditsBar({ credits }) {
  const positive = credits !== null && credits > 0;
  return (
    <div style={{ background: positive ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${positive ? "#BBF7D0" : "#FCA5A5"}`, borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13, color: "#374151" }}>Your credit balance</span>
      <span style={{ fontSize: 15, fontWeight: 800, color: positive ? "#059669" : "#DC2626" }}>
        {credits === null ? "Loading..." : `${credits} credits`}
      </span>
    </div>
  );
}
CreditsBar.propTypes = { credits: PropTypes.number };

// NOTE: the "completed" (green) test below is carried over verbatim from the
// two page copies, including its off-by-one: it compares the current step's
// index in a 3-element list against each dot's index in the 4-element list,
// so a dot only turns green once it is *two* steps behind. Left as-is because
// this extraction is meant to be behaviour-preserving; fixing it is a
// separate, visible change.
const COMPLETED_SCALE = ["preview", "generating", "done"];

export function StepsIndicator({ step }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: step === s ? "#2563EB" : COMPLETED_SCALE.indexOf(step) > STEPS.indexOf(s) ? "#D1FAE5" : "#F1F5F9", color: step === s ? "#fff" : "#64748B" }}>{i + 1}</div>
          <span style={{ fontSize: 12, color: step === s ? "#2563EB" : "#94A3B8", fontWeight: step === s ? 700 : 400, textTransform: "capitalize" }}>{s === "generating" ? "Generating" : s}</span>
          {i < 3 && <div style={{ width: 20, height: 1, background: "#E2E8F0" }} />}
        </div>
      ))}
    </div>
  );
}
StepsIndicator.propTypes = { step: PropTypes.oneOf(STEPS).isRequired };

export function ModalHeader({ title, onClose }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Bulk Generation</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0 }}>{title}</h2>
      </div>
      <button onClick={onClose} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#64748B", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
    </div>
  );
}
ModalHeader.propTypes = { title: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired };

export function UploadStep({ errors, dragOver, onDragOver, onDragLeave, onDrop, onFile, onDownloadTemplate, children }) {
  const fileInputRef = useRef(null);
  return (
    <div>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ border: `2px dashed ${dragOver ? "#2563EB" : "#E2E8F0"}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "#EFF6FF" : "#FAFAFA", transition: "all 0.15s", marginBottom: 16 }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Drop your CSV here or click to browse</div>
        <div style={{ fontSize: 13, color: "#64748B" }}>Only .csv files accepted</div>
        <input ref={fileInputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => onFile(e.target.files[0])} />
      </div>

      {errors.length > 0 && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
          {errors.map((e, i) => <div key={i} style={{ fontSize: 13, color: "#DC2626" }}>⚠ {e}</div>)}
        </div>
      )}

      <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px 20px", border: "1px solid #E2E8F0" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>CSV Format</div>
        <div style={{ fontSize: 12, color: "#64748B", marginBottom: 10, lineHeight: 1.6 }}>{children}</div>
        <button onClick={onDownloadTemplate} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#fff", border: "1.5px solid #2563EB", color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          ⬇ Download CSV Template
        </button>
      </div>
    </div>
  );
}
UploadStep.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  dragOver: PropTypes.bool,
  onDragOver: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onFile: PropTypes.func.isRequired,
  onDownloadTemplate: PropTypes.func.isRequired,
  /** Document-specific column documentation. */
  children: PropTypes.node,
};

export function LegendNote() {
  return (
    <p style={{ fontSize: 11.5, color: "#94A3B8", margin: "-10px 0 16px" }}>
      <span style={{ fontStyle: "italic" }}>Italic</span> = left blank, default value shown · <span style={{ color: "#CBD5E1" }}>—</span> = "NA" entered, left blank on purpose
    </p>
  );
}

export function CreditCostPanel({ noun, count, credits, hasEnoughCredits }) {
  return (
    <>
      <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px 20px", border: "1px solid #E2E8F0", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>{noun} to generate</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{count}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Credits required</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>{count} credits</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #E2E8F0" }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Your balance after</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: hasEnoughCredits ? "#059669" : "#DC2626" }}>
            {credits !== null ? `${credits - count} credits` : "—"}
          </span>
        </div>
      </div>

      {!hasEnoughCredits && credits !== null && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#DC2626" }}>
          Not enough credits. You need {count} but have {credits}.{" "}
          <a href="/account" style={{ color: "#DC2626", fontWeight: 700 }}>Request more credits →</a>
        </div>
      )}
    </>
  );
}
CreditCostPanel.propTypes = {
  /** "Bills" / "Receipts" — what is being generated. */
  noun: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  credits: PropTypes.number,
  hasEnoughCredits: PropTypes.bool.isRequired,
};

export function RealisticLookToggle({ checked, onChange, description }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, marginBottom: 16, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#2563EB" }} />
      <span style={{ fontSize: 13, color: "#374151" }}>
        <b>Make it look real</b> — {description}
      </span>
    </label>
  );
}
RealisticLookToggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
};

export function GeneratingStep({ noun, progress, total }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>Generating your {noun}…</h3>
      <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 28px" }}>Processing {noun.replace(/s$/, "")} {Math.round((progress / 100) * total)} of {total}</p>
      <div style={{ background: "#F1F5F9", borderRadius: 999, height: 8, overflow: "hidden", maxWidth: 320, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#2563EB,#4F46E5)", height: "100%", width: `${progress}%`, borderRadius: 999, transition: "width 0.3s" }} />
      </div>
      <div style={{ fontSize: 13, color: "#64748B", marginTop: 12 }}>{progress}% complete</div>
    </div>
  );
}
GeneratingStep.propTypes = {
  noun: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export function DoneStep({ noun, savedNoun, count, remainingCredits, onClose, onRestart }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>All {noun} generated!</h3>
      <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 8px" }}>{count} {savedNoun || noun} saved as a single PDF.</p>
      <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 28px" }}>Remaining credits: {remainingCredits}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>Done</button>
        <button onClick={onRestart} style={{ padding: "12px 28px", borderRadius: 10, background: "#F8FAFC", color: "#374151", fontSize: 14, fontWeight: 600, border: "1px solid #E2E8F0", cursor: "pointer" }}>Generate another batch</button>
      </div>
    </div>
  );
}
DoneStep.propTypes = {
  /** Short plural, e.g. "bills" — used in the headline. */
  noun: PropTypes.string.isRequired,
  /** Qualified plural, e.g. "fuel bills" — used in the body line. */
  savedNoun: PropTypes.string,
  count: PropTypes.number.isRequired,
  remainingCredits: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onRestart: PropTypes.func.isRequired,
};

export function GenerateButton({ label, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width: "100%", height: 48, borderRadius: 12, border: "none", cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "#F1F5F9" : "linear-gradient(135deg,#2563EB,#4F46E5)", color: disabled ? "#94A3B8" : "#fff", fontSize: 15, fontWeight: 700 }}
    >
      {label}
    </button>
  );
}
GenerateButton.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export function PreviewHeader({ validCount, errorCount, onReupload }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
        {validCount} valid rows
        {errorCount > 0 && <span style={{ color: "#DC2626", marginLeft: 8 }}>· {errorCount} with errors</span>}
      </div>
      <button onClick={onReupload} style={{ fontSize: 12, color: "#64748B", background: "none", border: "none", cursor: "pointer" }}>← Upload different file</button>
    </div>
  );
}
PreviewHeader.propTypes = {
  validCount: PropTypes.number.isRequired,
  errorCount: PropTypes.number.isRequired,
  onReupload: PropTypes.func.isRequired,
};
