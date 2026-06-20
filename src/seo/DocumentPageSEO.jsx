/**
 * DocumentPageSEO.jsx
 *
 * ─── PROGRAMMATIC SEO TEMPLATE ───────────────────────────────────────────────
 *
 * This component renders the SEO content section that lives BELOW the tool
 * on every document generator page. It is the shared scaffold for all 100+
 * pages on OpsTools.
 *
 * TEMPLATE vs UNIQUE split:
 *
 *   SHARED (same component, different props):
 *     - Section structure (H2s, FAQ accordion, schema injection)
 *     - Visual layout and styling
 *     - Internal links footer
 *     - Trust badges
 *     - "How to use" step layout
 *
 *   UNIQUE per page (passed as props):
 *     - documentName        e.g. "Fuel Bill"
 *     - documentSlug        e.g. "fuel-bill"
 *     - intro               300-word intro paragraph(s)
 *     - whatIs              definition paragraph
 *     - whyUse              reasons array
 *     - features            features array
 *     - howToSteps          steps array
 *     - benefits            benefits array
 *     - formatFields        table rows
 *     - faqs                Q&A array
 *     - relatedDocs         related links array
 *     - schemas             JSON-LD array (injected via useSEO)
 *
 * To add a new page (e.g. Rent Receipt):
 *   1. Create /src/pages/documents/RentReceiptPage.jsx
 *   2. Import DocumentPageSEO and pass page-specific props
 *   3. Done — all SEO structure, schema, FAQ accordion auto-inherit
 */

import { useState } from "react";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ children }) {
  return (
    <h2
      style={{
        fontSize: 22,
        fontWeight: 700,
        color: "#0F172A",
        margin: "0 0 14px",
        letterSpacing: "-0.01em",
        paddingTop: 8,
      }}
    >
      {children}
    </h2>
  );
}

function Prose({ children, style = {} }) {
  return (
    <p
      style={{
        fontSize: 15,
        color: "#475569",
        lineHeight: 1.8,
        margin: "0 0 16px",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #E2E8F0", margin: "36px 0" }} />;
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid #E2E8F0",
        padding: "0",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "16px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", lineHeight: 1.5 }}>
          {q}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: open ? "#2563EB" : "#F1F5F9",
            color: open ? "#fff" : "#64748B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            transition: "background 0.2s",
            marginTop: 2,
          }}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 0 16px", fontSize: 14, color: "#64748B", lineHeight: 1.75 }}>
          {a}
        </div>
      )}
    </div>
  );
}

function TrustBadges() {
  const badges = [
    { icon: "🔒", label: "100% Private", sub: "Data never leaves your browser" },
    { icon: "⚡", label: "Instant PDF", sub: "Print or save in one click" },
    { icon: "🇮🇳", label: "India-specific", sub: "GST & compliance formats" },
    { icon: "✅", label: "Free forever", sub: "No login, no payment" },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 12,
        margin: "24px 0",
      }}
    >
      {badges.map((b) => (
        <div
          key={b.label}
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: "14px 12px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 6 }}>{b.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 3 }}>
            {b.label}
          </div>
          <div style={{ fontSize: 11.5, color: "#94A3B8", lineHeight: 1.4 }}>{b.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DocumentPageSEO({
  documentName,      // "Fuel Bill"
  documentSlug,      // "fuel-bill"
  intro,             // JSX or string — 300 words
  whatIs,            // string
  whyUse = [],       // [{ title, body }]
  features = [],     // [{ icon, title, body }]
  howToSteps = [],   // [{ step, title, body }]
  benefits = [],     // [string]
  formatFields = [], // [{ field, description, example }]
  faqs = [],         // [{ q, a }]
  relatedDocs = [],  // [{ name, href, description }]
}) {
  return (
    <article
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "56px 24px 80px",
        fontFamily: "inherit",
      }}
    >
      {/* ── Intro ── */}
      <section>
        <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.85 }}>{intro}</div>
        <TrustBadges />
      </section>

      <Divider />

      {/* ── What is a [Document]? ── */}
      <section>
        <SectionHeading>What is a {documentName}?</SectionHeading>
        <Prose>{whatIs}</Prose>
      </section>

      <Divider />

      {/* ── Why Use a Generator? ── */}
      <section>
        <SectionHeading>Why Use a {documentName} Generator?</SectionHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
          {whyUse.map((w, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 14,
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "14px 16px",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#DBEAFE",
                  color: "#1D4ED8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 3 }}>
                  {w.title}
                </div>
                <div style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.65 }}>{w.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── Features ── */}
      <section>
        <SectionHeading>Features</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginTop: 8,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "16px",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── How to Generate ── */}
      <section>
        <SectionHeading>How to Generate a {documentName}</SectionHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
          {howToSteps.map((s, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 16, paddingBottom: 20, position: "relative" }}
            >
              {/* Connector line */}
              {i < howToSteps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 15,
                    top: 32,
                    bottom: 0,
                    width: 2,
                    background: "#E2E8F0",
                  }}
                />
              )}
              <div
                style={{
                  flexShrink: 0,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  zIndex: 1,
                }}
              >
                {s.step}
              </div>
              <div style={{ paddingTop: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 3 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.65 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── Benefits ── */}
      <section>
        <SectionHeading>Benefits of Using OpsTools {documentName} Generator</SectionHeading>
        <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {benefits.map((b, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "#2563EB", fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: 14, color: "#475569", lineHeight: 1.65 }}>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <Divider />

      {/* ── Format Table ── */}
      {formatFields.length > 0 && (
        <section>
          <SectionHeading>{documentName} Format — Key Fields</SectionHeading>
          <Prose>
            A standard {documentName.toLowerCase()} in India contains the following fields. All are
            available in our generator:
          </Prose>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13.5,
                marginTop: 8,
              }}
            >
              <thead>
                <tr style={{ background: "#F1F5F9" }}>
                  <th style={thStyle}>Field</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Example</th>
                </tr>
              </thead>
              <tbody>
                {formatFields.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#F8FAFC" }}>
                    <td style={tdStyle}><strong>{row.field}</strong></td>
                    <td style={tdStyle}>{row.description}</td>
                    <td style={{ ...tdStyle, color: "#64748B", fontFamily: "monospace" }}>{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <Divider />

      {/* ── FAQs ── */}
      <section>
        <SectionHeading>Frequently Asked Questions</SectionHeading>
        <div style={{ marginTop: 8 }}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      <Divider />

      {/* ── Related Documents ── */}
      {relatedDocs.length > 0 && (
        <section>
          <SectionHeading>Related Documents</SectionHeading>
          <Prose>
            Looking for other business documents? OpsTools has you covered.
          </Prose>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
              marginTop: 8,
            }}
          >
            {relatedDocs.map((doc, i) => (
              <a
                key={i}
                href={doc.href}
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  padding: "14px 16px",
                  textDecoration: "none",
                  transition: "box-shadow 0.2s",
                  display: "block",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}
                >
                  {doc.name}
                </div>
                <div style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.5 }}>
                  {doc.description}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

// ─── Table styles ─────────────────────────────────────────────────────────────
const thStyle = {
  padding: "10px 14px",
  textAlign: "left",
  fontWeight: 600,
  color: "#374151",
  borderBottom: "1px solid #E2E8F0",
};
const tdStyle = {
  padding: "10px 14px",
  color: "#374151",
  borderBottom: "1px solid #F1F5F9",
  verticalAlign: "top",
};
