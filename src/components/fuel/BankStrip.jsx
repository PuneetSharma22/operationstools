// Vertical strip mimicking the bank-branded thermal paper roll seen on real
// Indian fuel-station receipts: a repeating bank-logo chip alternating
// with small roll/batch codes, running the full height of the receipt.
// It doesn't reserve its own column — it overlays the card's existing
// right-side padding and sits BEHIND the receipt text (negative z-index),
// so printed text always wins wherever the two would otherwise overlap.
//
// The bank logo is supplied by the end user via a URL (same pattern as
// the existing station `logoUrl` field) — this component never bundles
// or hardcodes any specific bank's artwork. If no logoUrl is given, or if
// the supplied URL fails to actually load, it falls back to a generic
// abstract icon + the bank name as plain text rather than showing a
// broken-image glyph.
//
// The logo is rendered as a CSS background-image on a rotated div (not a
// rotated <img> tag) — this sidesteps a class of bugs where an <img> with
// object-fit + an absolute-position + rotate transform combo fails to
// paint correctly in some browsers, and background-size:"cover" naturally
// fills the slot edge-to-edge without extra math.
//
// Load success/failure is detected via a background `new Image()` probe
// before ever attempting to render it visibly, via the useImageStatus hook
// below — this guarantees we never show a half-loaded/broken state.

import { useState, useEffect } from "react";

export const STRIP_INSET = 4; // distance from the card's right edge
const COLUMN_WIDTH = 14;
const LOGO_LENGTH = 84;   // matches the roughly 5:1 aspect of typical bank wordmark logos, with headroom so nothing gets cropped
const LOGO_THICKNESS = 16;

function useImageStatus(url) {
  const [status, setStatus] = useState(url ? "loading" : "empty");

  useEffect(() => {
    if (!url) {
      setStatus("empty");
      return;
    }
    setStatus("loading");
    const probe = new Image();
    probe.onload = () => setStatus("loaded");
    probe.onerror = () => setStatus("error");
    probe.src = url;
    return () => {
      probe.onload = null;
      probe.onerror = null;
    };
  }, [url]);

  return status;
}

function MiniIcon({ primary, accent }) {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" style={{ flexShrink: 0 }}>
      <rect x="0" y="0" width="4" height="4" rx="1" fill={accent} />
      <rect x="6" y="0" width="4" height="4" rx="1" fill={primary} />
      <rect x="0" y="6" width="4" height="4" rx="1" fill={primary} />
      <rect x="6" y="6" width="4" height="4" rx="1" fill={accent} />
    </svg>
  );
}

// Fallback badge used when no logoUrl is supplied, or it fails to load.
function StripBadgeText({ bank, primary, accent }) {
  return (
    <div
      style={{
        position: "relative",
        width: COLUMN_WIDTH,
        height: 56,
        flexShrink: 0,
        background: "#e9edf3",
        borderRadius: 3,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-90deg)",
          display: "flex",
          alignItems: "center",
          gap: 4,
          whiteSpace: "nowrap",
        }}
      >
        <MiniIcon primary={primary} accent={accent} />
        <span
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontWeight: 700,
            fontSize: 8,
            letterSpacing: 0.4,
            color: primary,
          }}
        >
          {bank}
        </span>
      </div>
    </div>
  );
}

// Used once the end-user-supplied logo URL is confirmed loaded. Rendered as
// a rotated div with a CSS background-image (not a rotated <img>), sized
// (length x thickness) BEFORE rotation so its footprint after the -90deg
// rotate becomes (thickness x length) — matching the strip's narrow column.
// background-size:"cover" fills the slot edge-to-edge; reduced opacity
// mimics the slightly faded look of a logo pre-printed on thermal roll
// paper rather than a fresh flat image.
function StripBadgeImage({ url, length = LOGO_LENGTH, thickness = LOGO_THICKNESS, opacity = 0.55 }) {
  return (
    <div style={{ position: "relative", width: thickness, height: length, flexShrink: 0, overflow: "hidden", borderRadius: 2 }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: length,
          height: thickness,
          transform: "translate(-50%, -50%) rotate(-90deg)",
          backgroundImage: `url("${url}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity,
        }}
      />
    </div>
  );
}

function StripCode({ text }) {
  return (
    <div style={{ position: "relative", width: COLUMN_WIDTH, height: 30, flexShrink: 0 }}>
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-90deg)",
          whiteSpace: "nowrap",
          color: "#8b93a1",
          fontFamily: "'Courier New', monospace",
          fontSize: 8,
          letterSpacing: 0.5,
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default function BankStrip({
  logoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/3840px-HDFC_Bank_Logo.svg.png", // public URL, overridden by data.bankLogoUrl once wired into the form
  bank = "BANK",      // fallback label, used if there's no logoUrl or it fails to load
  color = "#1B3A6B",
  accentColor = "#E4002B",
  codes = ["A127016", "5001"],
  itemCount = 8,
}) {
  const imgStatus = useImageStatus(logoUrl);
  const useImage = imgStatus === "loaded";

  const sequence = Array.from({ length: itemCount }, (_, i) =>
    i % 2 === 0
      ? { type: "code", text: codes[(i / 2) % codes.length] }
      : { type: "logo" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: STRIP_INSET,
        width: useImage ? LOGO_THICKNESS : COLUMN_WIDTH,
        zIndex: -1,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {sequence.map((item, i) =>
        item.type === "logo" ? (
          useImage ? (
            <StripBadgeImage key={i} url={logoUrl} />
          ) : (
            <StripBadgeText key={i} bank={bank} primary={color} accent={accentColor} />
          )
        ) : (
          <StripCode key={i} text={item.text} />
        )
      )}
    </div>
  );
}
