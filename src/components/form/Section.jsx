import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Collapsible titled group of form fields. Shared by the fuel, restaurant and
 * rent forms, which each used to define an identical private copy.
 *
 * The open/close animation uses the grid-template-rows 0fr→1fr trick so the
 * panel can animate to its natural height without a hard-coded max-height.
 */
export default function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-surface hover:bg-surface-alt transition-colors duration-150"
        style={{ cursor: "pointer" }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
          {title}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.28s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="px-5 py-4 bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
}

Section.propTypes = {
  title: PropTypes.node.isRequired,
  /** Whether the section starts expanded. */
  defaultOpen: PropTypes.bool,
  children: PropTypes.node,
};
