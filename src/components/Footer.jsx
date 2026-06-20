import { Link } from "react-router-dom";

// ─── OpsTools Logo SVG ────────────────────────────────────────────────────────
function OpsToolsLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ft-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#ft-logo-grad)" />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={6 + col * 7}
            y={6 + row * 7}
            width="5"
            height="5"
            rx="1.5"
            fill="white"
            opacity={0.3 + (row * 3 + col) * 0.08}
          />
        ))
      )}
    </svg>
  );
}

// ─── Watermark ────────────────────────────────────────────────────────────────
function OpsToolsWatermark() {
  return (
    <div
      style={{
        position: "absolute",
        right: 32,
        bottom: 28,
        opacity: 0.06,
        userSelect: "none",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <OpsToolsLogo size={48} />
      <span
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.03em",
        }}
      >
        OpsTools
      </span>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const footerLinks = [
  {
    heading: "Tools",
    links: [
      { label: "Fuel Bill Generator", href: "/documents/fuel-bill" },
      { label: "Rent Receipt", href: "/documents/rent-receipt" },
      { label: "GST Invoice", href: "#", soon: true },
      { label: "Salary Slip", href: "#", soon: true },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About OpsTools", href: "/about" },
      { label: "What's planned", href: "/about#roadmap" },
      { label: "Contact us", href: "/about#contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "How to save as PDF", href: "#", tip: true },
      { label: "What is HRA?", href: "#", tip: true },
      { label: "GST for small business", href: "#", tip: true },
    ],
  },
];

const facts = [
  "All documents are generated entirely in your browser — we never see your data.",
  "OpsTools is free to use. No hidden credits, no paywalls on core tools.",
  "Templates are based on real Indian petrol station and rental receipts.",
  "Works on mobile — generate a PDF and WhatsApp it in under 60 seconds.",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer
      style={{
        background: "#07011F",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        color: "#94A3B8",
        fontFamily: "inherit",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Main footer grid ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "56px 24px 40px",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
          gap: 40,
        }}
      >
        {/* Brand column */}
        <div>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              marginBottom: 18,
            }}
          >
            <OpsToolsLogo size={34} />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              OpsTools
            </span>
          </Link>

          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.75,
              color: "#64748B",
              margin: "0 0 24px",
              maxWidth: 260,
            }}
          >
            Free business document tools built for Indian small businesses — fuel bills, rent receipts, invoices, and more.
          </p>

          {/* Did-you-know fact */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 12,
              color: "#64748B",
              lineHeight: 1.65,
            }}
          >
            <span style={{ color: "#818CF8", fontWeight: 600, fontSize: 11, display: "block", marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Did you know
            </span>
            {facts[Math.floor(Date.now() / 86400000) % facts.length]}
          </div>
        </div>

        {/* Link columns */}
        {footerLinks.map((col) => (
          <div key={col.heading}>
            <h3
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#475569",
                margin: "0 0 16px",
              }}
            >
              {col.heading}
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    style={{
                      fontSize: 13.5,
                      color: link.soon || link.tip ? "#334155" : "#94A3B8",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                    onMouseEnter={(e) => !link.soon && (e.target.style.color = "#E2E8F0")}
                    onMouseLeave={(e) => !link.soon && (e.target.style.color = link.soon || link.tip ? "#334155" : "#94A3B8")}
                  >
                    {link.label}
                    {link.soon && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: "#475569",
                          background: "rgba(255,255,255,0.07)",
                          padding: "1px 6px",
                          borderRadius: 999,
                        }}
                      >
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 24px" }} />

      {/* ── Bottom bar ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 12.5, color: "#334155" }}>
          © {new Date().getFullYear()} OpsTools — free for Indian small businesses
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link
            to="/about"
            style={{ fontSize: 12.5, color: "#334155", textDecoration: "none" }}
            onMouseEnter={(e) => (e.target.style.color = "#94A3B8")}
            onMouseLeave={(e) => (e.target.style.color = "#334155")}
          >
            Privacy
          </Link>
          <Link
            to="/about"
            style={{ fontSize: 12.5, color: "#334155", textDecoration: "none" }}
            onMouseEnter={(e) => (e.target.style.color = "#94A3B8")}
            onMouseLeave={(e) => (e.target.style.color = "#334155")}
          >
            Terms
          </Link>
          <span style={{ fontSize: 12.5, color: "#1E293B", display: "flex", alignItems: "center", gap: 5 }}>
            Made with <span style={{ color: "#4F46E5", fontSize: 14 }}>♥</span> in India
          </span>
        </div>
      </div>

      {/* ── Background watermark ── */}
      <OpsToolsWatermark />
    </footer>
  );
}
